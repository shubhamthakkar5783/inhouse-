const EventModel = require('../models/eventModel');

const eventController = {
  getAllEvents: async (req, res) => {
    try {
      const events = await EventModel.getAll();
      res.json({ success: true, data: events });
    } catch (error) {
      console.error('Error getting events:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getEventById: async (req, res) => {
    try {
      const event = await EventModel.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }
      res.json({ success: true, data: event });
    } catch (error) {
      console.error('Error getting event:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getEventWithDetails: async (req, res) => {
    try {
      const event = await EventModel.getWithDetails(req.params.id);
      if (!event) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }
      res.json({ success: true, data: event });
    } catch (error) {
      console.error('Error getting event details:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getUserEvents: async (req, res) => {
    try {
      const events = await EventModel.findByUserId(req.params.userId);
      res.json({ success: true, data: events });
    } catch (error) {
      console.error('Error getting user events:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createEvent: async (req, res) => {
    try {
      const eventId = await EventModel.create(req.body);
      const event = await EventModel.findById(eventId);
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateEvent: async (req, res) => {
    try {
      await EventModel.update(req.params.id, req.body);
      const event = await EventModel.findById(req.params.id);
      res.json({ success: true, data: event });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      await EventModel.delete(req.params.id);
      res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = eventController;
