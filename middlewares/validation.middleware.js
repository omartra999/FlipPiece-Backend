const Joi = require('joi');

// Product validation schema
const productSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).max(2000).required(),
  price: Joi.number().positive().precision(2).required(),
  category: Joi.string().valid('fashion', 'möbel', 'design').required(),
  stock: Joi.number().integer().min(0).required(),
  options: Joi.object().optional(),
  isShippable: Joi.boolean().required(),
  isPickupOnly: Joi.boolean().required(),
  images: Joi.array().items(Joi.string()).optional(),
  thumbnail: Joi.string().optional()
});

// Order validation schema
const orderSchema = Joi.object({
  firebaseUid: Joi.string().required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required()
  }).required(),
  billingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required()
  }).required(),
  total: Joi.number().positive().precision(2).required(),
  status: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled').default('pending'),
  items: Joi.array().items(Joi.object({
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().positive().required(),
    price: Joi.number().positive().precision(2).required()
  })).min(1).required()
});

// User validation schema
const userProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    postalCode: Joi.string().optional(),
    country: Joi.string().optional()
  }).optional()
});

// Gallery validation schema
const gallerySchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).max(2000).optional(),
  mediaUrl: Joi.string().required(),
  mediaType: Joi.string().valid('image', 'video').required()
});

// DHL validation schema
// DHL Shipment validation schema (starter)
const dhlShipmentSchema = Joi.object({
  plannedShippingDateAndTime: Joi.string().isoDate().required(),
  productCode: Joi.string().required(),
  customerDetails: Joi.object({
    shipperDetails: Joi.object({
      name: Joi.string().required(),
      postalAddress: Joi.object({
        postalCode: Joi.string().required(),
        cityName: Joi.string().required(),
        countryCode: Joi.string().length(2).required(),
        addressLine1: Joi.string().required()
      }).required()
    }).required(),
    receiverDetails: Joi.object({
      name: Joi.string().required(),
      postalAddress: Joi.object({
        postalCode: Joi.string().required(),
        cityName: Joi.string().required(),
        countryCode: Joi.string().length(2).required(),
        addressLine1: Joi.string().required()
      }).required()
    }).required()
  }).required(),
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

module.exports = {
  validateProduct: validate(productSchema),
  validateOrder: validate(orderSchema),
  validateUserProfile: validate(userProfileSchema),
  validateGallery: validate(gallerySchema),
  validateDHL: validate(dhlShipmentSchema)
}; 