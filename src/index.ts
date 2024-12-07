import { Elysia } from 'elysia'
import { users } from './controllers/users';

const app = new Elysia()
  .onError(({ error, code }) => {
    if (code === 'NOT_FOUND') return 'Not Found :('
      console.error(error);
    })
  .use(users)
  .listen(3000)