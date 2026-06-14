const app = require('./src/app');
const dotenv = require('dotenv');
const { initDB } = require('./src/config/db');
const SubscriptionPlan = require('./src/models/subscriptionPlanModel');

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await initDB();
        await SubscriptionPlan.seedInitialPlans();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
