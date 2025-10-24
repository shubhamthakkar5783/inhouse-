import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class ImageService {
  constructor() {
    this.pollinationsBaseUrl = 'https://image.pollinations.ai/prompt';
  }

  generateImageUrl(prompt, options = {}) {
    const {
      width = 1024,
      height = 1024,
      seed = 42,
      eventType = '',
      assetType = '',
      theme = '',
      coupleNames = ''
    } = options;

    let enhancedPrompt = '';

    if (assetType && assetType.toLowerCase().includes('invitation') && coupleNames) {
      enhancedPrompt = `Elegant Indian wedding invitation design for "${coupleNames}". Include the text "${coupleNames}" clearly in beautiful cursive gold font. Floral royal background, pastel theme, high detail, 8k resolution, ultra-realistic, cinematic lighting.`;
    } else {
      enhancedPrompt = prompt;

      if (eventType) {
        enhancedPrompt = `${eventType} event: ${enhancedPrompt}`;
      }

      if (assetType) {
        enhancedPrompt = `${assetType} for ${enhancedPrompt}`;
      }

      if (theme) {
        enhancedPrompt = `${enhancedPrompt} with ${theme} theme`;
      }

      enhancedPrompt += '. High detail, 8k resolution, ultra-realistic, cinematic lighting, professional quality.';
    }

    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    return `${this.pollinationsBaseUrl}/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}`;
  }

  async generateImage(prompt, options = {}) {
    try {
      const response = await axios.post(`${API_BASE_URL}/images/generate`, {
        prompt,
        ...options
      });

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error generating image:', error);

      const imageUrl = this.generateImageUrl(prompt, options);
      return {
        success: true,
        data: {
          imageUrl,
          metadata: {
            prompt,
            ...options,
            generatedAt: new Date().toISOString()
          }
        }
      };
    }
  }

  async generateMultipleImages(prompt, options = {}, count = 3) {
    try {
      const response = await axios.post(`${API_BASE_URL}/images/generate-multiple`, {
        prompt,
        count,
        ...options
      });

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error generating multiple images:', error);

      const images = [];
      for (let i = 0; i < count; i++) {
        const imageOptions = {
          ...options,
          seed: (options.seed || 42) + i
        };
        const imageUrl = this.generateImageUrl(prompt, imageOptions);
        images.push({
          imageUrl,
          metadata: {
            prompt,
            ...imageOptions,
            generatedAt: new Date().toISOString()
          }
        });
      }

      return {
        success: true,
        data: { images, total: images.length }
      };
    }
  }

  async getEventImages(eventId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/images/event/${eventId}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting event images:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export const imageService = new ImageService();
