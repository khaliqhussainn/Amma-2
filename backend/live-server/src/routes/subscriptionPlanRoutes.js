const express = require('express');
const subscriptionPlanController = require('../controllers/subscriptionPlanController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.get('/active', subscriptionPlanController.getActivePlans);

// Protected routes (Admin only)
router.use(protect);
router.use(restrictTo('ADMIN'));

router
    .route('/')
    .get(subscriptionPlanController.getAllPlans)
    .post(subscriptionPlanController.createPlan);

router
    .route('/:id')
    .patch(subscriptionPlanController.updatePlan)
    .delete(subscriptionPlanController.deletePlan);

module.exports = router;
