const galleryService = require('../services/gallery.service');
const { uploadFileToFirebase } = require('../utils/firebaseStorage');

exports.createGalleryItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const { title, description, mediaType } = req.body;
    const destination = `gallery/${Date.now()}_${req.file.originalname}`;
    const mediaUrl = await uploadFileToFirebase(req.file, destination);
    const galleryItem = await galleryService.createGalleryItem({
      title,
      description,
      mediaUrl,
      mediaType,
    });
    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload file.', error: error.message });
  }
};

exports.getAllGalleryItems = async (req, res) => {
  try {
    const items = await galleryService.getAllGalleryItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch gallery items.', error: error.message });
  }
};

exports.getGalleryItemById = async (req, res) => {
  try {
    const item = await galleryService.getGalleryItemById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Gallery item not found.' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch gallery item.', error: error.message });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    const updated = await galleryService.updateGalleryItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Gallery item not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update gallery item.', error: error.message });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    const deleted = await galleryService.deleteGalleryItem(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Gallery item not found.' });
    res.json({ message: 'Gallery item deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete gallery item.', error: error.message });
  }
};