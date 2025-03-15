import { Router } from "express";
import authoize from '../middlewares/auth.middleware.js'; 
import { createSubscription, getSubscriptions, getUserSubscriptions, getSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", getSubscriptions);
subscriptionRouter.get("/:id", getSubscription);
subscriptionRouter.post("/", authoize, createSubscription);
subscriptionRouter.put("/:id", (req,res)=>res.send({title:"UPDATE subscription"}));
subscriptionRouter.delete("/:id", (req,res)=>res.send({title:"DELETE subscr iption"}));
subscriptionRouter.get("/user/:id", authoize, getUserSubscriptions);
subscriptionRouter.put("/:id/cancel", (req,res)=>res.send({title:"CANCEL subscription"}));
subscriptionRouter.get("/upcoming-renewals", (req,res)=>res.send({title:"GET upcoming renewals"}));
 
export default subscriptionRouter;