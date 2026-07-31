const SubscriptionPlan = require('../models/subscriptionPlanModel');
const AppError = require('../utils/AppError');

exports.getAllPlans = async (req, res, next) => {
    try {
        const plans = await SubscriptionPlan.getAll();
        res.status(200).json({
            status: 'success',
            results: plans.length,
            data: { plans }
        });
    } catch (error) {
        next(error);
    }
};

exports.getActivePlans = async (req, res, next) => {
    try {
        const plans = await SubscriptionPlan.getActive();
        res.status(200).json({
            status: 'success',
            results: plans.length,
            data: { plans }
        });
    } catch (error) {
        next(error);
    }
};

exports.createPlan = async (req, res, next) => {
    try {
        const { name } = req.body;
        const existing = await SubscriptionPlan.findByName(name);
        if (existing) {
            return next(new AppError('A plan with this name already exists', 400));
        }

        const planId = await SubscriptionPlan.create(req.body);
        const plan = await SubscriptionPlan.findById(planId);

        res.status(201).json({
            status: 'success',
            data: { plan }
        });
    } catch (error) {
        next(error);
    }
};

exports.updatePlan = async (req, res, next) => {
    try {
        const success = await SubscriptionPlan.update(req.params.id, req.body);
        if (!success) {
            return next(new AppError('Plan not found', 404));
        }

        const plan = await SubscriptionPlan.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: { plan }
        });
    } catch (error) {
        next(error);
    }
};

exports.deletePlan = async (req, res, next) => {
    try {
        const success = await SubscriptionPlan.delete(req.params.id);
        if (!success) {
            return next(new AppError('Plan not found', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};
