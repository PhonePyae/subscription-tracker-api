import {Router} from 'express';
import authoize from '../middlewares/auth.middleware.js';
import { getUsers, getUser  } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/',getUsers);  
userRouter.get('/:id', authoize, getUser);  
userRouter.post('/',(req,res)=>res.send({title: 'CREATE new user'}));  
userRouter.put('/:id',(req,res)=>res.send({title: 'UPDATE user'}));  
userRouter.delete('/:id',(req,res)=>res.send({title: 'DELETE user'}));    

export default userRouter;