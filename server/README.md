# Smart Event Planner - Backend Server

## Overview
This is the backend server for the Smart Event Planner application, built with Express.js and SQLite.

## Database Tables
- `users` - User accounts
- `events` - Event information
- `budgets` - Budget tracking per event
- `tasks` - Task management
- `marketing_materials` - Marketing content
- `timeline_activities` - Event timeline activities
- `event_preferences` - User preferences
- `generated_images` - AI-generated images
- `ai_generated_content` - AI-generated content (event plans, captions, emails, etc.)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize the database:
```bash
npm run setup
```

3. Start the server:
```bash
npm run server
```

The server will run on `http://localhost:5000`

## API Endpoints

### AI Generated Content
- `GET /api/ai-content` - Get all AI-generated content
- `GET /api/ai-content/:id` - Get specific AI content by ID
- `GET /api/ai-content/event/:eventId` - Get all AI content for an event
- `GET /api/ai-content/event/:eventId/type/:contentType` - Get specific content type for an event
- `POST /api/ai-content` - Create new AI-generated content
- `PUT /api/ai-content/:id` - Update AI content
- `DELETE /api/ai-content/:id` - Delete AI content
- `DELETE /api/ai-content/event/:eventId` - Delete all AI content for an event

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Budgets
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/:id` - Get budget by ID
- `GET /api/budgets/event/:eventId` - Get budget for specific event
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `GET /api/tasks/event/:eventId` - Get tasks for specific event
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Preferences
- `GET /api/preferences` - Get all preferences
- `GET /api/preferences/:id` - Get preference by ID
- `GET /api/preferences/latest` - Get latest preference
- `POST /api/preferences` - Create preference
- `PUT /api/preferences/:id` - Update preference
- `POST /api/preferences/upsert` - Create or update preference

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `POST /api/users/login` - User login
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Images
- `POST /api/images/generate` - Generate single image
- `POST /api/images/generate-batch` - Generate multiple images
- `GET /api/images/event/:eventId` - Get images for event

## Development

The server uses SQLite for data persistence and provides a REST API for all frontend operations.

All AI-generated content (event plans, timelines, marketing materials) is now stored in the backend database instead of Supabase.
