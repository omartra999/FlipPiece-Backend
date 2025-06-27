const express = require('express');
const { PORT, URL } = require('./config/env.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./models/index.js');

const userRouter = require('./routes/user.routes.js');
const productRouter = require('./routes/product.routes.js');
const orderRouter = require('./routes/order.routes.js');

db.sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Database connection error:', err));


// db.sequelize.sync({ force: true }).then(() => {
//  console.log("Drop and re-sync db.");
// });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

app.listen(PORT, () => {
  console.log(`Server is running on: ${URL}:${PORT}.`);
});


module.exports = app;