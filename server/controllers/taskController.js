const { allQuery, getQuery, runQuery } = require('../database');

const taskController = {
  getAllTasks: async (req, res) => {
    try {
      const tasks = await allQuery('SELECT * FROM tasks ORDER BY created_at DESC');
      res.json({ success: true, data: tasks });
    } catch (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getTaskById: async (req, res) => {
    try {
      const task = await getQuery('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
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
      const tasks = await allQuery('SELECT * FROM tasks WHERE event_id = ? ORDER BY created_at DESC', [req.params.eventId]);
      res.json({ success: true, data: tasks });
    } catch (error) {
      console.error('Error getting event tasks:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createTask: async (req, res) => {
    try {
      const {
        event_id,
        title,
        description,
        status = 'todo',
        priority = 'medium',
        assigned_to,
        due_date
      } = req.body;

      const result = await runQuery(
        `INSERT INTO tasks (
          event_id, title, description, status, priority, assigned_to, due_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [event_id, title, description, status, priority, assigned_to, due_date]
      );

      const task = await getQuery('SELECT * FROM tasks WHERE id = ?', [result.id]);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateTask: async (req, res) => {
    try {
      const {
        title,
        description,
        status,
        priority,
        assigned_to,
        due_date
      } = req.body;

      await runQuery(
        `UPDATE tasks SET
          title = ?, description = ?, status = ?, priority = ?,
          assigned_to = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [title, description, status, priority, assigned_to, due_date, req.params.id]
      );

      const task = await getQuery('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
      res.json({ success: true, data: task });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteTask: async (req, res) => {
    try {
      await runQuery('DELETE FROM tasks WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = taskController;
