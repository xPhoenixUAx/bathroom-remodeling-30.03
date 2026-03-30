const body = document.body;
const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
const contactForm = document.querySelector("[data-contact-form]");
const contactModal = document.querySelector("[data-contact-modal]");
const contactModalCloseButtons = document.querySelectorAll("[data-contact-modal-close]");
const revealItems = document.querySelectorAll("[data-reveal]");
const parallaxSections = document.querySelectorAll("[data-parallax-section]");
const testimonialSlider = document.querySelector("[data-testimonial-slider]");
const cookieConsentKey = "bathing-room-cookie-consent";

const setMenuState = (open) => {
  if (!menu || !menuToggle) return;
  menu.classList.toggle("is-open", open);
  body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
};

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    setMenuState(!menu.classList.contains("is-open"));
  });

  menuCloseButtons.forEach((button) => {
    button.addEventListener("click", () => setMenuState(false));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });
}

const setContactModalState = (open) => {
  if (!contactModal) return;
  contactModal.classList.toggle("is-open", open);
  contactModal.setAttribute("aria-hidden", String(!open));
};

if (contactForm && contactModal) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setContactModalState(true);
    contactForm.reset();
  });

  contactModalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => setContactModalState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setContactModalState(false);
  });
}

const createCookieBanner = () => {
  if (window.localStorage.getItem(cookieConsentKey)) return;

  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-live", "polite");
  banner.setAttribute("aria-label", "Cookie consent");
  banner.innerHTML = `
    <div class="cookie-banner__copy">
      <p class="cookie-banner__title">Cookies on Bathing Room</p>
      <p class="cookie-banner__text">
        We use cookies to keep the website working properly, understand usage, and improve the experience.
        <a href="cookie.html">Read Cookie Policy</a>
      </p>
    </div>
    <div class="cookie-banner__actions">
      <button class="button button--subtle" type="button" data-cookie-action="decline">Decline</button>
      <button class="button button--primary" type="button" data-cookie-action="accept">Accept</button>
    </div>
  `;

  document.body.appendChild(banner);

  requestAnimationFrame(() => {
    banner.classList.add("is-visible");
  });

  banner.querySelectorAll("[data-cookie-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.getAttribute("data-cookie-action");
      window.localStorage.setItem(cookieConsentKey, choice || "accepted");
      banner.classList.remove("is-visible");

      const removeBanner = () => {
        banner.removeEventListener("transitionend", removeBanner);
        banner.remove();
      };

      banner.addEventListener("transitionend", removeBanner);
    });
  });
};

createCookieBanner();

if (testimonialSlider) {
  const slides = Array.from(testimonialSlider.querySelectorAll("[data-testimonial-slide]"));
  const dots = Array.from(testimonialSlider.querySelectorAll("[data-testimonial-dot]"));
  const prevButton = testimonialSlider.querySelector("[data-testimonial-prev]");
  const nextButton = testimonialSlider.querySelector("[data-testimonial-next]");
  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

  if (activeIndex < 0) activeIndex = 0;

  const syncTestimonials = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
      dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
    });

    activeIndex = index;
  };

  prevButton?.addEventListener("click", () => {
    const nextIndex = (activeIndex - 1 + slides.length) % slides.length;
    syncTestimonials(nextIndex);
  });

  nextButton?.addEventListener("click", () => {
    const nextIndex = (activeIndex + 1) % slides.length;
    syncTestimonials(nextIndex);
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => syncTestimonials(dotIndex));
  });

  syncTestimonials(activeIndex);
}

if (header) {
  const syncHeader = () => {
    header.classList.toggle("is-condensed", window.scrollY > 24);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

if (window.AOS) {
  revealItems.forEach((item, index) => {
    item.setAttribute("data-aos", "fade-up");
    item.setAttribute("data-aos-duration", "900");
    item.setAttribute("data-aos-delay", String(Math.min(index * 40, 180)));
    item.setAttribute("data-aos-easing", "ease-out-cubic");
    item.classList.add("is-visible");
  });

  window.AOS.init({
    once: true,
    offset: 80,
    duration: 900,
    easing: "ease-out-cubic"
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (
  parallaxSections.length &&
  window.gsap &&
  window.ScrollTrigger &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
  window.innerWidth > 720
) {
  window.gsap.registerPlugin(window.ScrollTrigger);

  parallaxSections.forEach((section) => {
    const bg = section.querySelector("[data-parallax-bg]");
    if (!bg) return;

    window.gsap.set(bg, {
      y: -90,
      scale: 1.14,
      force3D: true
    });

    window.gsap.to(bg, {
      y: 90,
      scale: 1.14,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1,
          invalidateOnRefresh: true
        }
      });
  });

  window.addEventListener("load", () => window.ScrollTrigger.refresh());
}

const faqDetails = document.querySelectorAll(".faq-list details");

if (faqDetails.length) {
  faqDetails.forEach((detail) => {
    const summary = detail.querySelector("summary");
    if (!summary) return;

    let answer = detail.querySelector(".faq-answer");

    if (!answer) {
      answer = document.createElement("div");
      answer.className = "faq-answer";

      const inner = document.createElement("div");
      inner.className = "faq-answer__inner";

      Array.from(detail.children).forEach((child) => {
        if (child !== summary) {
          inner.appendChild(child);
        }
      });

      answer.appendChild(inner);
      detail.appendChild(answer);
    }

    if (detail.open) {
      answer.style.height = `${answer.scrollHeight}px`;
    }

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      const isOpen = detail.open;

      if (isOpen) {
        answer.style.height = `${answer.scrollHeight}px`;

        requestAnimationFrame(() => {
          answer.style.height = "0px";
        });

        const closeDetail = () => {
          detail.open = false;
          answer.removeEventListener("transitionend", closeDetail);
        };

        answer.addEventListener("transitionend", closeDetail);
        return;
      }

      detail.open = true;
      answer.style.height = "0px";

      requestAnimationFrame(() => {
        answer.style.height = `${answer.scrollHeight}px`;
      });
    });
  });
}
