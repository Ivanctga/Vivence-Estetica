/**
 * Vivence Estética Avançada - Main Scripts
 * Vanilla JS Implementation
 */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initSmoothScroll();
  initActiveMenu();
  initStatsCounter();
  initTestimonialsCarousel();
  initContactForm();
  initScrollTop();
});

/* ===== HEADER SCROLL EFFECT ===== */
function initHeader() {
  const header = document.getElementById("header");
  const scrollThreshold = 80;

  window.addEventListener("scroll", () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav__link");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    nav.classList.toggle("open");
  });

  // Close menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      nav.classList.remove("open");
    });
  });
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-delay") || 0;

          setTimeout(() => {
            entry.target.classList.add("active");
          }, delay);

          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  reveals.forEach((reveal) => revealObserver.observe(reveal));
}

/* ===== SMOOTH SCROLL ===== */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const headerHeight = document.getElementById("header").offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

/* ===== STATS COUNTER ===== */
function initStatsCounter() {
  const stats = document.querySelectorAll(".stat-number");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseInt(target.getAttribute("data-target"));
          let current = 0;
          const duration = 2000; // 2 seconds
          const increment = countTo / (duration / 16); // 60fps

          const updateCounter = () => {
            current += increment;
            if (current < countTo) {
              target.innerText = Math.ceil(current);
              requestAnimationFrame(updateCounter);
            } else {
              target.innerText = countTo;
            }
          };

          updateCounter();
          counterObserver.unobserve(target);
        }
      });
    },
    { threshold: 0.5 },
  );

  stats.forEach((stat) => counterObserver.observe(stat));
}

/* ===== TESTIMONIALS CAROUSEL ===== */
function initTestimonialsCarousel() {
  const carousel = document.getElementById("testimonials-carousel");
  const cards = document.querySelectorAll(".testimonial-card");
  const dotsContainer = document.getElementById("carousel-dots");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  if (!carousel || cards.length === 0) return;

  let currentIndex = 0;
  let autoPlayInterval;

  // Create dots
  cards.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 32; // card + gap
    carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    resetAutoPlay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    // On desktop (3 cards visible), we might want to stop earlier,
    // but for simplicity and responsiveness, we scroll one by one.
    // Adjust for visibility logic if needed:
    const visibleCards =
      window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
    if (currentIndex > cards.length - visibleCards) {
      currentIndex = 0;
    }
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoPlay();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoPlay();
  });

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // Pause on hover
  carousel.addEventListener("mouseenter", () =>
    clearInterval(autoPlayInterval),
  );
  carousel.addEventListener("mouseleave", startAutoPlay);

  // Responsive adjustment
  window.addEventListener("resize", updateCarousel);

  startAutoPlay();
}

/* ===== CONTACT FORM & VALIDATION ===== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const phoneInput = document.getElementById("phone");
  const toast = document.getElementById("toast");

  if (!form) return;

  // Phone Mask: (00) 00000-0000
  phoneInput.addEventListener("input", (e) => {
    let x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    e.target.value = !x[2]
      ? x[1]
      : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Simple validation check
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Simulation of submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;

    submitBtn.disabled = true;
    submitBtn.innerText = "Enviando...";

    setTimeout(() => {
      // Success
      showToast();
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
    }, 1500);
  });

  function showToast() {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }
}

/* ===== SCROLL TOP ===== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById("scroll-top");
  const threshold = 600;

  window.addEventListener("scroll", () => {
    if (window.scrollY > threshold) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/* ===== ACTIVE MENU ON SCROLL ===== */
function initActiveMenu() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollY = window.pageYOffset;
    const headerHeight = document.getElementById("header").offsetHeight;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });
}
