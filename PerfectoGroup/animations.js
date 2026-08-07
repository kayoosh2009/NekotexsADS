/* =========================================================
   Perfecto Group — анимации и интерактив
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Появление элементов при скролле ---------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // задержка из data-delay (для каскадного появления)
        const delay = el.dataset.delay || 0;
        el.style.setProperty('--delay', `${delay}ms`);
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ---------- 2. Анимация счётчиков ---------- */
  const counters = document.querySelectorAll('.counter');

  const runCounter = (el) => {
    const target = +el.dataset.target;
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo — быстро в начале, плавно в конце
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => counterObserver.observe(c));


  /* ---------- 3. Навбар при скролле ---------- */
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ---------- 4. Мобильное меню ---------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    burger.classList.toggle('active');
  });

  // закрываем меню после клика по ссылке
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('active');
    });
  });


  /* ---------- 5. Лёгкий параллакс за курсором ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 .. 1
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  const animateParallax = () => {
    // плавное приближение к цели (lerp)
    curX += (mouseX - curX) * 0.06;
    curY += (mouseY - curY) * 0.06;

    parallaxEls.forEach(el => {
      const depth = parseFloat(el.dataset.parallax) * 100;
      el.style.transform = `translate(${curX * depth}px, ${curY * depth}px)`;
    });
    requestAnimationFrame(animateParallax);
  };
  // параллакс только на десктопе
  if (window.matchMedia('(pointer: fine)').matches) {
    animateParallax();
  }


  /* ---------- 6. Форма (демо-обработчик) ---------- */
  const form = document.getElementById('leadForm');
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: здесь подключим отправку на бэкенд / WhatsApp
    success.hidden = false;
    form.querySelector('button[type="submit"]').textContent = '✓ נשלח בהצלחה';
    setTimeout(() => {
      form.reset();
      form.querySelector('button[type="submit"]').textContent = 'שליחת פרטים';
    }, 3000);
  });


  /* ---------- 7. Текущий год в футере ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});