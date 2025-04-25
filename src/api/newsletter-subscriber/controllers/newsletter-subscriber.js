'use strict';

/**
 * newsletter-subscriber controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::newsletter-subscriber.newsletter-subscriber', ({ strapi }) => ({
  async create(ctx) {
    // Add timestamp to the data
    ctx.request.body.data = {
      ...ctx.request.body.data,
      subscribedAt: new Date()
    };
    
    try {
      // Create the subscriber
      const response = await super.create(ctx);
      return response;
    } catch (error) {
      // Handle duplicate email error
      if (error.message.includes('duplicate key value')) {
        return ctx.conflict('Email already subscribed');
      }
      throw error;
    }
  }
}));
