const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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
      theme = ''
    } = options;

    let enhancedPrompt = prompt;

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

    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    return `${this.pollinationsBaseUrl}/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}`;
  }

  async generateImage(prompt, options = {}) {
    try {
      const imageUrl = this.generateImageUrl(prompt, options);

      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return {
        success: true,
        imageUrl,
        buffer,
        metadata: {
          prompt,
          width: options.width || 1024,
          height: options.height || 1024,
          seed: options.seed || 42,
          eventType: options.eventType,
          assetType: options.assetType,
          theme: options.theme,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error generating image:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateMultipleImages(prompt, options = {}, count = 1) {
    const images = [];

    for (let i = 0; i < count; i++) {
      const imageOptions = {
        ...options,
        seed: (options.seed || 42) + i
      };

      const result = await this.generateImage(prompt, imageOptions);
      images.push(result);
    }

    return images;
  }
}

module.exports = new ImageService();
