import { Elysia } from 'elysia'
import { users } from './controllers/users';
import { swagger } from '@elysiajs/swagger'
import packageJson from '../package.json';
import { cors } from '@elysiajs/cors';

const app = new Elysia()
  .onError(({ error, code }) => {
    if (code === 'NOT_FOUND') return 'Not Found :('
      console.error(error);
    })
    .use(
      cors({
        origin: 'http://localhost:5173'
      })
    )
  .use(users)
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Users app documentation',
          version: packageJson.version,
        },
        externalDocs: {
          description: 'Find out more about the Users API',
          url: 'www.example.com',
        },
        servers: [
          {
            url: 'http://localhost:3000/',
            description: 'Development server',
          },
        ],
        'x-speakeasy-retries': {
          strategy: 'backoff',
          backoff: {
            initialInterval: 500,
            maxInterval: 60000,
            maxElapsedTime: 3600000,
            exponent: 1.5,
          },
          statusCodes: ['5XX'],
          retryConnectionErrors: true,
        },
        tags: [{
          name: 'Users',
          description: 'Users operations',
          externalDocs: {
            description: 'Find more info here',
            url: 'https://example.com',
          },
        }],
      }
    })
  )
  .listen(3000)