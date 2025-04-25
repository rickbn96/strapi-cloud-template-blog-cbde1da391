# CyberCon Frontend

This is the frontend for the CyberCon website, a cybersecurity podcast and event platform in Italy.

## Technologies Used

- Node.js
- Express.js
- EJS (Embedded JavaScript templates)
- Axios for API requests
- Responsive CSS

## Project Structure

```
frontend/
├── public/               # Static assets
│   ├── css/              # CSS stylesheets
│   ├── js/               # JavaScript files
│   └── images/           # Image assets
├── views/                # EJS templates
│   ├── partials/         # Reusable template parts
│   └── ...               # Page templates
├── server.js             # Main Express server
├── package.json          # Dependencies and scripts
└── .env                  # Environment variables (create from .env.example)
```

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rickbn96/strapi-cloud-template-blog-cbde1da391.git
   cd strapi-cloud-template-blog-cbde1da391/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   Copy `.env.example` to `.env` and update the variables:
   ```bash
   cp .env.example .env
   ```
   
   Update your Strapi URL (default is `http://localhost:1337`).

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **For production**:
   ```bash
   npm start
   ```

## Deployment

### Prerequisites

- Node.js (v14+)
- Access to your hosting server
- A running Strapi backend

### Deployment Steps

1. **Upload the files to your server**:
   Use FTP, SCP, or your preferred method to upload the files to your server.

2. **Install dependencies**:
   ```bash
   npm install --production
   ```

3. **Set environment variables**:
   Make sure to set up the following environment variables on your server:
   - `PORT`: The port to run the frontend on (default: 3000)
   - `STRAPI_URL`: URL to your Strapi backend

4. **Start the server**:
   ```bash
   npm start
   ```

5. **For production with a process manager**:
   Using PM2:
   ```bash
   pm2 start server.js --name "cybercon-frontend"
   ```

### Using with Nginx

If you're using Nginx as a reverse proxy, here's a sample configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

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

### Using with Apache

For Apache, enable the proxy module and use a configuration like:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com

    ProxyRequests Off
    ProxyPreserveHost On
    ProxyVia Full

    <Proxy *>
        Require all granted
    </Proxy>

    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

## Customization

### Adding Images

Place your images in the `public/images/` directory. Make sure to include:

- Logo image: `logo.png`
- Favicon: `favicon.png`
- Default images for episodes, events, speakers, etc.

### Updating Templates

All page templates are in the `views/` directory as `.ejs` files. The reusable parts like header and footer are in `views/partials/`.

## Connecting to Strapi

This frontend is designed to work with the Strapi backend. Make sure your Strapi API has the proper content types and endpoints for:

- Episodes
- Events
- Speakers
- Contacts
- Newsletter subscribers

## License

Copyright © 2023 CyberCon. All rights reserved.
