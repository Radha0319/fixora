// DB: Rating and review controller with recalculation
import { Rating } from '../models/Rating.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { ServiceProvider } from '../models/ServiceProvider.js';
import { createNotification } from '../services/notificationService.js';
import { SERVICE_REQUEST_STATUS } from '../config/constants.js';

// Submit Rating & Review for Completed Service
export const submitRating = async (req, res, next) => {
  try {
    const { serviceRequestId, rating, review } = req.body;

    if (!serviceRequestId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Service request ID and a rating between 1 and 5 are required.'
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a numeric score between 1 and 5.'
      });
    }

    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found.'
      });
    }

    // Only the customer who made the request can review
    if (serviceRequest.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the customer associated with this service can submit a rating.'
      });
    }

    // Rule #27: Ratings should be based on completed customer service interactions
    if (serviceRequest.status !== SERVICE_REQUEST_STATUS.COMPLETED) {
      return res.status(400).json({
        success: false,
        message: 'Cannot review service that is not yet completed. Current status: ' + serviceRequest.status
      });
    }

    if (serviceRequest.isRated) {
      return res.status(400).json({
        success: false,
        message: 'This service request has already been reviewed.'
      });
    }

    // Create rating
    const newRating = await Rating.create({
      serviceRequest: serviceRequest._id,
      customer: req.user._id,
      provider: serviceRequest.provider,
      rating: numRating,
      review: (review || '').trim()
    });

    serviceRequest.isRated = true;
    await serviceRequest.save();

    // Recalculate provider overall average rating (avoiding division by zero)
    const allProviderRatings = await Rating.find({ provider: serviceRequest.provider });
    const count = allProviderRatings.length;
    const totalSum = allProviderRatings.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = count > 0 ? Number((totalSum / count).toFixed(1)) : 0;

    await ServiceProvider.findOneAndUpdate(
      { user: serviceRequest.provider },
      {
        $set: {
          rating: averageRating,
          reviewCount: count
        }
      }
    );

    // NOTIFY: Notify provider of received rating
    await createNotification({
      recipientId: serviceRequest.provider,
      title: 'New Customer Review',
      message: `${req.user.name} rated your service ${numRating}/5: "${(review || '').slice(0, 60)}..."`,
      type: 'SERVICE_REQUEST',
      link: '/provider/dashboard'
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your rating and feedback have been recorded.',
      data: newRating
    });
  } catch (error) {
    next(error);
  }
};

// Get reviews for a provider
export const getProviderReviews = async (req, res, next) => {
  try {
    const { providerId } = req.params;

    const reviews = await Rating.find({ provider: providerId })
      .populate('customer', 'name profileImage')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};
