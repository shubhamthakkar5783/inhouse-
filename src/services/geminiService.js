import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

class GeminiService {
  async generateEventPlan(eventDescription, eventType, preferences = {}) {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `You are an expert event planner. Based on the following event details, create a comprehensive event plan.

Event Type: ${eventType}
Description: ${eventDescription}
${preferences.audienceSize ? `Audience Size: ${preferences.audienceSize}` : ''}
${preferences.budget ? `Budget: ${preferences.budget}` : ''}
${preferences.duration ? `Duration: ${preferences.duration}` : ''}
${preferences.venueType ? `Venue Type: ${preferences.venueType}` : ''}

Generate a detailed event plan in JSON format with the following structure:
{
  "timeline": [
    {"time": "9:00 AM", "activity": "Activity name", "duration": "30 mins"},
    ...
  ],
  "tasks": [
    {"task": "Task description", "priority": "high/medium/low", "deadline": "relative time"},
    ...
  ],
  "budget": {
    "venue": amount,
    "catering": amount,
    "marketing": amount,
    "staffing": amount,
    "equipment": amount,
    "contingency": amount
  },
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    ...
  ]
}

Provide ONLY the JSON response, no additional text.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error('Gemini event plan generation error:', error);
      throw new Error('Failed to generate event plan. Please try again.');
    }
  }

  async generatePosterContent(eventDescription, eventType, style = 'modern') {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `You are a creative designer. Based on the following event details, create poster content suggestions.

Event Type: ${eventType}
Description: ${eventDescription}
Design Style: ${style}

Generate poster content suggestions in JSON format:
{
  "headline": "Eye-catching headline",
  "subheadline": "Supporting text",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "callToAction": "Action text",
  "colorScheme": ["#color1", "#color2", "#color3"],
  "designNotes": "Brief design suggestions"
}

Provide ONLY the JSON response, no additional text.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error('Gemini poster generation error:', error);
      throw new Error('Failed to generate poster content. Please try again.');
    }
  }

  async generateEmailInvitation(eventDescription, eventType, tone = 'formal') {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `You are a professional email writer. Create an event invitation email based on these details.

Event Type: ${eventType}
Description: ${eventDescription}
Tone: ${tone}

Generate an email invitation in JSON format:
{
  "subject": "Email subject line",
  "greeting": "Email greeting",
  "body": "Main email body with multiple paragraphs",
  "eventDetails": "Formatted event details section",
  "closing": "Email closing",
  "signature": "Email signature"
}

Make the email engaging and appropriate for the ${tone} tone. Support both English and Hindi content.
Provide ONLY the JSON response, no additional text.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error('Gemini email generation error:', error);
      throw new Error('Failed to generate email invitation. Please try again.');
    }
  }

  async generateSocialMediaCaption(eventDescription, eventType, platform = 'instagram') {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const characterLimits = {
        instagram: 2200,
        facebook: 63206,
        twitter: 280,
        linkedin: 3000
      };

      const limit = characterLimits[platform] || 2200;

      const prompt = `You are a social media expert. Create an engaging ${platform} caption for this event.

Event Type: ${eventType}
Description: ${eventDescription}
Platform: ${platform}
Character Limit: ${limit}

Generate a social media caption in JSON format:
{
  "caption": "The complete caption text with emojis and line breaks",
  "hashtags": ["#hashtag1", "#hashtag2", ...],
  "characterCount": actual_character_count,
  "callToAction": "Specific call to action"
}

Make it engaging, platform-appropriate, and include relevant emojis. Support both English and Hindi content.
Provide ONLY the JSON response, no additional text.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error('Gemini caption generation error:', error);
      throw new Error('Failed to generate social media caption. Please try again.');
    }
  }

  async generateMarketingContent(eventDescription, eventType) {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `You are a marketing expert. Create comprehensive marketing content for this event.

Event Type: ${eventType}
Description: ${eventDescription}

Generate marketing materials in JSON format:
{
  "tagline": "Memorable event tagline",
  "elevator_pitch": "30-second description",
  "key_benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "target_audience": "Description of ideal attendees",
  "unique_selling_points": ["USP 1", "USP 2", "USP 3"],
  "social_media_strategy": "Brief strategy overview"
}

Support both English and Hindi content.
Provide ONLY the JSON response, no additional text.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error('Gemini marketing content generation error:', error);
      throw new Error('Failed to generate marketing content. Please try again.');
    }
  }
}

export const geminiService = new GeminiService();
