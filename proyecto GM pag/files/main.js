

document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });


  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  }

  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      feedback.textContent = '';
      feedback.className = 'form-feedback';

      const nombre = document.getElementById('nombre');
      const email  = document.getElementById('email');
      const motivo = document.getElementById('motivo');

      let valid = true;

      if (!nombre.value.trim()) {
        nombre.classList.add('error');
        valid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        email.classList.add('error');
        valid = false;
      }

      if (!motivo.value) {
        motivo.classList.add('error');
        valid = false;
      }

      if (!valid) {
        feedback.textContent = 'Por favor completá los campos obligatorios.';
        feedback.classList.add('error');
        return;
      }

      const btn = form.querySelector('.btn-submit');
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      try {
        const response = await fetch('https://formspree.io/f/xpqyavze', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });

        if (response.ok) {
          feedback.textContent = '✓ Mensaje enviado. El Dr. Michelic se contactará a la brevedad.';
          feedback.classList.add('success');
          form.reset();
        } else {
          throw new Error('Error en el servidor');
        }

      } catch (error) {
        feedback.textContent = '✗ Hubo un error al enviar. Intentá de nuevo o escribí por WhatsApp.';
        feedback.classList.add('error');
      }

      btn.textContent = 'Enviar consulta →';
      btn.disabled = false;
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });




  document.querySelectorAll('.faq-pregunta').forEach(btn => {
    btn.addEventListener('click', () => {
      const respuesta = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.faq-pregunta').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });

      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        respuesta.classList.add('open');
      }
    });
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

});