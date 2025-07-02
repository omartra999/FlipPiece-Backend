const { Gallery } = require('../models');
const galleryService = require('../services/gallery.service');

describe('Gallery Service', () => {
  beforeEach(async () => {
    await Gallery.sync({ force: true });
  });

  afterAll(async () => {
    await Gallery.sequelize.close();
  });

  test('createGalleryItem creates a gallery item', async () => {
    const data = {
      title: 'Test Image',
      description: 'A test image',
      mediaUrl: 'http://example.com/image.jpg',
      mediaType: 'image',
    };
    const item = await galleryService.createGalleryItem(data);
    expect(item.title).toBe('Test Image');
    expect(item.mediaType).toBe('image');
    expect(item.mediaUrl).toBe('http://example.com/image.jpg');
  });

  test('getAllGalleryItems returns all items', async () => {
    await galleryService.createGalleryItem({
      title: 'Test Image',
      description: 'A test image',
      mediaUrl: 'http://example.com/image.jpg',
      mediaType: 'image',
    });
    const items = await galleryService.getAllGalleryItems();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  test('getGalleryItemById returns the correct item', async () => {
    const created = await galleryService.createGalleryItem({
      title: 'Test Image',
      description: 'A test image',
      mediaUrl: 'http://example.com/image.jpg',
      mediaType: 'image',
    });
    const item = await galleryService.getGalleryItemById(created.id);
    expect(item).toBeTruthy();
    expect(item.title).toBe('Test Image');
  });

  test('updateGalleryItem updates fields', async () => {
    const created = await galleryService.createGalleryItem({
      title: 'Test Image',
      description: 'A test image',
      mediaUrl: 'http://example.com/image.jpg',
      mediaType: 'image',
    });
    const updated = await galleryService.updateGalleryItem(created.id, { title: 'Updated Title' });
    expect(updated.title).toBe('Updated Title');
  });

  test('deleteGalleryItem removes an item', async () => {
    const created = await galleryService.createGalleryItem({
      title: 'Test Image',
      description: 'A test image',
      mediaUrl: 'http://example.com/image.jpg',
      mediaType: 'image',
    });
    const deleted = await galleryService.deleteGalleryItem(created.id);
    expect(deleted).toBe(true);
    const afterDelete = await galleryService.getGalleryItemById(created.id);
    expect(afterDelete).toBeNull();
  });

  test('getGalleryItemById returns null for non-existent item', async () => {
    const item = await galleryService.getGalleryItemById(99999);
    expect(item).toBeNull();
  });

  test('updateGalleryItem returns null for non-existent item', async () => {
    const updated = await galleryService.updateGalleryItem(99999, { title: 'Nope' });
    expect(updated).toBeNull();
  });

  test('deleteGalleryItem returns false for non-existent item', async () => {
    const deleted = await galleryService.deleteGalleryItem(99999);
    expect(deleted).toBe(false);
  });
}); 