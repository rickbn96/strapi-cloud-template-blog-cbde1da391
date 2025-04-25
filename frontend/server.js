'use strict';

/**
 * CyberCon Frontend Server
 */

const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

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

// Routes
app.get('/', async (req, res) => {
  try {
    // Fetch latest episodes
    const episodesRes = await axios.get(`${STRAPI_URL}/api/episodes?populate=*&sort[releaseDate]=desc&pagination[limit]=3`);
    const episodes = episodesRes.data.data;

    // Fetch upcoming event
    const eventsRes = await axios.get(`${STRAPI_URL}/api/events?populate[0]=image&populate[1]=speakers.photo&sort[startDate]=asc&filters[startDate][$gt]=${new Date().toISOString()}&pagination[limit]=1`);
    const upcomingEvent = eventsRes.data.data[0];

    // Fetch speakers
    const speakersRes = await axios.get(`${STRAPI_URL}/api/speakers?populate=*&pagination[limit]=4`);
    const speakers = speakersRes.data.data;

    res.render('index', {
      episodes,
      upcomingEvent,
      speakers,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.render('index', { 
      episodes: [], 
      upcomingEvent: null, 
      speakers: [],
      strapiUrl: STRAPI_URL
    });
  }
});

// Podcast episodes page
app.get('/podcast', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 6;
    
    // Fetch episodes with pagination
    const episodesRes = await axios.get(`${STRAPI_URL}/api/episodes?populate=*&sort[releaseDate]=desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
    const episodes = episodesRes.data.data;
    const pagination = episodesRes.data.meta.pagination;

    res.render('podcast', { 
      episodes, 
      pagination,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    console.error('Error fetching episodes:', error);
    res.render('podcast', { 
      episodes: [], 
      pagination: { page: 1, pageSize: 6, pageCount: 1, total: 0 },
      strapiUrl: STRAPI_URL
    });
  }
});

// Single episode page
app.get('/podcast/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Fetch episode by slug
    const episodeRes = await axios.get(`${STRAPI_URL}/api/episodes?populate=*&filters[slug][$eq]=${slug}`);
    const episode = episodeRes.data.data[0];

    if (!episode) {
      return res.status(404).render('404', { message: 'Episodio non trovato' });
    }

    // Fetch related episodes
    let relatedEpisodes = [];
    if (episode.attributes.category && episode.attributes.category.data) {
      const categoryId = episode.attributes.category.data.id;
      const relatedRes = await axios.get(`${STRAPI_URL}/api/episodes?populate=*&filters[category][id][$eq]=${categoryId}&filters[id][$ne]=${episode.id}&pagination[limit]=3`);
      relatedEpisodes = relatedRes.data.data;
    }

    res.render('episode', { 
      episode, 
      relatedEpisodes,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    console.error('Error fetching episode:', error);
    res.status(404).render('404', { message: 'Episodio non trovato' });
  }
});

// Events page
app.get('/events', async (req, res) => {
  try {
    // Fetch all events
    const eventsRes = await axios.get(`${STRAPI_URL}/api/events?populate=*&sort[startDate]=desc`);
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
    console.error('Error fetching events:', error);
    res.render('events', { 
      upcomingEvents: [], 
      pastEvents: [],
      strapiUrl: STRAPI_URL
    });
  }
});

// Single event page
app.get('/events/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Fetch event by slug
    const eventRes = await axios.get(`${STRAPI_URL}/api/events?populate[0]=image&populate[1]=speakers.photo&populate[2]=content&filters[slug][$eq]=${slug}`);
    const event = eventRes.data.data[0];

    if (!event) {
      return res.status(404).render('404', { message: 'Evento non trovato' });
    }

    res.render('event-details', { 
      event,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(404).render('404', { message: 'Evento non trovato' });
  }
});

// Speakers page
app.get('/speakers', async (req, res) => {
  try {
    // Fetch all speakers
    const speakersRes = await axios.get(`${STRAPI_URL}/api/speakers?populate=*`);
    const speakers = speakersRes.data.data;

    res.render('speakers', { 
      speakers,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    console.error('Error fetching speakers:', error);
    res.render('speakers', { 
      speakers: [],
      strapiUrl: STRAPI_URL
    });
  }
});

// Single speaker page
app.get('/speakers/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Fetch speaker by slug
    const speakerRes = await axios.get(`${STRAPI_URL}/api/speakers?populate[0]=photo&populate[1]=events&populate[2]=expertise&filters[slug][$eq]=${slug}`);
    const speaker = speakerRes.data.data[0];

    if (!speaker) {
      return res.status(404).render('404', { message: 'Speaker non trovato' });
    }

    res.render('speaker-details', { 
      speaker,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    console.error('Error fetching speaker details:', error);
    res.status(404).render('404', { message: 'Speaker non trovato' });
  }
});

// About page
app.get('/about', async (req, res) => {
  try {
    // Fetch about content
    const aboutRes = await axios.get(`${STRAPI_URL}/api/about?populate=*`);
    const about = aboutRes.data.data;

    res.render('about', { 
      about,
      strapiUrl: STRAPI_URL
    });
  } catch (error) {
    console.error('Error fetching about content:', error);
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
    await axios.post(`${STRAPI_URL}/api/contacts`, {
      data: { name, email, subject, message }
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
    await axios.post(`${STRAPI_URL}/api/newsletter-subscribers`, {
      data: { email }
    });
    
    res.json({ success: true, message: 'Iscrizione completata con successo!' });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    
    // Check for duplicate email error
    if (error.response && error.response.status === 409) {
      return res.status(409).json({ success: false, message: 'Email già registrata alla newsletter' });
    }
    
    res.status(500).json({ success: false, message: 'Errore durante l\'iscrizione. Riprova più tardi.' });
  }
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { message: 'Pagina non trovata' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Connected to Strapi at ${STRAPI_URL}`);
});
