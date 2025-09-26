// JavaScript for InternMatch Presentation Website

class PresentationController {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 6;
    this.init();
  }

  init() {
    this.updateSlideCounter();
    this.setupEventListeners();
    this.setupKeyboardNavigation();
    this.showSlide(1);
  }

  setupEventListeners() {
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    prevBtn.addEventListener("click", () => this.previousSlide());
    nextBtn.addEventListener("click", () => this.nextSlide());

    // Touch/swipe support for mobile
    this.setupTouchNavigation();
  }

  setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          this.previousSlide();
          break;
        case "ArrowRight":
        case "ArrowDown":
        case " ": // Spacebar
          e.preventDefault();
          this.nextSlide();
          break;
        case "Home":
          e.preventDefault();
          this.goToSlide(1);
          break;
        case "End":
          e.preventDefault();
          this.goToSlide(this.totalSlides);
          break;
        case "Escape":
          e.preventDefault();
          this.toggleFullscreen();
          break;
      }
    });
  }

  setupTouchNavigation() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    document.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    document.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      this.handleSwipe();
    });

    const handleSwipe = () => {
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const minSwipeDistance = 50;

      // Horizontal swipe
      if (
        Math.abs(deltaX) > Math.abs(deltaY) &&
        Math.abs(deltaX) > minSwipeDistance
      ) {
        if (deltaX > 0) {
          this.previousSlide(); // Swipe right
        } else {
          this.nextSlide(); // Swipe left
        }
      }
    };

    this.handleSwipe = handleSwipe;
  }

  showSlide(slideNumber) {
    // Hide all slides
    const slides = document.querySelectorAll(".slide");
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });

    // Show current slide
    const currentSlideElement = document.getElementById(`slide-${slideNumber}`);
    if (currentSlideElement) {
      currentSlideElement.classList.add("active");
      this.currentSlide = slideNumber;
      this.updateSlideCounter();
      this.updateNavigationButtons();
      this.animateSlideContent(currentSlideElement);
    }
  }

  animateSlideContent(slideElement) {
    // Add entrance animations to slide elements
    const animatedElements = slideElement.querySelectorAll(
      ".step, .benefit-section, .innovation-item, .tech-item"
    );

    animatedElements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";

      setTimeout(() => {
        element.style.transition = "all 0.6s ease";
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, index * 200);
    });
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides) {
      this.showSlide(this.currentSlide + 1);
    }
  }

  previousSlide() {
    if (this.currentSlide > 1) {
      this.showSlide(this.currentSlide - 1);
    }
  }

  goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
      this.showSlide(slideNumber);
    }
  }

  updateSlideCounter() {
    const currentSlideElement = document.getElementById("current-slide");
    const totalSlidesElement = document.getElementById("total-slides");

    if (currentSlideElement) {
      currentSlideElement.textContent = this.currentSlide;
    }
    if (totalSlidesElement) {
      totalSlidesElement.textContent = this.totalSlides;
    }
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    if (prevBtn) {
      prevBtn.disabled = this.currentSlide === 1;
    }
    if (nextBtn) {
      nextBtn.disabled = this.currentSlide === this.totalSlides;
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  }
}

// Auto-play functionality (optional)
class AutoPlay {
  constructor(presentation, interval = 30000) {
    // 30 seconds per slide
    this.presentation = presentation;
    this.interval = interval;
    this.timer = null;
    this.isPlaying = false;
  }

  start() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.timer = setInterval(() => {
        if (this.presentation.currentSlide < this.presentation.totalSlides) {
          this.presentation.nextSlide();
        } else {
          this.stop(); // Stop at the end
        }
      }, this.interval);
    }
  }

  stop() {
    if (this.isPlaying) {
      this.isPlaying = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }
}

// Progress bar functionality
class ProgressBar {
  constructor(presentation) {
    this.presentation = presentation;
    this.createProgressBar();
  }

