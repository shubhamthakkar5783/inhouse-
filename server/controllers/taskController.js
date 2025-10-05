const TaskModel = require('../models/taskModel');

const taskController = {
  getAllTasks: async (req, res) => {
    try {
      const tasks = await TaskModel.getAll();
      res.json({ success: true, data: tasks });
    } catch (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getTaskById: async (req, res) => {
    try {
      const task = await TaskModel.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      res.json({ success: true, data: task });
    } catch (error) {
      console.error('Error getting task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getTasksByEventId: async (req, res) => {
    try {
      const tasks = await TaskModel.findByEventId(req.params.eventId);
      res.json({ success: true, data: tasks });
    } catch (error) {
      console.error('Error getting event tasks:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getTasksByStatus: async (req, res) => {
    try {
      const { eventId, status } = req.params;
      const tasks = await TaskModel.findByStatus(eventId, status);
      res.json({ success: true, data: tasks });
    } catch (error) {
      console.error('Error getting tasks by status:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createTask: async (req, res) => {
    try {
      const taskId = await TaskModel.create(req.body);
      const task = await TaskModel.findById(taskId);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateTask: async (req, res) => {
    try {
      await TaskModel.update(req.params.id, req.body);
      const task = await TaskModel.findById(req.params.id);
      res.json({ success: true, data: task });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateTaskStatus: async (req, res) => {
    try {
      const { status } = req.body;
      await TaskModel.updateStatus(req.params.id, status);
      const task = await TaskModel.findById(req.params.id);
      res.json({ success: true, data: task });
    } catch (error) {
      console.error('Error updating task status:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteTask: async (req, res) => {
    try {
      await TaskModel.delete(req.params.id);
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = taskController;
