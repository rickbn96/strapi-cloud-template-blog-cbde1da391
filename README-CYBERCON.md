# CyberCon Website

CyberCon is a comprehensive website for a cybersecurity podcast and event platform based in Italy. This project consists of a Strapi backend for content management and a Node.js/Express frontend with EJS templates.

## Project Overview

- **Backend**: Strapi CMS with custom content types for podcast episodes, events, speakers, etc.
- **Frontend**: Node.js with Express.js and EJS templates for rendering pages
- **Design**: Modern, responsive design with a focus on cybersecurity aesthetics

## Directory Structure

```
├── frontend/                 # Express.js frontend
│   ├── public/               # Static assets
│   ├── views/                # EJS templates
│   └── server.js             # Express server
└── strapi-backend/           # Strapi CMS (this repository)
    ├── src/                  # Strapi source code
    │   ├── api/              # API definitions (content types)
    │   └── components/       # Reusable components
    └── config/               # Strapi configuration
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Database (SQLite by default, can be configured for MySQL, PostgreSQL, etc.)

### Setting Up Strapi Backend

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run develop
   ```

3. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

### Setting Up Frontend

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` to point to your Strapi instance.

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Start for production**:
   ```bash
   npm start
   ```

## Content Types

The CyberCon website includes the following content types:

### 1. Episodes (Podcast)
- Title
- Description
- Audio file
- Cover image
- Release date
- Duration
- Tags
- Content (rich text)

### 2. Events
- Title
- Description
- Start/End dates
- Location
- Venue
- Registration link
- Speakers (relationship)
- Agenda
- Content (rich text)

### 3. Speakers
- Name
- Title/Position
- Bio
- Photo
- Social media links
- Expertise (tags)
- Events (relationship)

### 4. Contacts
- Form submissions with name, email, subject, and message

### 5. Newsletter Subscribers
- Email addresses for newsletter subscribers

## Deployment

### Deploying Strapi

1. **Set up production database** (recommended for production):
   - Configure `config/database.js` for your production database (MySQL, PostgreSQL, etc.)

2. **Set environment variables**:
   Required environment variables:
   - `DATABASE_URL` or database connection details
   - `ADMIN_JWT_SECRET`
   - `API_TOKEN_SALT`
   - `APP_KEYS`

3. **Build Strapi**:
   ```bash
   npm run build
   ```

4. **Start Strapi in production**:
   ```bash
   NODE_ENV=production npm run start
   ```

### Deploying Frontend

1. **Build and start the frontend**:
   ```bash
   cd frontend
   npm install --production
   npm start
   ```

2. **Using a process manager (PM2)**:
   ```bash
   pm2 start server.js --name "cybercon-frontend"
   ```

3. **Set up a reverse proxy** (Nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Customization

### Logo and Branding

To update the logo and branding:

1. Replace the logo image in `frontend/public/images/logo.png`
2. Replace the favicon in `frontend/public/images/favicon.png`
3. Update colors in `frontend/public/css/styles.css` if desired

### Content

1. Log into the Strapi admin panel (default: http://localhost:1337/admin)
2. Add/edit podcast episodes, events, and speakers through the admin interface
3. Content will automatically appear on the frontend

## Credits

- Design and development by CyberCon team
- Powered by Strapi and Express.js

## License

Copyright © 2023 CyberCon. All rights reserved.
