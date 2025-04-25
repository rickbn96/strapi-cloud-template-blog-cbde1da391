// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav && nav.classList.contains('active') && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
            nav.classList.remove('active');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight active navigation item
    const highlightActiveLink = () => {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('nav ul li a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath || 
                (linkPath !== '/' && currentPath.startsWith(linkPath))) {
                link.style.color = '#26a0da';
            }
        });
    };
    
    highlightActiveLink();

    // Show/hide back-to-top button
    const showBackToTopButton = () => {
        const backToTopBtn = document.querySelector('.back-to-top');
        
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    };
    
    window.addEventListener('scroll', showBackToTopButton);

    // Initialize animations on scroll
    const initScrollAnimations = () => {
        const elements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right');
        
        const checkInView = () => {
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    element.classList.add('in-view');
                }
            });
        };
        
        window.addEventListener('scroll', checkInView);
        checkInView(); // Check on load
    };
    
    initScrollAnimations();
});

// Form validation for contact form
const validateContactForm = () => {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let valid = true;
            const name = this.name.value.trim();
            const email = this.email.value.trim();
            const subject = this.subject.value.trim();
            const message = this.message.value.trim();
            
            // Clear previous error messages
            document.querySelectorAll('.error').forEach(el => el.textContent = '');
            
            // Validate name
            if (name === '') {
                document.getElementById('name-error').textContent = 'Il nome è obbligatorio';
                valid = false;
            }
            
            // Validate email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === '') {
                document.getElementById('email-error').textContent = 'L\'email è obbligatoria';
                valid = false;
            } else if (!emailPattern.test(email)) {
                document.getElementById('email-error').textContent = 'Inserisci un\'email valida';
                valid = false;
            }
            
            // Validate subject
            if (subject === '') {
                document.getElementById('subject-error').textContent = 'L\'oggetto è obbligatorio';
                valid = false;
            }
            
            // Validate message
            if (message === '') {
                document.getElementById('message-error').textContent = 'Il messaggio è obbligatorio';
                valid = false;
            } else if (message.length < 20) {
                document.getElementById('message-error').textContent = 'Il messaggio deve essere di almeno 20 caratteri';
                valid = false;
            }
            
            if (!valid) {
                e.preventDefault();
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', validateContactForm);

// Audio player for podcast episodes
class PodcastPlayer {
    constructor() {
        this.player = document.getElementById('podcast-player');
        this.audioElement = document.getElementById('podcast-audio');
        this.playBtn = document.getElementById('play-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.progressBar = document.getElementById('progress-bar');
        this.currentTime = document.getElementById('current-time');
        this.duration = document.getElementById('duration');
        this.episodeTitle = document.getElementById('episode-title');
        this.initPlayer();
    }
    
    initPlayer() {
        if (!this.player) return;
        
        // Play button event
        if (this.playBtn) {
            this.playBtn.addEventListener('click', () => {
                this.audioElement.play();
                this.playBtn.style.display = 'none';
                this.pauseBtn.style.display = 'block';
            });
        }
        
        // Pause button event
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => {
                this.audioElement.pause();
                this.pauseBtn.style.display = 'none';
                this.playBtn.style.display = 'block';
            });
        }
        
        // Progress bar update
        if (this.audioElement && this.progressBar) {
            this.audioElement.addEventListener('timeupdate', () => {
                const percentage = (this.audioElement.currentTime / this.audioElement.duration) * 100;
                this.progressBar.value = percentage;
                
                // Update current time
                if (this.currentTime) {
                    const minutes = Math.floor(this.audioElement.currentTime / 60);
                    const seconds = Math.floor(this.audioElement.currentTime % 60);
                    this.currentTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                }
            });
        }
        
        // Set duration on load
        if (this.audioElement && this.duration) {
            this.audioElement.addEventListener('loadedmetadata', () => {
                const minutes = Math.floor(this.audioElement.duration / 60);
                const seconds = Math.floor(this.audioElement.duration % 60);
                this.duration.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            });
        }
        
        // Progress bar click event
        if (this.progressBar && this.audioElement) {
            this.progressBar.addEventListener('click', (e) => {
                const pos = (e.pageX - this.progressBar.offsetLeft) / this.progressBar.offsetWidth;
                this.audioElement.currentTime = pos * this.audioElement.duration;
            });
        }
    }
    
    loadEpisode(audioUrl, title) {
        if (!this.audioElement) return;
        
        this.audioElement.src = audioUrl;
        if (this.episodeTitle) {
            this.episodeTitle.textContent = title;
        }
        
        this.audioElement.load();
        this.playBtn.style.display = 'block';
        this.pauseBtn.style.display = 'none';
    }
}

// Initialize podcast player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const podcastPlayer = new PodcastPlayer();
    
    // Episode play buttons
    document.querySelectorAll('.play-episode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const audioUrl = this.dataset.audio;
            const title = this.dataset.title;
            podcastPlayer.loadEpisode(audioUrl, title);
            
            // Show player if it's hidden
            const player = document.getElementById('podcast-player');
            if (player) {
                player.classList.add('show');
                
                // Scroll to player if not in view
                if (player.getBoundingClientRect().top < 0 || 
                    player.getBoundingClientRect().bottom > window.innerHeight) {
                    player.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
