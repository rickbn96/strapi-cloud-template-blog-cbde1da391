# CyberCon Strapi Cloud Setup Guide

This guide will help you configure your Strapi Cloud instance for the CyberCon website and connect it to your frontend.

## 1. Setting Up Strapi Cloud Content Types

Since you're using Strapi Cloud, you need to create the content types through the Strapi Cloud admin interface:

1. **Log into your Strapi Cloud account** at https://cloud.strapi.io

2. **Navigate to your project**

3. **Open the Content-Type Builder** from the left sidebar

4. **Create the following Collection Types**:

### Podcast Episode

Create a new Collection Type named "Episode" with these fields:
- Title (Text)
- Description (Long text)
- Slug (UID, from Title)
- Release Date (Date)
- Duration (Text)
- Audio File (Media)
- Cover Image (Media)
- Content (Rich Text or Dynamic Zone)
- Category (Relation to Category - Many to One)
- Author (Relation to Author - Many to One)
- Tags (Component - Repeatable)

### Event

Create a new Collection Type named "Event" with these fields:
- Title (Text)
- Description (Long text)
- Slug (UID, from Title)
- Start Date (Date & Time)
- End Date (Date & Time)
- Location (Text)
- Venue (Text)
- City (Text)
- Address (Text)
- Image (Media)
- Registration Link (Text)
- Agenda (Rich Text)
- Content (Rich Text or Dynamic Zone)
- Speakers (Relation to Speaker - Many to Many)
- Tickets (JSON)

### Speaker

Create a new Collection Type named "Speaker" with these fields:
- Name (Text)
- Slug (UID, from Name)
- Title (Text)
- Bio (Long text)
- Photo (Media)
- Company (Text)
- LinkedIn (Text)
- Twitter (Text)
- Expertise (Component - Repeatable)

### Contact Form

Create a new Collection Type named "Contact" with these fields:
- Name (Text)
- Email (Email)
- Subject (Text)
- Message (Long text)
- Date (Date & Time)
- Status (Enumeration: new, read, replied)

### Newsletter Subscriber

Create a new Collection Type named "Newsletter-Subscriber" with these fields:
- Email (Email)
- SubscribedAt (Date & Time)
- Active (Boolean)
- Categories (Relation to Category - Many to Many)

### Components 

Create a new Component named "Tag" with:
- Name (Text)

## 2. Configuring API Permissions

1. **Go to Settings > USERS & PERMISSIONS PLUGIN > Roles**

2. **Select the "Public" role**

3. **Configure permissions for each content type**:
   - For Episodes, Events, Speakers, Categories: Allow Find, FindOne
   - For Contact and Newsletter-Subscriber: Allow Create
   - For Media: Allow Find, FindOne

4. **Save your changes**

## 3. Custom API Configuration (if needed)

If you need custom API endpoints, you can use the Strapi Cloud Web Editor to create them:

1. **Go to Code Editor** in your Strapi Cloud dashboard

2. **Navigate to the API directory** and create or modify files as needed

## 4. Frontend Configuration for Strapi Cloud

1. **Update your frontend .env file**:

```
STRAPI_URL=https://api.cybercon.live
```

2. **Ensure your server.js correctly formats API requests**:

For Strapi Cloud, the API URL format is different from a self-hosted Strapi. When fetching data, ensure you use:

```javascript
// Example of correct format for Strapi Cloud
const episodesRes = await axios.get(`${STRAPI_URL}/api/episodes?populate=*&sort[releaseDate]=desc`);
```

## 5. CORS Configuration

Strapi Cloud automatically handles CORS, but you may need to configure allowed origins:

1. **Go to Settings > GLOBAL SETTINGS > CORS**

2. **Add your frontend domain**:
   - Add `https://cybercon.live` to the allowed origins

## 6. Deployment Steps

1. **Set up your frontend**:
   ```bash
   cd frontend
   npm install
   cp .env.production .env
   ```

2. **Deploy your frontend** to your hosting provider:
   ```bash
   npm start
   # or use PM2
   pm2 start server.js --name "cybercon-frontend"
   ```

3. **Configure your domain** to point to your server

4. **Set up SSL certificates** (Let's Encrypt recommended)

5. **Configure Nginx** using the provided nginx.conf.example (rename to cybercon.conf)

## 7. Adding Initial Content

After setting up your content types:

1. **Create categories** for your podcast episodes and events

2. **Add a few authors** who will be writing/hosting content

3. **Create your first podcast episodes**:
   - Upload audio files
   - Add cover images
   - Write descriptions
   - Set release dates

4. **Create upcoming events**:
   - Add event details
   - Upload event images
   - Link speakers

5. **Add speaker profiles**:
   - Upload photos
   - Write bios
   - Add social media links

## 8. Troubleshooting

If your frontend cannot connect to Strapi Cloud:

1. **Check CORS settings** in Strapi Cloud

2. **Verify API permissions** for Public role

3. **Check your environment variables** in the frontend (.env file)

4. **Look for console errors** in the browser

For any Strapi Cloud specific issues, refer to the [Strapi Cloud documentation](https://docs.strapi.io/cloud/getting-started/introduction).
