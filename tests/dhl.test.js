const dhlService = require('../services/dhl.service');
const axios = require('axios');
jest.mock('axios');

describe('DHL Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('trackShipment', () => {
    it('should return tracking data on success', async () => {
      axios.get.mockResolvedValue({
        data: {
          status: 'delivered'
        }
      });
      const result = await dhlService.trackShipment('TRACK123');
      expect(result).toEqual({
        status: 'delivered'
      });
      expect(axios.get).toHaveBeenCalled();
    });

    it('should throw error on failure', async () => {
      axios.get.mockRejectedValue({
        response: {
          data: {
            error: 'Not found'
          }
        }
      });
      await expect(dhlService.trackShipment('BADTRACK')).rejects.toEqual({
        error: 'Not found'
      });
    });
  });

  describe('createShipment', () => {
    it('should return shipment data on success', async () => {
      axios.post.mockResolvedValue({
        data: {
          shipmentId: 'SHIP123'
        }
      });
      const result = await dhlService.createShipment({
        foo: 'bar'
      });
      expect(result).toEqual({
        shipmentId: 'SHIP123'
      });
      expect(axios.post).toHaveBeenCalled();
    });

    it('should throw error on failure', async () => {
      axios.post.mockRejectedValue({
        response: {
          data: {
            error: 'Invalid'
          }
        }
      });
      await expect(dhlService.createShipment({})).rejects.toEqual({
        error: 'Invalid'
      });
    });
  });
});
