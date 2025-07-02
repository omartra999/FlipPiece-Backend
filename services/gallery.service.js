const { Gallery } = require('../models');

exports.createGalleryItem = async ({ title, description, mediaUrl, mediaType }) => {
    return await Gallery.create({ title, description, mediaUrl, mediaType });
};

exports.getAllGalleryItems = async () => {
    return await Gallery.findAll({ order: [['createdAt', 'DESC']] });
};

exports.getGalleryItemById = async (id) => {
    return await Gallery.findByPk(id);
};

exports.updateGalleryItem = async (id, updateData) => {
    const item = await Gallery.findByPk(id);
    if (!item) return null;
    return await item.update(updateData);
};

exports.deleteGalleryItem = async (id) => {
    const item = await Gallery.findByPk(id);
    if (!item) return false;
    await item.destroy();
    return true;
};