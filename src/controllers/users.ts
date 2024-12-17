import { Elysia, t } from 'elysia';

const userInfo = t.Object({
  id: t.String(),
  name: t.String(),
  age: t.Number()
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
    user: userInfo
  })
  .get('/', ({ users }) => users.data)
  .get('/:id',({ users, params: { id }, error }) => {
    return users.data.find(user => user.id === id) ?? error(404, 'User not found :(')
    },
    {
      params: t.Object({
        id: t.String()
      })
    }
  )
  .post('/',({ users, body: user }) =>
    users.add(user),
    {
      body: t.Omit(userInfo, ['id'])
    }
  )
  .delete('/:id', ({ users, params: { id }, error }) => {
      return users.remove(id) ?? error(422, 'Invalid user')
    },
    {
      params: t.Object({
        id: t.String()
      })
    }   
  ) 
  .patch(
    '/:id',({ users, params: { id }, body: user, error }) => {
      return users.update(id, user) ?? error(422, 'Invalid user')
    },
    {
      params: t.Object({
        id: t.String()
      }),
      body: t.Partial(t.Omit(userInfo, ['id'])),
    }
  )