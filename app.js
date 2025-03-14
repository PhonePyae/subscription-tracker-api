import express from 'express';
import {config} from 'dotenv';
import color from 'colors';
import {connectDB} from './config/db.js';

// Route files
import userRouter from './routes/user.routes.js'; 
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';

// Load env vars 
config({path: './config/config.env'});

const app = express();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.get('/', (req,res)=>{
    res.send('<h1>Welcome to the Subscription Tracker API!</h1>');
});

const PORT = process.env.PORT || 5009;
app.listen(PORT, async() => {
    // Connect to database
    await connectDB();
    console.log(`Subscription Tracker API is running in ${process.env.NODE_ENV} Mode on PORT http://localhost:${PORT}.`);
});

export default app;