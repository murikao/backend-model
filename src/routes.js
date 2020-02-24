import { Router } from 'express'

const routes = new Router()

routes.get('/', (req,res)=>{
  return res.json({message: "Modelo de Backend/Inicialização, com sucrase, nodemon e debug configurado"})
});

export default routes;
