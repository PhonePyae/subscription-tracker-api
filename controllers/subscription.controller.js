import Subscription from '../models/subscription.model.js';
import {workflowClient} from '../config/upstash.js';

// Get all subscriptions
export const getSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find();
        res.status(200).json({ success: true,count:subscriptions.length, data: subscriptions });
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        next(error);
    }
};

// Get a single subscription by ID
export const getSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({ success: false, message: "Subscription not found" });
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        console.error("Error fetching subscription:", error);
        next(error);
    }
};

// Create a subscripton
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${process.env.SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
          subscriptionId: subscription.id // Ensure subscriptionId is correctly passed
      },
      headers: {
          "content-type": "application/json"
      },
      retries: 0
  });  

    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    next(e);
  }
}

//Get subscription by user ID
export const getUserSubscriptions = async (req, res, next) => {
    try {
        if(req.user.id !== req.params.id){
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error; 
        }
        
        const subscription = await Subscription.find({user: req.params.id}); 

        res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        console.error("Error creating subscription:", error);
        next(error);
    }
};

