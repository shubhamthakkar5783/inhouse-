import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class AIContentService {
  constructor() {
    this.storageKey = 'smart_event_planner_ai_content';
    this.useBackend = false;
  }

  async checkBackendConnection() {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai-content`, { timeout: 1000 });
      this.useBackend = true;
      return true;
    } catch (error) {
      this.useBackend = false;
      return false;
    }
  }

  async getAllContent() {
    try {
      await this.checkBackendConnection();

      if (this.useBackend) {
        const response = await axios.get(`${API_BASE_URL}/ai-content`);
        return response.data.data || [];
      } else {
        const contentJson = localStorage.getItem(this.storageKey);
        return contentJson ? JSON.parse(contentJson) : [];
      }
    } catch (error) {
      console.error('Error loading AI content:', error);
      const contentJson = localStorage.getItem(this.storageKey);
      return contentJson ? JSON.parse(contentJson) : [];
    }
  }

  async getContentById(id) {
    try {
      await this.checkBackendConnection();

      if (this.useBackend) {
        const response = await axios.get(`${API_BASE_URL}/ai-content/${id}`);
        return response.data.data;
      } else {
        const allContent = await this.getAllContent();
        return allContent.find(content => content.id === id);
      }
    } catch (error) {
      console.error('Error getting AI content:', error);
      return null;
    }
  }

  async getContentByEventId(eventId) {
    try {
      await this.checkBackendConnection();

      if (this.useBackend) {
        const response = await axios.get(`${API_BASE_URL}/ai-content/event/${eventId}`);
        return response.data.data || [];
      } else {
        const allContent = await this.getAllContent();
        return allContent.filter(content => content.event_id === eventId);
      }
    } catch (error) {
      console.error('Error getting event AI content:', error);
      return [];
    }
  }

  async getContentByEventIdAndType(eventId, contentType) {
    try {
      await this.checkBackendConnection();

      if (this.useBackend) {
        const response = await axios.get(`${API_BASE_URL}/ai-content/event/${eventId}/type/${contentType}`);
        return response.data.data;
      } else {
        const eventContent = await this.getContentByEventId(eventId);
        const filtered = eventContent.filter(content => content.content_type === contentType);
        return filtered.length > 0 ? filtered[0] : null;
      }
    } catch (error) {
      console.error('Error getting AI content by type:', error);
      return null;
    }
  }

  async createContent(contentData) {
    try {
      await this.checkBackendConnection();

      if (this.useBackend) {
        const response = await axios.post(`${API_BASE_URL}/ai-content`, contentData);
        const newContent = response.data.data;

        const allContent = await this.getAllContent();
        allContent.unshift(newContent);
        localStorage.setItem(this.storageKey, JSON.stringify(allContent));

        return newContent;
      } else {
        const allContent = await this.getAllContent();
        const newContent = {
          id: Date.now().toString(),
          ...contentData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        allContent.unshift(newContent);
        localStorage.setItem(this.storageKey, JSON.stringify(allContent));

        return newContent;
      }
    } catch (error) {
      console.error('Error creating AI content:', error);

      const allContent = await this.getAllContent();
      const newContent = {
        id: Date.now().toString(),
        ...contentData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      allContent.unshift(newContent);
      localStorage.setItem(this.storageKey, JSON.stringify(allContent));

      return newContent;
    }
  }

  async updateContent(id, updates) {
    try {
      await this.checkBackendConnection();

      if (this.useBackend) {
        const response = await axios.put(`${API_BASE_URL}/ai-content/${id}`, updates);
        const updatedContent = response.data.data;

        const allContent = await this.getAllContent();
        const index = allContent.findIndex(content => content.id === id);
        if (index !== -1) {
          allContent[index] = updatedContent;
          localStorage.setItem(this.storageKey, JSON.stringify(allContent));
        }

        return updatedContent;
      } else {
        const allContent = await this.getAllContent();
        const index = allContent.findIndex(content => content.id === id);

        if (index === -1) {
          throw new Error('AI content not found');
        }

        allContent[index] = {
          ...allContent[index],
          ...updates,
          updated_at: new Date().toISOString()
        };

        localStorage.setItem(this.storageKey, JSON.stringify(allContent));
        return allContent[index];
      }
    } catch (error) {
      console.error('Error updating AI content:', error);
      throw error;
    }
  }

  async deleteContent(id) {
    try {
      await this.checkBackendConnection();

      if (this.useBackend) {
        await axios.delete(`${API_BASE_URL}/ai-content/${id}`);
      }

      const allContent = await this.getAllContent();
      const filteredContent = allContent.filter(content => content.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredContent));
      return true;
    } catch (error) {
      console.error('Error deleting AI content:', error);
      throw error;
    }
  }

  async deleteContentByEventId(eventId) {
    try {
      await this.checkBackendConnection();

      if (this.useBackend) {
        await axios.delete(`${API_BASE_URL}/ai-content/event/${eventId}`);
      }

      const allContent = await this.getAllContent();
      const filteredContent = allContent.filter(content => content.event_id !== eventId);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredContent));
      return true;
    } catch (error) {
      console.error('Error deleting event AI content:', error);
      throw error;
    }
  }
}

export const aiContentService = new AIContentService();
