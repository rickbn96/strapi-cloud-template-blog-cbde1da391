'use strict';

/**
 * contact controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact.contact', ({ strapi }) => ({
  async create(ctx) {
    // Add timestamp to the data
    ctx.request.body.data = {
      ...ctx.request.body.data,
      date: new Date()
    };
    
    // Create the contact form submission
    const response = await super.create(ctx);
    
    return response;
  }
}));
