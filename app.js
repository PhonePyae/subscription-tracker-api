// Import required modules
import express from 'express'; // Express framework for handling HTTP requests
import { config } from 'dotenv'; // dotenv for loading environment variables
import colors from 'colors'; // colors package for adding color to console logs
import { connectDB } from './config/db.js'; // Import the database connection function

// Route files (modular route handlers)
import userRouter from './routes/user.routes.js'; 
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';

// Middleware files
import errorMiddleware from './middlewares/error.middleware.js'; // Custom error handler
import cookieParser from 'cookie-parser'; // Middleware to parse cookies
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

// Load environment variables from the config file
config({ path: './config/config.env' });

const app = express(); // Initialize Express app

// Middleware to parse incoming JSON data
app.use(express.json()); 

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Middleware for ArcJet security and request validation
app.use(arcjetMiddleware);

// Mounting route handlers
app.use('/api/v1/auth', authRouter); // Routes related to authentication
app.use('/api/v1/users', userRouter); // Routes related to user management
app.use('/api/v1/subscriptions', subscriptionRouter); // Routes for subscription management

// Global error handling middleware
app.use(errorMiddleware);

// Root route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Subscription Tracker API!</h1>'); // Send a basic welcome message
});

// Define the port, defaulting to 5009 if not specified in environment variables
const PORT = process.env.PORT || 5009;

// Start the server and connect to the database
app.listen(PORT, async () => {
    await connectDB(); // Establish database connection
    console.log(colors.green(`Subscription Tracker API is running in ${process.env.NODE_ENV} Mode on PORT http://localhost:${PORT}.`));
});

export default app;