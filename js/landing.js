// Gooads CV - Landing Page Interactivity

document.addEventListener('DOMContentLoaded', () => {
  // Initialize language if languages.js is loaded
  if (typeof setLanguage === 'function') {
    const savedLang = localStorage.getItem('gooadsLang') || 'en';
    setLanguage(savedLang);
    
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
      langSelect.value = savedLang;
      langSelect.addEventListener('change', function() {
        setLanguage(this.value);
      });
    }
  }
  
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item summary').forEach(summary => {
    summary.addEventListener('click', () => {
      // Close other open items
      document.querySelectorAll('.faq-item[open]').forEach(item => {
        if (item !== summary.parentElement) {
          item.removeAttribute('open');
        }
      });
    });
  });

  // Navbar background on scroll
  const navbar = document.querySelector('.navbar');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = 'none';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe feature cards
  document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // Observe steps
  document.querySelectorAll('.step').forEach((step, index) => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(20px)';
    step.style.transition = `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`;
    observer.observe(step);
  });

  // Add animate-in class styles
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // Lazy load images (if any added later)
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.src = img.dataset.src;
    });
  }
});
