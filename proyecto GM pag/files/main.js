/* ═══════════════════════════════════════
   main.js — Interactividad del sitio
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. NAV: sombra al hacer scroll ──────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // ── 2. NAV: menú hamburguesa (mobile) ───────────────
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


  // ── 3. SCROLL REVEAL (IntersectionObserver) ─────────
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


  // ── 4. FORMULARIO con Formspree ─────────────────────
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Limpiar errores anteriores
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      feedback.textContent = '';
      feedback.className = 'form-feedback';

      // Validación
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

      // Deshabilitar botón mientras envía
      const btn = form.querySelector('.btn-submit');
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      // ── Envío a Formspree ──
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

      // Restaurar botón
      btn.textContent = 'Enviar consulta →';
      btn.disabled = false;
    });
  }


  // ── 5. SMOOTH SCROLL ────────────────────────────────
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


  // ── UTILS ────────────────────────────────────────────
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

});