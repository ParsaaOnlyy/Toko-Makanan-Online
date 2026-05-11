// =============================================
// Parsha Food Gallery — script.js
// =============================================

// --- Swiper Init ---
const swiper = new Swiper('.mySwiper', {
  loop: true,
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// --- Menu Data (sinkron dengan food cards di HTML) ---
const menuData = [
  {
    name: 'Nasi Goreng',
    desc: 'Dimasak dengan bumbu rahasia koki terbaik kami.',
    price: 'Rp 15.000',
    img: 'nasigoreng.png',
    section: '#Home',
  },
  {
    name: 'Kentang Goreng',
    desc: 'Garing di luar, lembut di dalam, bumbu khas Parsha.',
    price: 'Rp 10.000',
    img: 'kentang.png',
    section: '#Dishes',
  },
  {
    name: 'Tempe Goreng',
    desc: 'Irisan tempe tebal, renyah sempurna dan kaya protein.',
    price: 'Rp 8.000',
    img: 'tempe.png',
    section: '#Dishes',
  },
  {
    name: 'Ayam Goreng Jawa',
    desc: 'Seporsi Ayam Goreng dengan bumbu khas dan pelengkap.',
    price: 'Rp 27.000',
    img: 'download (8).jpg',
    section: '#Dishes',
  },
  {
    name: 'Kwetiau Goreng',
    desc: 'Mie kenyal dengan bumbu gurih khas, ditambah sayuran segar.',
    price: 'Rp 16.000',
    img: 'Kwetiau goreng.jpg',
    section: '#Dishes',
  },
  {
    name: 'CapCay',
    desc: 'Sayuran beraneka ragam dengan saus tiram spesial, lezat dan bergizi.',
    price: 'Rp 13.000',
    img: 'Cap Cay Photography.jpg',
    section: '#Dishes',
  },
];

// --- Hamburger Menu ---
const hamburger = document.getElementById('hamburger');
const navbar    = document.getElementById('navbar');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navbar.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navbar.classList.remove('open');
  });
});

// --- Header scroll shadow ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// --- Active nav on scroll ---
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) link.classList.add('active');
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(sec => sectionObserver.observe(sec));

// ======================
// SEARCH FUNCTIONALITY
// ======================
const searchBtn     = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearchEl = document.getElementById('closeSearch');
const searchInput   = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

function openSearch() {
  searchOverlay.classList.add('active');
  searchInput.value = '';
  searchResults.innerHTML = '<p class="search-hint">Ketik nama makanan yang kamu cari 🍽️</p>';
  setTimeout(() => searchInput.focus(), 120);
}

function closeSearchOverlay() {
  searchOverlay.classList.remove('active');
  searchInput.value = '';
}

searchBtn.addEventListener('click', openSearch);
closeSearchEl.addEventListener('click', closeSearchOverlay);
searchOverlay.addEventListener('click', (e) => {
  if (e.target === searchOverlay) closeSearchOverlay();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSearchOverlay();
});

// Live search as user types
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();

  if (!q) {
    searchResults.innerHTML = '<p class="search-hint">Ketik nama makanan yang kamu cari 🍽️</p>';
    return;
  }

  const matches = menuData.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.desc.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    searchResults.innerHTML =
      '<div class="search-no-result"><span>🤔</span>Menu tidak ditemukan. Coba kata kunci lain ya!</div>';
    return;
  }

  searchResults.innerHTML = matches.map(item => {
    const thumb = item.img
      ? '<div class="result-emoji"><img src="' + item.img + '" alt="' + escHtml(item.name) + '" /></div>'
      : '<div class="result-emoji">' + item.emoji + '</div>';

    return '<a class="search-result-item" href="' + item.section + '" onclick="closeSearchOverlay()">'
      + thumb
      + '<div class="result-info">'
      + '<strong>' + highlightMatch(item.name, q) + '</strong>'
      + '<span>' + escHtml(item.desc) + '</span>'
      + '</div>'
      + '<span class="result-price">' + item.price + '</span>'
      + '</a>';
  }).join('');
});

// expose so onclick attr in results can call it
window.closeSearchOverlay = closeSearchOverlay;

function escHtml(str) {
  return str.replace(/[&<>"']/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function highlightMatch(text, query) {
  var safe = escHtml(text);
  var re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return safe.replace(re, '<mark style="background:rgba(37,173,97,0.2);color:#0f5c31;border-radius:3px;padding:0 2px;">$1</mark>');
}

// --- Entrance animations ---
const animTargets = document.querySelectorAll('.food-card, .chef-card, .facility-card');

const appearObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (i % 4) * 0.08 + 's';
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      appearObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

animTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  appearObserver.observe(el);
});