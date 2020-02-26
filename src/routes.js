/* import { Router } from 'express';

const routes = new Router();
routes.get('/', (req, res) =>
  res.json({
    message:
      'Clone do Modelo de Backend/Inicialização,  com sucrase, nodemon e debug configurado ..',
  })
);
 */

import { Router } from 'express';
import User from './app/models/User';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // todas as rotas abaixo desta linha deverao ter o token no header

routes.put('/users', UserController.update);
// get ("/") so p teste
routes.get('/', async (req, res) => {
  // esta rotina eh tratada no controller
  // aqui s'o para testar se gerou tudo bem
  // rodar yarn dev
  // ir no navegador e localhost:3333 deve retornar o usuario abaixo
  /*
  {
  "id": 1,
  "name": "Diego Fernandes",
  "email": "diegoarocketseat.com.br",
  "password_hash": "123456",
  "updatedAt": "2020-02-25T02:31:58.318Z",
  "createdAt": "2020-02-25T02:31:58.318Z",
  "provider": false
}
  */
  const user = await User.create({
    name: 'Diego Fernandes',
    email: 'diegoarocketseat.com.br',
    password_hash: '123456',
  });
  return res.json(user);
});

export default routes;
