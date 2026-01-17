(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  const STORAGE_KEY = "ei_portfolio_theme";

  function updateToggleUi(theme) {
    if (!toggle) return;
    const isLight = theme === "light";
    toggle.textContent = isLight ? "Light" : "Dark";
    toggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    toggle.setAttribute("aria-pressed", String(!isLight));
  }

  function updateThemeColor(theme) {
    if (!themeColor) return;
    themeColor.setAttribute("content", theme === "light" ? "#f4f7fa" : "#080c12");
  }

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      updateToggleUi("light");
      updateThemeColor("light");
      return;
    }
    root.removeAttribute("data-theme");
    updateToggleUi("dark");
    updateThemeColor("dark");
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
  } else {
    applyTheme("dark");
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
  }

  // Micro animation: reveal sections on scroll.
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    const sections = document.querySelectorAll(".section");

    sections.forEach((s) => s.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { root: null, threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    sections.forEach((s) => io.observe(s));
  } else {
    document.querySelectorAll(".section").forEach((s) => s.classList.add("is-visible"));
  }

  // Interactive 3D tilt for cards
  (function initTilt() {
    const cards = document.querySelectorAll(".project, .card, .skillBlock, .timelineItem");
    if (!cards.length) return;

    function onMove(el, ev) {
      const rect = el.getBoundingClientRect();
      const x = (ev.clientX - rect.left) / rect.width;
      const y = (ev.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 12;
      const rotateX = (0.5 - y) * 10;

      el.style.setProperty("--rx", rotateX.toFixed(2) + "deg");
      el.style.setProperty("--ry", rotateY.toFixed(2) + "deg");
    }

    function reset(el) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }

    cards.forEach((el) => {
      el.addEventListener("pointermove", (ev) => onMove(el, ev));
      el.addEventListener("pointerleave", () => reset(el));
      el.addEventListener("pointerdown", () => reset(el));
    });
  })();

  // Full-page animated background with Three.js - calm metallic blue aesthetic
  (function initBackground3D() {
    const canvas = document.getElementById("bgCanvas");
    if (!canvas) return;

    if (reduceMotion) {
      canvas.style.display = "none";
      return;
    }

    const THREE = window.THREE;
    if (!THREE) {
      canvas.style.display = "none";
      return;
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      canvas.style.display = "none";
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new THREE.Scene();
    // Fog for depth and calm atmosphere
    scene.fog = new THREE.Fog(0x080c12, 60, 180);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 300);
    camera.position.set(0, 0, 80);

    // Soft ambient light
    const ambient = new THREE.AmbientLight(0x5b8cb8, 0.2);
    scene.add(ambient);

    // Subtle point lights - positioned far away
    const pointLight = new THREE.PointLight(0x5b8cb8, 0.8, 200);
    pointLight.position.set(40, 50, 60);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x3a6d99, 0.5, 180);
    pointLight2.position.set(-50, -30, 40);
    scene.add(pointLight2);

    // Calm, distant particle field - like distant stars
    const particleCount = 300;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Particles spread far back and to the sides, away from center text area
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 100;
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 120;
      positions[i3 + 2] = -20 - Math.random() * 80; // Push far back

      sizes[i] = Math.random() * 1.2 + 0.3;
      opacities[i] = Math.random() * 0.4 + 0.1;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));

    // Simple, soft particle material
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x7ba3c7) },
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        varying float vOpacity;
        uniform float uTime;
        
        void main() {
          vOpacity = opacity;
          vec3 pos = position;
          
          // Very gentle drift
          pos.x += sin(uTime * 0.05 + position.y * 0.01) * 1.5;
          pos.y += cos(uTime * 0.04 + position.x * 0.01) * 1.0;
          
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPos;
          gl_PointSize = size * (60.0 / -mvPos.z);
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        uniform vec3 uColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
          alpha *= vOpacity;
          
          gl_FragColor = vec4(uColor, alpha * 0.5);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Subtle grid lines in the distance for depth perception
    const gridHelper = new THREE.GridHelper(200, 40, 0x3a6d99, 0x2a5580);
    gridHelper.position.y = -50;
    gridHelper.position.z = -30;
    gridHelper.material.opacity = 0.08;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // A few distant, slowly rotating geometric shapes (very subtle)
    const shapes = [];
    const shapeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x5b8cb8,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.15,
      emissive: 0x3a6d99,
      emissiveIntensity: 0.1,
    });

    // Only 3 shapes, positioned far from the text area
    const shapeConfigs = [
      { geo: new THREE.IcosahedronGeometry(4, 0), pos: [-60, 30, -40] },
      { geo: new THREE.OctahedronGeometry(3, 0), pos: [65, -25, -50] },
      { geo: new THREE.TetrahedronGeometry(3.5, 0), pos: [-50, -40, -35] },
    ];

    shapeConfigs.forEach((config) => {
      const mesh = new THREE.Mesh(config.geo, shapeMaterial.clone());
      mesh.position.set(...config.pos);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      shapes.push({
        mesh,
        rotSpeed: { x: 0.001, y: 0.0015 },
      });
      scene.add(mesh);
    });

    let w = window.innerWidth;
    let h = window.innerHeight;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();

    // Very subtle mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener(
      "pointermove",
      (ev) => {
        targetX = (ev.clientX / w) * 2 - 1;
        targetY = -((ev.clientY / h) * 2 - 1);
      },
      { passive: true }
    );

    let scrollY = 0;
    window.addEventListener(
      "scroll",
      () => {
        scrollY = window.scrollY;
      },
      { passive: true }
    );

    let raf = 0;
    const clock = new THREE.Clock();

    function tick() {
      const t = clock.getElapsedTime();

      // Very slow, smooth mouse follow
      mouseX += (targetX - mouseX) * 0.02;
      mouseY += (targetY - mouseY) * 0.02;

      particleMaterial.uniforms.uTime.value = t;

      // Animate shapes very slowly
      shapes.forEach((s) => {
        s.mesh.rotation.x += s.rotSpeed.x;
        s.mesh.rotation.y += s.rotSpeed.y;
      });

      // Subtle camera movement
      camera.position.x = mouseX * 3;
      camera.position.y = mouseY * 2 - scrollY * 0.005;
      camera.lookAt(0, -scrollY * 0.003, 0);

      // Very slow scene rotation
      scene.rotation.y = t * 0.008 + mouseX * 0.03;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }

    tick();

    window.addEventListener(
      "pagehide",
      () => {
        cancelAnimationFrame(raf);
        particleGeometry.dispose();
        particleMaterial.dispose();
        shapeConfigs.forEach((c) => c.geo.dispose());
        renderer.dispose();
      },
      { once: true }
    );
  })();
})();
