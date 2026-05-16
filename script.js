(function () {
  'use strict';

  const year = String(new Date().getFullYear());
  ['year', 'poster-year'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = year;
  });

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-menu');

  const setMobileNav = (open) => {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileNav.hidden = !open;
  };

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      setMobileNav(open);
    });
    mobileNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setMobileNav(false));
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => {
      if (e.matches) setMobileNav(false);
    });
  }

  // Mobile mega accordion
  document.querySelectorAll('.mobile-mega-trigger').forEach((trigger) => {
    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') !== 'true';
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
    });
  });

  // Desktop mega nav
  const megaItems = document.querySelectorAll('.mega-item');
  let openItem = null;
  let closeTimer = null;

  const closeMega = (item) => {
    if (!item) return;
    const trigger = item.querySelector('.mega-trigger');
    const panel = item.querySelector('.mega-panel');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (panel) panel.hidden = true;
    if (openItem === item) openItem = null;
  };

  const openMega = (item) => {
    if (!item) return;
    if (openItem && openItem !== item) closeMega(openItem);
    const trigger = item.querySelector('.mega-trigger');
    const panel = item.querySelector('.mega-panel');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (panel) panel.hidden = false;
    openItem = item;
  };

  const closeAll = () => { if (openItem) closeMega(openItem); };

  megaItems.forEach((item) => {
    const trigger = item.querySelector('.mega-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMega(item);
      else openMega(item);
    });

    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      openMega(item);
    });
    item.addEventListener('mouseleave', () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => closeMega(item), 180);
    });

    item.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => closeAll());
    });
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
  document.addEventListener('click', (e) => {
    if (!openItem) return;
    if (!openItem.contains(e.target)) closeAll();
  });

  // Smooth scroll for hash links (skip mega triggers which use buttons)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
