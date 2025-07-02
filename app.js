const express = require('express');
const { PORT, URL } = require('./config/env.js');
const cookieParser = require('cookie-parser');
const cors = require('cors'); //to be used: for cross-origin resource sharing after creating frontend
const helmet = require('helmet'); //to be used: for security
const rateLimit = require('express-rate-limit');
const compression = require('compression'); //to be used: for request compression
const db = require('./models/index.js');

const userRouter = require('./routes/user.routes.js');
const productRouter = require('./routes/product.routes.js');
const orderRouter = require('./routes/order.routes.js');
const shipmentRouter = require('./routes/shipment.routes.js');
const galleryRouter = require('./routes/gallery.routes.js');

db.sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Database connection error:', err));


// db.sequelize.sync({ force: true }).then(() => {
//  console.log("Drop and re-sync db.");
// });

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const app = express();

// Security middleware

app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/shipments', shipmentRouter);
app.use('/api/gallery', galleryRouter);


app.listen(PORT, () => {
  console.log(`Server is running on: ${URL}:${PORT}.`);
});


module.exports = app;