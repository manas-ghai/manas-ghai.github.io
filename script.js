const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
if (savedTheme) root.setAttribute("data-theme", savedTheme);

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const themeToggle = document.getElementById("theme-toggle");
themeToggle?.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", current);
  localStorage.setItem("theme", current);
});

document.getElementById("year").textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      if (entry.target.querySelector(".bar-item")) {
        entry.target.querySelectorAll(".bar-item").forEach((item, idx) => {
          setTimeout(() => item.classList.add("animate"), idx * 110);
        });
      }
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

document.querySelectorAll("[data-count]").forEach((el) => {
  const target = Number(el.dataset.count);
  let current = 0;
  const tick = () => {
    current += Math.max(1, Math.ceil(target / 32));
    if (current >= target) current = target;
    el.textContent = current;
    if (current < target) requestAnimationFrame(tick);
  };
  tick();
});

const chips = document.querySelectorAll(".chip");
const cards = document.querySelectorAll(".project-card");
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const filter = chip.dataset.filter;
    cards.forEach((card) => {
      const categories = card.dataset.category || "";
      card.classList.toggle("hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

const stacks = {
  languages: ["C", "C++", "Python", "Go", "Java", "JavaScript", "SQL", "VHDL", "MATLAB", "Kotlin", "Ruby", "Assembly"],
  backend: ["Golang Microservices", "Ruby on Rails", "REST APIs", "FastAPI", "Schedulers", "Worker Queues", "Dead-Letter Queues", "CLI Tools", "PostgreSQL", "SQLite", "Redis", "Firebase", "AWS"],
  systems: ["Operating Systems", "Computer Networks", "Distributed Systems", "Parallel Computing", "OpenMP", "MPI", "CUDA basics", "Fault-Tolerant Systems", "Docker", "Kubernetes", "Linux", "Performance Debugging"],
  ai: ["NumPy", "SciPy", "Pandas", "SymPy", "MATLAB", "Octave", "OpenCV", "TensorFlow", "Keras", "scikit-learn", "CNNs", "GANs", "OCR", "Image Processing", "Computer Vision", "Matplotlib", "Seaborn"],
  security: ["ECC", "SHA-256", "AES", "Falcon", "Zero-Knowledge Proofs", "Post-Quantum Cryptography", "Searchable Encryption", "Qiskit", "Shor's Algorithm", "Grover's Algorithm", "Quantum Circuits", "Lattices", "LLL", "BKZ"],
  tools: ["Git", "GitHub Actions", "Linux", "Ubuntu", "Docker", "AWS", "Firebase", "Xilinx Vivado", "LaTeX", "pytest", "API Docs", "Rubrics", "Technical Writing"]
};
const stackCloud = document.getElementById("stack-cloud");
const renderStack = (key) => {
  stackCloud.innerHTML = "";
  stacks[key].forEach((item, idx) => {
    const span = document.createElement("span");
    span.className = "tech-pill";
    span.textContent = item;
    span.style.animationDelay = `${idx * 35}ms`;
    stackCloud.appendChild(span);
  });
};
renderStack("languages");
document.querySelectorAll(".stack-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".stack-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    renderStack(tab.dataset.stack);
  });
});

const typeLine = document.getElementById("type-line");
const words = [
  "reasoning about worker leases...",
  "profiling backend reliability...",
  "teaching algorithms with examples...",
  "testing cryptographic prototypes...",
  "extracting signal from images...",
  "turning math into systems..."
];
let wordIdx = 0;
let charIdx = 0;
let deleting = false;
function typeLoop() {
  const word = words[wordIdx];
  typeLine.textContent = deleting ? word.slice(0, charIdx--) : word.slice(0, charIdx++);
  if (!deleting && charIdx > word.length + 10) deleting = true;
  if (deleting && charIdx < 0) {
    deleting = false;
    wordIdx = (wordIdx + 1) % words.length;
    charIdx = 0;
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
typeLoop();

const commandModal = document.getElementById("command-modal");
const openCommand = document.getElementById("open-command");
const closeCommand = document.getElementById("close-command");
const commandInput = document.getElementById("command-input");
const commandList = document.getElementById("command-list");
const commands = [
  { key: "github", label: "Open GitHub", hint: "github.com/", action: () => window.open("https://github.com/", "_blank") },
  { key: "work projects", label: "Jump to Work", hint: "Selected builds", action: () => location.hash = "#work" },
  { key: "experience", label: "Jump to Experience", hint: "Industry, teaching, research", action: () => location.hash = "#experience" },
  { key: "map systems", label: "Jump to Engineering Map", hint: "Technical center of gravity", action: () => location.hash = "#systems" },
  { key: "stack tools", label: "Jump to Tech Stack", hint: "Languages and tools", action: () => location.hash = "#stack" },
  { key: "research", label: "Jump to Research", hint: "Cryptography, OCR, GANs", action: () => location.hash = "#research" },
  { key: "email", label: "Email Manas", hint: "mg8527@nyu.edu", action: () => location.href = "mailto:mg8527@nyu.edu" },
  { key: "linkedin", label: "Open LinkedIn", hint: "Professional profile", action: () => window.open("https://linkedin.com/in/manas-ghai-1a9327188", "_blank") },
  { key: "theme", label: "Toggle Theme", hint: "Light / dark", action: () => themeToggle.click() }
];
function renderCommands(filter = "") {
  const clean = filter.toLowerCase();
  commandList.innerHTML = "";
  commands.filter(c => c.key.includes(clean) || c.label.toLowerCase().includes(clean)).forEach((cmd) => {
    const div = document.createElement("div");
    div.className = "command-item";
    div.innerHTML = `<span><b>${cmd.label}</b><br>${cmd.hint}</span><span>↵</span>`;
    div.addEventListener("click", () => { closeCommandMenu(); cmd.action(); });
    commandList.appendChild(div);
  });
}
function openCommandMenu() {
  commandModal.hidden = false;
  renderCommands();
  setTimeout(() => commandInput.focus(), 0);
}
function closeCommandMenu() { commandModal.hidden = true; commandInput.value = ""; }
openCommand?.addEventListener("click", openCommandMenu);
closeCommand?.addEventListener("click", closeCommandMenu);
commandInput?.addEventListener("input", (e) => renderCommands(e.target.value));
window.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openCommandMenu(); }
  if (e.key === "Escape") closeCommandMenu();
});
commandModal?.addEventListener("click", (e) => { if (e.target === commandModal) closeCommandMenu(); });

const canvas = document.getElementById("network-canvas");
const ctx = canvas.getContext("2d");
let points = [];
let mouse = { x: null, y: null };
function resizeCanvas() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  const count = Math.min(95, Math.floor(innerWidth / 18));
  points = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35
  }));
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
function animateNetwork() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  const color = getComputedStyle(root).getPropertyValue("--secondary").trim() || "#06b6d4";
  points.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > innerHeight) p.vy *= -1;
  });
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i], b = points[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 130) {
        ctx.globalAlpha = (1 - d / 130) * 0.22;
        ctx.strokeStyle = color;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    if (mouse.x !== null) {
      const d = Math.hypot(points[i].x - mouse.x, points[i].y - mouse.y);
      if (d < 170) {
        ctx.globalAlpha = (1 - d / 170) * 0.4;
        ctx.strokeStyle = color;
        ctx.beginPath(); ctx.moveTo(points[i].x, points[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    ctx.globalAlpha = 0.65;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(points[i].x, points[i].y, 1.4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateNetwork);
}
animateNetwork();
