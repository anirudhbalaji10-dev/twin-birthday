(function () {
  const MUSIC_KEYS = {
    started: "twins_music_started",
    time: "twins_music_time"
  };

  const PHOTO_POOL = Array.from({ length: 16 }, (_, index) => `assets/images/memory${index + 1}.jpg`);

  let musicSaveTimer = null;
  let lastTrailTime = 0;
  let climaxBurstTimer = null;

  function getAudio() {
    return document.getElementById("bgMusic");
  }

  function resumeMusicIfNeeded() {
    const audio = getAudio();
    if (!audio) {
      return;
    }

    const started = localStorage.getItem(MUSIC_KEYS.started) === "true";
    const time = Number(localStorage.getItem(MUSIC_KEYS.time) || 0);

    if (time > 0 && Number.isFinite(time)) {
      audio.currentTime = time;
    }

    if (started) {
      audio.play().catch(() => {});
    }
  }

  function startMusicTracking() {
    const audio = getAudio();
    if (!audio) {
      return;
    }

    if (musicSaveTimer) {
      window.clearInterval(musicSaveTimer);
    }

    musicSaveTimer = window.setInterval(() => {
      if (!audio.paused) {
        localStorage.setItem(MUSIC_KEYS.time, String(audio.currentTime));
      }
    }, 650);

    audio.addEventListener("play", () => {
      localStorage.setItem(MUSIC_KEYS.started, "true");
    });

    window.addEventListener("beforeunload", () => {
      localStorage.setItem(MUSIC_KEYS.time, String(audio.currentTime));
    });
  }

  async function playMusicFromInteraction() {
    const audio = getAudio();
    if (!audio) {
      return;
    }

    try {
      await audio.play();
      localStorage.setItem(MUSIC_KEYS.started, "true");
    } catch (_error) {
      // Ignored: autoplay restrictions are user-agent controlled.
    }
  }

  function resetMusicForNewEntry() {
    const audio = getAudio();
    if (audio) {
      audio.currentTime = 0;
    }
    localStorage.setItem(MUSIC_KEYS.time, "0");
    localStorage.setItem(MUSIC_KEYS.started, "true");
  }

  function animateLandingIn() {
    const panel = document.getElementById("landingPanel");
    if (!panel || !window.gsap) {
      return;
    }

    window.gsap.fromTo(
      panel,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
    );
  }

  function initLandingNavigation() {
    const enterBtn = document.getElementById("enterBtn");
    const panel = document.getElementById("landingPanel");

    if (!enterBtn || !panel) {
      return;
    }

    enterBtn.addEventListener("click", async () => {
      resetMusicForNewEntry();
      await playMusicFromInteraction();

      if (window.gsap) {
        window.gsap.to(panel, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            window.location.href = "celebration.html";
          }
        });
        return;
      }

      window.location.href = "celebration.html";
    });
  }

  function getActiveStage() {
    return document.querySelector(".stage.active");
  }

  function switchStage(nextName) {
    const current = getActiveStage();
    const next = document.querySelector(`.stage[data-stage="${nextName}"]`);

    if (!current || !next || current === next) {
      return;
    }

    if (!window.gsap) {
      current.classList.remove("active");
      next.classList.add("active");
      return;
    }

    next.classList.add("active");
    window.gsap.set(next, { opacity: 0, y: 44 });

    const timeline = window.gsap.timeline();
    timeline
      .to(current, { opacity: 0, y: -20, duration: 0.42, ease: "power2.inOut" })
      .to(next, { opacity: 1, y: 0, duration: 0.52, ease: "power3.out" }, "<0.12")
      .add(() => {
        current.classList.remove("active");
      });
  }

  function initStageButtons() {
    const nextButtons = document.querySelectorAll("[data-next]");
    nextButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const next = button.getAttribute("data-next");
        if (next) {
          switchStage(next);
        }
      });
    });

    const finalSurpriseBtn = document.getElementById("finalSurpriseBtn");
    if (finalSurpriseBtn) {
      finalSurpriseBtn.addEventListener("click", () => {
        switchStage("closing");
      });
    }
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnTrailStar(x, y, burst = false) {
    const star = document.createElement("span");
    star.className = burst ? "star-trail-particle burst" : "star-trail-particle";
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    document.body.appendChild(star);

    const driftX = randomBetween(-26, 26);
    const driftY = burst ? randomBetween(-80, -26) : randomBetween(-30, -10);
    const duration = burst ? randomBetween(0.8, 1.2) : randomBetween(0.5, 0.85);

    if (window.gsap) {
      window.gsap.fromTo(
        star,
        { opacity: 1, scale: burst ? 0.8 : 0.6 },
        {
          opacity: 0,
          scale: burst ? 1.5 : 1.1,
          x: driftX,
          y: driftY,
          duration,
          ease: "power2.out",
          onComplete: () => star.remove()
        }
      );
      return;
    }

    window.setTimeout(() => star.remove(), 900);
  }

  function showSurpriseToast(message) {
    const toast = document.getElementById("surpriseToast");
    if (!toast) {
      return;
    }

    toast.textContent = message;
    if (window.gsap) {
      window.gsap.killTweensOf(toast);
      window.gsap.fromTo(
        toast,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            window.gsap.to(toast, { opacity: 0, y: 14, duration: 0.45, delay: 2.1, ease: "power2.in" });
          }
        }
      );
      return;
    }

    toast.style.opacity = "1";
    window.setTimeout(() => {
      toast.style.opacity = "0";
    }, 2200);
  }

  function triggerMemoryCompleteSurprise() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    for (let i = 0; i < 34; i += 1) {
      window.setTimeout(() => {
        const offsetX = randomBetween(-120, 120);
        const offsetY = randomBetween(-60, 60);
        spawnTrailStar(centerX + offsetX, centerY + offsetY, true);
      }, i * 14);
    }
    showSurpriseToast("Surprise unlocked: your memory sky is complete.");
  }

  function triggerClimaxBurst(x, y) {
    for (let i = 0; i < 52; i += 1) {
      window.setTimeout(() => {
        const offsetX = randomBetween(-180, 180);
        const offsetY = randomBetween(-180, 90);
        spawnTrailStar(x + offsetX, y + offsetY, true);
      }, i * 8);
    }
  }

  function triggerSkyWideBurst() {
    for (let i = 0; i < 7; i += 1) {
      const burstX = randomBetween(30, window.innerWidth - 30);
      const burstY = randomBetween(40, window.innerHeight - 40);
      window.setTimeout(() => {
        triggerClimaxBurst(burstX, burstY);
      }, i * 120);
    }
  }

  function createPolaroid(x, y, container, count) {
    const card = document.createElement("article");
    card.className = "polaroid";

    const image = document.createElement("img");
    image.src = PHOTO_POOL[count];
    image.alt = `Twin memory ${count + 1}`;
    image.addEventListener("error", () => {
      image.src = count % 2 === 0 ? "assets/images/placeholder1.jpg" : "assets/images/placeholder2.jpg";
    });

    card.appendChild(image);

    const rect = container.getBoundingClientRect();
    const left = Math.max(6, Math.min(x - rect.left - 70, rect.width - 140));
    const top = Math.max(6, Math.min(y - rect.top - 78, rect.height - 150));
    const rotation = randomBetween(-15, 15);

    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
    card.style.transform = `rotate(${rotation}deg)`;

    container.appendChild(card);

    if (window.gsap) {
      window.gsap.fromTo(
        card,
        { opacity: 0, scale: 0.5, rotate: rotation - 12 },
        { opacity: 1, scale: 1, rotate: rotation, duration: 0.75, ease: "elastic.out(1, 0.5)" }
      );
    } else {
      card.style.opacity = "1";
    }
  }

  function initMemoryCanvas() {
    const canvas = document.getElementById("memoryCanvas");
    const memoryCount = document.getElementById("memoryCount");
    const memoryEnd = document.getElementById("memoryEnd");

    if (!canvas) {
      return;
    }

    let clickCount = 0;

    const updateCountText = () => {
      if (memoryCount) {
        memoryCount.textContent = `${clickCount} / ${PHOTO_POOL.length} memories revealed`;
      }

      if (memoryEnd && clickCount >= PHOTO_POOL.length) {
        memoryEnd.innerHTML = "All 16 memories revealed beautifully <i class=\"fa-solid fa-sparkles\"></i>";
        triggerMemoryCompleteSurprise();
      }
    };

    const handler = (event) => {
      if (clickCount >= PHOTO_POOL.length) {
        return;
      }

      const point = event;
      if (!point) {
        return;
      }

      createPolaroid(point.clientX, point.clientY, canvas, clickCount);
      clickCount += 1;
      updateCountText();
    };

    canvas.addEventListener("pointerdown", handler);
    updateCountText();
  }

  function initPointerStarTrail() {
    if (!document.body.classList.contains("celebration-page")) {
      return;
    }

    const trackPointer = (x, y) => {
      const now = Date.now();
      if (now - lastTrailTime < 34) {
        return;
      }
      lastTrailTime = now;
      spawnTrailStar(x, y, false);
    };

    window.addEventListener("pointermove", (event) => {
      trackPointer(event.clientX, event.clientY);
    });

    window.addEventListener(
      "touchmove",
      (event) => {
        const touch = event.touches && event.touches[0];
        if (touch) {
          trackPointer(touch.clientX, touch.clientY);
        }
      },
      { passive: true }
    );
  }

  function initClimaxExperience() {
    const climaxBtn = document.getElementById("climaxBtn");
    const closingStage = document.getElementById("closingStage");
    const closingPanel = closingStage ? closingStage.querySelector(".closing-panel") : null;
    const climaxMessage = document.getElementById("climaxMessage");
    const cosmicTravel = document.getElementById("cosmicTravel");
    const travelLabel = document.getElementById("travelLabel");
    if (!climaxBtn || !closingStage) {
      return;
    }

    let climaxActive = false;
    let sequenceRunning = false;
    const activate = () => {
      if (sequenceRunning) {
        return;
      }
      sequenceRunning = true;
      climaxActive = true;
      document.body.classList.add("climax-active");

      if (closingPanel) {
        closingPanel.style.opacity = "0";
        closingPanel.style.pointerEvents = "none";
      }

      if (cosmicTravel) {
        cosmicTravel.classList.remove("align-active");
        cosmicTravel.classList.remove("sequence-active");
        window.requestAnimationFrame(() => {
          cosmicTravel.classList.add("sequence-active");
        });
      }
      if (travelLabel) {
        travelLabel.textContent = "Travelling Across the Solar System...";
      }

      showSurpriseToast("Travelling through the solar system...");
      if (climaxBurstTimer) {
        window.clearInterval(climaxBurstTimer);
      }

      window.setTimeout(() => {
        if (cosmicTravel) {
          cosmicTravel.classList.add("align-active");
        }
        if (travelLabel) {
          travelLabel.textContent = "Solar System Aligned";
        }
      }, 5600);

      window.setTimeout(() => {
        if (cosmicTravel) {
          cosmicTravel.classList.remove("align-active");
          cosmicTravel.classList.remove("sequence-active");
        }
        if (closingPanel) {
          if (window.gsap) {
            window.gsap.to(closingPanel, {
              opacity: 1,
              duration: 0.7,
              ease: "power2.out",
              onStart: () => {
                closingPanel.style.pointerEvents = "auto";
              }
            });
          } else {
            closingPanel.style.opacity = "1";
            closingPanel.style.pointerEvents = "auto";
          }
        }

        showSurpriseToast("Final page unlocked. Tap anywhere for cosmic bursts.");
        triggerClimaxBurst(window.innerWidth / 2, window.innerHeight / 2);
        triggerSkyWideBurst();

        window.clearInterval(climaxBurstTimer);
        climaxBurstTimer = window.setInterval(() => {
          if (climaxActive && closingStage.classList.contains("active")) {
            triggerSkyWideBurst();
          }
        }, 2200);

        sequenceRunning = false;
      }, 7400);

      if (climaxMessage && window.gsap) {
        window.gsap.fromTo(
          climaxMessage,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }
        );
      } else if (climaxMessage) {
        climaxMessage.style.opacity = "1";
        climaxMessage.style.transform = "translateY(0)";
      }
    };

    climaxBtn.addEventListener("click", activate);

    const pointerBurst = (event) => {
      if (sequenceRunning || !climaxActive || !closingStage.classList.contains("active")) {
        return;
      }
      const point = event;
      if (!point) {
        return;
      }
      triggerClimaxBurst(point.clientX, point.clientY);
    };

    closingStage.addEventListener("pointerdown", pointerBurst);
  }

  function initCelebrationEntrance() {
    const stage = document.getElementById("birthdayStage");
    if (!stage || !window.gsap) {
      return;
    }

    const panel = stage.querySelector(".panel");
    if (!panel) {
      return;
    }

    window.gsap.fromTo(panel, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
  }

  document.addEventListener("DOMContentLoaded", () => {
    resumeMusicIfNeeded();
    startMusicTracking();
    animateLandingIn();
    initLandingNavigation();
    initStageButtons();
    initMemoryCanvas();
    initCelebrationEntrance();
    initPointerStarTrail();
    initClimaxExperience();
  });
})();
