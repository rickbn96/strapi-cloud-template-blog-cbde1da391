'use strict';

/**
 * CyberCon Frontend Server - Strapi Cloud Version
 */

const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const STRAPI_URL = process.env.STRAPI_URL || 'https://your-project.api.strapi.cloud';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Create Axios instance with authentication
const strapiApi = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to format dates
app.locals.formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('it-IT', options);
};

// Helper function to format times
app.locals.formatTime = (dateString) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleTimeString('it-IT', options);
};

// Error handling middleware for API requests
const handleApiError = (error, res, message) => {
  console.error(`API Error: ${message}`, error.response?.data || error.message);
  
  // Determine if it's an authentication error
  if (error.response?.status === 401 || error.response?.status === 403) {
    console.error('Authentication error - check your STRAPI_API_TOKEN');
  }
  
  return res.status(500).render('error', { 
    title: 'Error',
    message: `Sorry, we encountered an error: ${message}. Please try again later.` 
  });
};

// Routes
app.get('/', async (req, res) => {
  try {
    // Fetch latest episodes
    const episodesRes = await strapiApi.get('/api/episodes', { 
      params: {
        populate: '*',
        sort: ['releaseDate:desc'],
        pagination: { limit: 3 }
      }
    });
    const episodes = episodesRes.data.data;

    // Fetch upcoming event
    const eventsRes = await strapiApi.get('/api/events', {
      params: {
        populate: ['image', 'speakers.photo'],
        sort: ['startDate:asc'],
        filters: {
          startDate: {
            $gt: new Date().toISOString()
          }
        },
        pagination: { limit: 1 }
      }
    });
    const upcomingEvent = eventsRes.data.data[0];

    // Fetch speakers
    const speakersRes = await strapiApi.get('/api/speakers', {
      params: {
        populate: '*',
        pagination: { limit: 4 }
      }
    });
    const speakers = speakersRes.data.data;

    res.render('index', {
      episodes,
      upcomingEvent,
      speakers,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    handleApiError(error, res, 'Failed to load homepage content');
  }
});

// Podcast episodes page
app.get('/podcast', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 6;
    
    // Fetch episodes with pagination
    const episodesRes = await strapiApi.get('/api/episodes', {
      params: {
        populate: '*',
        sort: ['releaseDate:desc'],
        pagination: {
          page,
          pageSize
        }
      }
    });
    
    const episodes = episodesRes.data.data;
    const pagination = episodesRes.data.meta.pagination;

    res.render('podcast', { 
      episodes, 
      pagination,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    handleApiError(error, res, 'Failed to load podcast episodes');
  }
});

// Single episode page
app.get('/podcast/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Fetch episode by slug
    const episodeRes = await strapiApi.get('/api/episodes', {
      params: {
        populate: '*',
        filters: {
          slug: {
            $eq: slug
          }
        }
      }
    });
    
    const episode = episodeRes.data.data[0];

    if (!episode) {
      return res.status(404).render('404', { message: 'Episodio non trovato' });
    }

    // Fetch related episodes
    let relatedEpisodes = [];
    if (episode.attributes.category && episode.attributes.category.data) {
      const categoryId = episode.attributes.category.data.id;
      const relatedRes = await strapiApi.get('/api/episodes', {
        params: {
          populate: '*',
          filters: {
            category: {
              id: {
                $eq: categoryId
              }
            },
            id: {
              $ne: episode.id
            }
          },
          pagination: { limit: 3 }
        }
      });
      
      relatedEpisodes = relatedRes.data.data;
    }

    res.render('episode', { 
      episode, 
      relatedEpisodes,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    handleApiError(error, res, 'Failed to load episode details');
  }
});

// Events page
app.get('/events', async (req, res) => {
  try {
    // Fetch all events
    const eventsRes = await strapiApi.get('/api/events', {
      params: {
        populate: '*',
        sort: ['startDate:desc']
      }
    });
    
    const events = eventsRes.data.data;

    // Split into upcoming and past events
    const now = new Date().toISOString();
    const upcomingEvents = events.filter(event => event.attributes.startDate > now);
    const pastEvents = events.filter(event => event.attributes.startDate <= now);

    res.render('events', { 
      upcomingEvents, 
      pastEvents,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    handleApiError(error, res, 'Failed to load events');
  }
});

// Single event page
app.get('/events/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Fetch event by slug
    const eventRes = await strapiApi.get('/api/events', {
      params: {
        populate: ['image', 'speakers.photo', 'content'],
        filters: {
          slug: {
            $eq: slug
          }
        }
      }
    });
    
    const event = eventRes.data.data[0];

    if (!event) {
      return res.status(404).render('404', { message: 'Evento non trovato' });
    }

    res.render('event-details', { 
      event,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    handleApiError(error, res, 'Failed to load event details');
  }
});

// Speakers page
app.get('/speakers', async (req, res) => {
  try {
    // Fetch all speakers
    const speakersRes = await strapiApi.get('/api/speakers', {
      params: {
        populate: '*'
      }
    });
    
    const speakers = speakersRes.data.data;

    res.render('speakers', { 
      speakers,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    handleApiError(error, res, 'Failed to load speakers');
  }
});

// Single speaker page
app.get('/speakers/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Fetch speaker by slug
    const speakerRes = await strapiApi.get('/api/speakers', {
      params: {
        populate: ['photo', 'events', 'expertise'],
        filters: {
          slug: {
            $eq: slug
          }
        }
      }
    });
    
    const speaker = speakerRes.data.data[0];

    if (!speaker) {
      return res.status(404).render('404', { message: 'Speaker non trovato' });
    }

    res.render('speaker-details', { 
      speaker,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    handleApiError(error, res, 'Failed to load speaker details');
  }
});

// About page
app.get('/about', async (req, res) => {
  try {
    // Fetch about content
    const aboutRes = await strapiApi.get('/api/about', {
      params: {
        populate: '*'
      }
    });
    
    const about = aboutRes.data.data;

    res.render('about', { 
      about,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    // Don't fail if about page doesn't exist, just render with empty data
    console.warn('About content not found, rendering empty page', error.message);
    
    res.render('about', { 
      about: null,
      strapiUrl: STRAPI_URL
    });
  }
});

// Contact page
app.get('/contact', (req, res) => {
  res.render('contact', { 
    success: req.query.success,
    error: req.query.error,
    strapiUrl: STRAPI_URL
  });
});

// Contact form submission
app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate form fields
    if (!name || !email || !subject || !message) {
      return res.redirect('/contact?error=Tutti i campi sono obbligatori');
    }
    
    // Send to Strapi
    await strapiApi.post('/api/contacts', {
      data: { 
        name, 
        email, 
        subject, 
        message,
        date: new Date().toISOString()
      }
    });
    
    res.redirect('/contact?success=Messaggio inviato con successo!');
  } catch (error) {
    console.error('Error sending contact form:', error);
    res.redirect('/contact?error=Errore durante l\'invio del messaggio. Riprova più tardi.');
  }
});

// Newsletter subscription
app.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    // Send to Strapi
    await strapiApi.post('/api/newsletter-subscribers', {
      data: { 
        email,
        subscribedAt: new Date().toISOString(),
        active: true 
      }
    });
    
    res.json({ success: true, message: 'Iscrizione completata con successo!' });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    
    // Check for duplicate email error
    if (error.response && error.response.status === 400 && 
        error.response.data.error.message.includes('already exists')) {
      return res.status(409).json({ success: false, message: 'Email già registrata alla newsletter' });
    }
    
    res.status(500).json({ success: false, message: 'Errore durante l\'iscrizione. Riprova più tardi.' });
  }
});

// Error page
app.get('/error', (req, res) => {
  res.render('error', {
    title: req.query.title || 'Error',
    message: req.query.message || 'Something went wrong. Please try again later.'
  });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { message: 'Pagina non trovata' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).render('error', { 
    title: 'Server Error',
    message: 'Something went wrong on our server. Please try again later.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CyberCon frontend server running on port ${PORT}`);
  console.log(`🔌 Connected to Strapi at ${STRAPI_URL}`);
  
  if (!STRAPI_API_TOKEN) {
    console.warn('⚠️  WARNING: STRAPI_API_TOKEN is not set. API requests may fail!');
  }
});
