require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const STRIPE_BASE_URL = process.env.STRIPE_BASE_URL;

module.exports = {
    STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY,
    STRIPE_BASE_URL
}