const express = require('express');
const galleryController = require('../controllers/gallery.controller');
const upload = require('../middlewares/upload.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const galleryRouter = express.Router();

galleryRouter.post('/', upload.single('media'), adminMiddleware, galleryController.createGalleryItem);
galleryRouter.get('/', galleryController.getAllGalleryItems);
galleryRouter.get('/:id', galleryController.getGalleryItemById);
galleryRouter.put('/:id', upload.single('media'), adminMiddleware, galleryController.updateGalleryItem);

module.exports = galleryRouter;