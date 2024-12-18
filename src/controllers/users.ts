import { Elysia, t } from 'elysia';

const userInfo = t.Object({
  id: t.String({
    example: '1'
  }),
  name: t.String({
    example: 'Alice'
  }),
  age: t.Number({
    example: 20
  })
}, {
  title: 'User',
  description: 'User object',
  example: 
    {
      id: "1",
      name: "Alice",
      age: 20
    }
});

const idObject = t.Object({
  id: t.String({
    example: '1'
  })
}, {
  title: 'ID object',
  description: 'ID object',
  example: 
    {
      id: "1"
    }
});

const errorResponse = t.Object({
  status: t.Number({
    example: 404
  }),
  message: t.String({
    example: 'User not found :('
  })
}, {
  title: 'Error response',
  description: 'Error response object',
  example: 
    {
      status: 404,
      message: 'User not found :('
    }
});

const successResponse = t.Object({
  success: t.Boolean({
    example: true
  })
}, {
  title: 'Success response',
  description: 'Success response object',
  example: 
    {
      success: true
    }
});

type UserInfo = typeof userInfo.static;

class Users {
  constructor(
    public data: UserInfo[] = [
      {
        id: "1",
        name: "Alice",
        age: 20
      }
    ]
) {}

  add(user: Omit<UserInfo, "id">) {
    const id = String(this.data.length + 1);
    this.data.push({ id, ...user });
    return { id };
  }

  remove(id: string) {
    const newData = this.data.filter(user => user.id !== id);
    if (newData.length === this.data.length) return null;
    this.data = newData;
    return { success: true };
  }

  update(id: string, user: Partial<UserInfo>) {
    let found = false;
    this.data = this.data.map(u => {
      if (u.id === id) {
        found = true;
        return { ...u, ...user };
      }
      return u;
    });

    if (!found) return null;

    return { success: true };
  }
}

export const users = new Elysia({ prefix: '/users' })
  .decorate('users', new Users())
  .model({
    user: userInfo,
    id: idObject,
    errorResponse: errorResponse,
    successResponse: successResponse
  })
  .get('/', ({ users }) => users.data, 
    {
      detail: { 
        summary: 'Get all users', 
        description: 'Get all users from the database',
        responses: {
          200: {
            description: 'The array of users',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/user'
                  },
                },    
                examples: {
                  basic: {
                    value: [
                      {
                        id: "1",
                        name: "Alice",
                        age: 20
                      },
                      {
                        id: "2",
                        name: "Bob",
                        age: 25
                      }
                    ]
                  }
                }    
              }
            },
          },
          500: {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/errorResponse'
                },
                examples: {
                  "Server error": {
                    value: {
                      message: 'There was an error',
                      status: 500
                    }
                  }
                }
              }
            }
          }
        },
        tags: ['Users'] 
      },
    }
  )
  .get('/:id',({ users, params: { id }, error }) => {
      return users.data.find(user => user.id === id) ?? error(404, 'User not found :(')
    },
    {
      params: 'id',
      detail: { 
        summary: 'Get user', 
        description: 'Get user by id from the database',
        responses: {
          200: {
            description: 'The user object',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/user',
                },     
                examples: {
                  basic: {
                    value: 
                      {
                        id: "1",
                        name: "Alice",
                        age: 20
                      }
                  }
                }   
              }
            },
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/errorResponse'
                },
                examples: {
                  "User not found": {
                    value: {
                      message: 'User not found :(',
                      status: 404
                    }
                  }
                }
              }
            }
          }
        },
        tags: ['Users'] 
      },
    },
  )
  .post('/',({ users, body: user }) =>
    users.add(user),
    {
      body: 
        t.Omit(
          userInfo, ['id'], 
          {
            example: {
              name: "Alice",
              age: 20
            }
          }
        ),
      type: 'json',
      detail: { 
        summary: 'Create user', 
        description: 'Add user to the database',
        responses: {
          200: {
            description: 'The created users assigned id',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/id',
                },     
                examples: {
                  "Created user": {
                    value: {
                      id: "1",
                      name:  "Alice",
                      age: 20
                    }
                  }
                }
              }
            },
          },
          500: {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/errorResponse'
                },
                examples: {
                  "Server error": {
                    value: {
                      message: 'There was an error',
                      status: 500
                    }
                  }
                }
              }
            }
          }
        },
        'x-speakeasy-retries': {
          strategy: 'backoff',
          backoff: {
            initialInterval: 300,
            maxInterval: 40000,
            maxElapsedTime: 3000000,
            exponent: 1.2,
          },
          statusCodes: ['5XX'],
          retryConnectionErrors: true,
        },
        tags: ['Users']
      },
    }
  )
  .delete('/:id', ({ users, params: { id }, error }) => {
      return users.remove(id) ?? error(422, 'Invalid user')
    },
    {
      params: 'id',
      detail: { 
        summary: 'Delete user', 
        description: 'Delete user by id from the database',
        responses: {
          200: {
            description: 'Deleting user was successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/successResponse'
                },       
                examples: {
                  success: {
                    value: {
                      success: true
                    }
                  }
                }    
              }
            },
          },
          422: {
            description: 'Invalid user',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/errorResponse'
                },
                examples: {
                  "Invalid user": {
                    value: {
                      message: 'Invalid user',
                      status: 422
                    }
                  }
                }
              }
            }
          }
        },
        tags: ['Users'] 
      },
    }   
  ) 
  .patch(
    '/:id',({ users, params: { id }, body: user, error }) => {
      return users.update(id, user) ?? error(422, 'Invalid user')
    },
    {
      params: 'id',
      body: 
        t.Partial(
          t.Omit(
            userInfo, ['id'], 
            {
              example: {
                age: 21
              }
            }
          ),
        ),
      type: 'json',
      detail: { 
        summary: 'Update user', 
        description: 'Update user by id from the database',
        responses: {
          200: {
            description: 'Update was successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/successResponse'
                },       
                examples: {
                  Success: {
                    value: {
                      success: true
                    }
                  }
                }  
              }
            },
          },
          422: {
            description: 'Invalid user',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/errorResponse'
                },
                examples: {
                  "Invalid user": {
                    value: {
                      message: 'Invalid user',
                      status: 422
                    }
                  }
                }
              }
            }
          }
        },
        tags: ['Users'] 
      },
    }
  )