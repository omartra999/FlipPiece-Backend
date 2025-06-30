const express = require('express');
const galleryController = require('../controllers/gallery.controller');
const upload = require('../middlewares/upload.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const galleryRouter = express.Router();

galleryRouter.post('/', upload.single('media'), authMiddleware, galleryController.createGalleryItem);
galleryRouter.get('/', galleryController.getAllGalleryItems);
galleryRouter.get('/:id', galleryController.getGalleryItemById);
galleryRouter.put('/:id', upload.single('media'), authMiddleware, galleryController.updateGalleryItem);