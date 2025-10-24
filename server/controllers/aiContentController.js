const { getQuery, allQuery, runQuery } = require('../database');

const aiContentController = {
  getAllContent: async (req, res) => {
    try {
      const content = await allQuery('SELECT * FROM ai_generated_content ORDER BY created_at DESC');
      res.json({ success: true, data: content });
    } catch (error) {
      console.error('Error getting AI content:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getContentById: async (req, res) => {
    try {
      const content = await getQuery('SELECT * FROM ai_generated_content WHERE id = ?', [req.params.id]);
      if (!content) {
        return res.status(404).json({ success: false, error: 'AI content not found' });
      }
      res.json({ success: true, data: content });
    } catch (error) {
      console.error('Error getting AI content:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getContentByEventId: async (req, res) => {
    try {
      const content = await allQuery(
        'SELECT * FROM ai_generated_content WHERE event_id = ? ORDER BY created_at DESC',
        [req.params.eventId]
      );
      res.json({ success: true, data: content });
    } catch (error) {
      console.error('Error getting event AI content:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getContentByEventIdAndType: async (req, res) => {
    try {
      const { eventId, contentType } = req.params;
      const content = await getQuery(
        'SELECT * FROM ai_generated_content WHERE event_id = ? AND content_type = ? ORDER BY created_at DESC LIMIT 1',
        [eventId, contentType]
      );

      if (!content) {
        return res.status(404).json({ success: false, error: 'AI content not found' });
      }

      res.json({ success: true, data: content });
    } catch (error) {
      console.error('Error getting AI content by type:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createContent: async (req, res) => {
    try {
      const {
        event_id,
        content_type,
        prompt,
        generated_content,
        metadata,
        platform
      } = req.body;

      if (!event_id || !content_type || !generated_content) {
        return res.status(400).json({
          success: false,
          error: 'event_id, content_type, and generated_content are required'
        });
      }

      const result = await runQuery(
        `INSERT INTO ai_generated_content (
          event_id, content_type, prompt, generated_content, metadata, platform
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          event_id,
          content_type,
          prompt || null,
          typeof generated_content === 'string' ? generated_content : JSON.stringify(generated_content),
          metadata ? JSON.stringify(metadata) : null,
          platform || null
        ]
      );

      const content = await getQuery('SELECT * FROM ai_generated_content WHERE id = ?', [result.id]);
      res.status(201).json({ success: true, data: content });
    } catch (error) {
      console.error('Error creating AI content:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateContent: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        content_type,
        prompt,
        generated_content,
        metadata,
        platform
      } = req.body;

      const existingContent = await getQuery('SELECT * FROM ai_generated_content WHERE id = ?', [id]);
      if (!existingContent) {
        return res.status(404).json({ success: false, error: 'AI content not found' });
      }

      await runQuery(
        `UPDATE ai_generated_content SET
          content_type = COALESCE(?, content_type),
          prompt = COALESCE(?, prompt),
          generated_content = COALESCE(?, generated_content),
          metadata = COALESCE(?, metadata),
          platform = COALESCE(?, platform),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          content_type,
          prompt,
          generated_content ? (typeof generated_content === 'string' ? generated_content : JSON.stringify(generated_content)) : null,
          metadata ? JSON.stringify(metadata) : null,
          platform,
          id
        ]
      );

      const content = await getQuery('SELECT * FROM ai_generated_content WHERE id = ?', [id]);
      res.json({ success: true, data: content });
    } catch (error) {
      console.error('Error updating AI content:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteContent: async (req, res) => {
    try {
      const { id } = req.params;

      const existingContent = await getQuery('SELECT * FROM ai_generated_content WHERE id = ?', [id]);
      if (!existingContent) {
        return res.status(404).json({ success: false, error: 'AI content not found' });
      }

      await runQuery('DELETE FROM ai_generated_content WHERE id = ?', [id]);
      res.json({ success: true, message: 'AI content deleted successfully' });
    } catch (error) {
      console.error('Error deleting AI content:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteContentByEventId: async (req, res) => {
    try {
      const { eventId } = req.params;

      await runQuery('DELETE FROM ai_generated_content WHERE event_id = ?', [eventId]);
      res.json({ success: true, message: 'All AI content for event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event AI content:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = aiContentController;