  createProgressBar() {
    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";
    progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        `;

    // Add CSS for progress bar
    const style = document.createElement("style");
    style.textContent = `
            .progress-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.3);
                z-index: 1001;
            }
            .progress-bar {
                width: 100%;
                height: 100%;
                background: transparent;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                transition: width 0.3s ease;
                width: 0%;
            }
        `;
    document.head.appendChild(style);
    document.body.appendChild(progressContainer);

    this.progressFill = progressContainer.querySelector(".progress-fill");
    this.updateProgress();
  }

  updateProgress() {
    const progress =
      (this.presentation.currentSlide / this.presentation.totalSlides) * 100;
    this.progressFill.style.width = `${progress}%`;
  }
}

// Slide thumbnails/overview functionality
class SlideOverview {
  constructor(presentation) {
    this.presentation = presentation;
    this.isOverviewOpen = false;
    this.setupOverviewToggle();
  }

  setupOverviewToggle() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab" || e.key === "o" || e.key === "O") {
        e.preventDefault();
        this.toggleOverview();
      }
    });
  }

  toggleOverview() {
    if (this.isOverviewOpen) {
      this.closeOverview();
    } else {
      this.openOverview();
    }
  }

  openOverview() {
    this.isOverviewOpen = true;
    // Implementation for slide overview would go here
    // For now, just show slide numbers
    this.showSlideSelector();
  }

  closeOverview() {
    this.isOverviewOpen = false;
    const overview = document.querySelector(".slide-overview");
    if (overview) {
      overview.remove();
    }
  }

  showSlideSelector() {
    const overview = document.createElement("div");
    overview.className = "slide-overview";
    overview.innerHTML = `
            <div class="overview-backdrop">
                <div class="overview-content">
                    <h3>Go to Slide</h3>
                    <div class="slide-selector">
                        ${Array.from(
                          { length: this.presentation.totalSlides },
                          (_, i) => `
                            <button class="slide-thumb" data-slide="${i + 1}">
                                Slide ${i + 1}
                            </button>
                        `
                        ).join("")}
                    </div>
                    <button class="close-overview">Close (ESC)</button>
                </div>
            </div>
        `;

    // Add CSS for overview
    const style = document.createElement("style");
    style.textContent = `
            .slide-overview {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .overview-backdrop {
                background: rgba(0, 0, 0, 0.8);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .overview-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                max-width: 600px;
                width: 90%;
            }
            .slide-selector {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            .slide-thumb {
                padding: 15px;
                border: 2px solid #667eea;
                border-radius: 10px;
                background: transparent;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .slide-thumb:hover {
                background: #667eea;
                color: white;
            }
            .close-overview {
                margin-top: 20px;
                padding: 10px 20px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(overview);

    // Add event listeners
    overview.addEventListener("click", (e) => {
      if (e.target.classList.contains("slide-thumb")) {
        const slideNumber = parseInt(e.target.dataset.slide);
        this.presentation.goToSlide(slideNumber);
        this.closeOverview();
      } else if (
        e.target.classList.contains("close-overview") ||
        e.target.classList.contains("overview-backdrop")
      ) {
        this.closeOverview();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOverviewOpen) {
        this.closeOverview();
      }
    });
  }
}

// Help/Instructions overlay
class HelpOverlay {
  constructor() {
    this.setupHelpToggle();
  }

  setupHelpToggle() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "?" || e.key === "h" || e.key === "H") {
        e.preventDefault();
        this.showHelp();
      }
    });
  }

  showHelp() {
    const existingHelp = document.querySelector(".help-overlay");
    if (existingHelp) {
      existingHelp.remove();
      return;
    }

    const help = document.createElement("div");
    help.className = "help-overlay";
    help.innerHTML = `
            <div class="help-backdrop">
                <div class="help-content">
                    <h3>Keyboard Shortcuts</h3>
                    <div class="shortcuts">
                        <div class="shortcut">
                            <kbd>←</kbd> <kbd>↑</kbd> Previous slide
                        </div>
                        <div class="shortcut">
                            <kbd>→</kbd> <kbd>↓</kbd> <kbd>Space</kbd> Next slide
                        </div>
                        <div class="shortcut">
                            <kbd>Home</kbd> First slide
                        </div>
                        <div class="shortcut">
                            <kbd>End</kbd> Last slide
                        </div>
                        <div class="shortcut">
                            <kbd>Tab</kbd> <kbd>O</kbd> Slide overview
                        </div>
                        <div class="shortcut">
                            <kbd>Esc</kbd> Fullscreen toggle
                        </div>
                        <div class="shortcut">
                            <kbd>?</kbd> <kbd>H</kbd> This help
                        </div>
                    </div>
                    <p>You can also use mouse/touch navigation</p>
                    <button class="close-help">Close</button>
                </div>
            </div>
        `;

    // Add CSS for help overlay
    const style = document.createElement("style");
    style.textContent = `
            .help-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .help-backdrop {
                background: rgba(0, 0, 0, 0.8);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .help-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
            }
            .shortcuts {
                margin: 20px 0;
            }
            .shortcut {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                gap: 10px;
            }
            kbd {
                background: #f0f0f0;
                border: 1px solid #ccc;
                border-radius: 3px;
                padding: 2px 6px;
                font-family: monospace;
                font-size: 0.9em;
            }
            .close-help {
                margin-top: 20px;
                padding: 10px 20px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(help);

    help.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("close-help") ||
        e.target.classList.contains("help-backdrop")
      ) {
        help.remove();
      }
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const presentation = new PresentationController();
  const progressBar = new ProgressBar(presentation);
  const slideOverview = new SlideOverview(presentation);
  const helpOverlay = new HelpOverlay();

  // Optional: Auto-play (uncomment to enable)
  // const autoPlay = new AutoPlay(presentation, 30000);

  // Update progress bar when slide changes
  const originalShowSlide = presentation.showSlide.bind(presentation);
  presentation.showSlide = function (slideNumber) {
    originalShowSlide(slideNumber);
    progressBar.updateProgress();
  };

  console.log("InternMatch Presentation loaded successfully!");
  console.log("Press ? or H for keyboard shortcuts");
});
