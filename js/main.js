/**
 * main.js — loads data.json and hydrates all personal content.
 *           Also handles: nav scroll state, mobile menu,
 *           typewriter, scroll reveal, contact form → Discord.
 *
 * The only file you should ever need to edit is data.json.
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ═══════════════════════════════════════════════
     DATA.JSON — load & hydrate everything personal
  ═══════════════════════════════════════════════ */

  // Kick off the fetch immediately — everything else initialises in parallel
  let typewriterRoles = []; // filled once data arrives

  async function loadData() {
    try {
      const res = await fetch("data.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      hydrateAll(data);
    } catch (err) {
      console.warn("Could not load data.json:", err.message);
    }
  }

  /* Safely escape HTML */
  function esc(val) {
    return String(val ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* Set text content of an element by id, silently skip if missing */
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "";
  }

  /* Set innerHTML of an element by id */
  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  /* ── Master hydration function ── */
  function hydrateAll(data) {
    hydrateMeta(data.meta);
    hydrateHero(data.hero);
    hydrateAbout(data.about);
    hydrateContact(data.contact);
  }

  /* ── meta: title, nav logo, footer ── */
  function hydrateMeta(meta) {
    if (!meta) return;

    if (meta.site_title) document.title = meta.site_title;

    // Nav logo: strip leading ~/ if present so tilde span handles it
    if (meta.nav_logo) {
      const slug = meta.nav_logo.replace(/^~\//, "");
      setText("navLogoText", `/${slug}`);
    }

    setText("footerName",    meta.footer_name);
    setText("footerLogo",    meta.nav_logo ?? "");

    // Footer tagline — preserve the ♥ heart as actual HTML
    if (meta.footer_tagline) {
      const el = document.getElementById("footerTagline");
      if (el) {
        // Allow the literal ♥ character through — safe, not user-controlled
        el.innerHTML = esc(meta.footer_tagline)
          .replace("♥", `<span class="footer-heart">♥</span>`);
      }
    }
  }

  /* ── hero: name, bio, CTA buttons ── */
  function hydrateHero(hero) {
    if (!hero) return;

    setText("heroName", hero.name);
    setText("heroBio",  hero.tagline);

    // CTA buttons
    const actionsEl = document.getElementById("heroActions");
    if (actionsEl) {
      const primary   = hero.cta_primary;
      const secondary = hero.cta_secondary;
      actionsEl.innerHTML = `
        ${primary   ? `<a href="${esc(primary.href)}" class="btn-terminal btn-primary"><span class="btn-bracket">[</span>${esc(primary.label)}<span class="btn-bracket">]</span></a>` : ""}
        ${secondary ? `<a href="${esc(secondary.href)}" class="btn-terminal btn-ghost"><span class="btn-bracket">[</span>${esc(secondary.label)}<span class="btn-bracket">]</span></a>` : ""}`;
    }

    // Hand roles off to the typewriter (start it now that we have the data)
    if (Array.isArray(hero.typewriter_roles) && hero.typewriter_roles.length) {
      typewriterRoles = hero.typewriter_roles;
      startTypewriter(typewriterRoles);
    }
  }

  /* ── about: profile terminal, bio prose, skills ── */
  function hydrateAbout(about) {
    if (!about) return;
    const { profile, bio, skills } = about;

    // profile.json terminal window
    const profileEl = document.getElementById("profileJson");
    if (profileEl && profile) {
      const p          = profile;
      const focusItems = (p.focus || []).map(f =>
        `    <span class="tc-str">"${esc(f)}"</span>`).join(",\n");
      const langItems  = (p.stack?.languages || []).map(l =>
        `<span class="tc-str">"${esc(l)}"</span>`).join(", ");
      const feItems    = (p.stack?.frontend  || []).map(l =>
        `<span class="tc-str">"${esc(l)}"</span>`).join(", ");
      const beItems    = (p.stack?.backend   || []).map(l =>
        `<span class="tc-str">"${esc(l)}"</span>`).join(", ");

      profileEl.innerHTML =
`<span class="tc-brace">{</span>
  <span class="tc-key">"name"</span>:       <span class="tc-str">"${esc(p.name)}"</span>,
  <span class="tc-key">"role"</span>:       <span class="tc-str">"${esc(p.role)}"</span>,
  <span class="tc-key">"location"</span>:   <span class="tc-str">"${esc(p.location)}"</span>,
  <span class="tc-key">"university"</span>: <span class="tc-str">"${esc(p.university)}"</span>,
  <span class="tc-key">"focus"</span>: <span class="tc-brace">[</span>
${focusItems}
  <span class="tc-brace">]</span>,
  <span class="tc-key">"stack"</span>: <span class="tc-brace">{</span>
    <span class="tc-key">"languages"</span>: <span class="tc-brace">[</span>${langItems}<span class="tc-brace">]</span>,
    <span class="tc-key">"frontend"</span>:  <span class="tc-brace">[</span>${feItems}<span class="tc-brace">]</span>,
    <span class="tc-key">"backend"</span>:   <span class="tc-brace">[</span>${beItems}<span class="tc-brace">]</span>
  <span class="tc-brace">}</span>,
  <span class="tc-key">"status"</span>:     <span class="tc-str">"${esc(p.status)}"</span>,
  <span class="tc-key">"coffee"</span>:     <span class="tc-num">${esc(p.coffee)}</span>
<span class="tc-brace">}</span>`;
    }

    // Heading
    if (bio) {
      setHTML("aboutHeading",
        `${esc(bio.heading_line1)}<br><em>${esc(bio.heading_line2)}</em>`);
    }

    // Paragraphs
    if (bio?.paragraphs) {
      setHTML("aboutParagraphs",
        bio.paragraphs.map(p => `<p>${esc(p)}</p>`).join(""));
    }

    // Skills
    if (skills?.current) {
      setHTML("skillsCurrent",
        skills.current.map(s => `<span class="skill-tag">${esc(s)}</span>`).join(""));
    }
    if (skills?.learning) {
      setHTML("skillsLearning",
        skills.learning.map(s => `<span class="skill-tag skill-tag-dim">${esc(s)}</span>`).join(""));
    }
  }

  /* ── contact: heading, subtext, links, location ── */
  function hydrateContact(contact) {
    if (!contact) return;

    // Heading
    setHTML("contactHeading",
      `${esc(contact.heading_line1)}<br><em>${esc(contact.heading_line2)}</em>`);

    setText("contactSub", contact.subtext);

    // Links
    if (Array.isArray(contact.links)) {
      setHTML("contactLinks",
        contact.links.map(link => `
          <a href="${esc(link.href)}" class="contact-link"
             ${link.href.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}>
            <i class="${esc(link.icon)}"></i>
            <span>${esc(link.label)}</span>
          </a>`).join(""));
    }

    // Location
    if (contact.location) {
      setHTML("contactLocation",
        `<i class="fas fa-map-marker-alt"></i><span>${esc(contact.location)}</span>`);
    }

    // Stash email for Discord footer text
    if (contact.email) window._contactEmail = contact.email;
  }

  loadData();


  /* ═══════════════════════════════════════════════
     FOOTER YEAR
  ═══════════════════════════════════════════════ */
  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ═══════════════════════════════════════════════
     NAVBAR — scroll state + active section
  ═══════════════════════════════════════════════ */
  const navbar   = document.getElementById("navbar");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateNav() {
    const scrollY = window.scrollY;
    navbar?.classList.toggle("scrolled", scrollY > 40);

    let current = "";
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 80) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle("active",
        link.getAttribute("href")?.replace("#", "") === current);
    });
  }

  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();


  /* ═══════════════════════════════════════════════
     MOBILE HAMBURGER
  ═══════════════════════════════════════════════ */
  const hamburger  = document.getElementById("navHamburger");
  const navLinksEl = document.getElementById("navLinks");

  hamburger?.addEventListener("click", () => navLinksEl?.classList.toggle("open"));

  navLinksEl?.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", () => navLinksEl.classList.remove("open")));


  /* ═══════════════════════════════════════════════
     TYPEWRITER — started by hydrateHero once data arrives
  ═══════════════════════════════════════════════ */
  function startTypewriter(roles) {
    const roleEl = document.getElementById("heroRole");
    if (!roleEl || !roles.length) return;

    let roleIdx  = 0;
    let charIdx  = 0;
    let deleting = false;
    let paused   = false;

    function step() {
      if (paused) return;
      const current = roles[roleIdx];

      if (!deleting) {
        roleEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
          paused = true;
          setTimeout(() => { paused = false; deleting = true; step(); }, 2000);
          return;
        }
      } else {
        roleEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx  = (roleIdx + 1) % roles.length;
        }
      }

      setTimeout(step, deleting ? 45 : 80);
    }

    setTimeout(step, 800);
  }


  /* ═══════════════════════════════════════════════
     SCROLL REVEAL
  ═══════════════════════════════════════════════ */
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));


  /* ═══════════════════════════════════════════════
     CONTACT FORM — Discord webhook
  ═══════════════════════════════════════════════ */
  const contactSubmit = document.getElementById("contactSubmit");
  const formOutput    = document.getElementById("formOutput");

  function addOutputLine(text, isError = false) {
    if (!formOutput) return;
    const line = document.createElement("div");
    line.className = "form-output-line" + (isError ? " form-output-error" : "");
    line.textContent = text;
    formOutput.appendChild(line);
  }

  async function sendToDiscord(name, email, message) {
  const workerUrl = CONFIG.discord_webhook;
  if (!workerUrl) return { simulated: true };

  const res = await fetch(workerUrl, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ name, email, message })
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || `Worker responded with ${res.status}`);
  }
  return { simulated: false };
}

contactSubmit?.addEventListener("click", async () => {
  const name    = document.getElementById("contactName")?.value.trim();
  const email   = document.getElementById("contactEmail")?.value.trim();
  const message = document.getElementById("contactMessage")?.value.trim();

  formOutput.innerHTML = "";

  if (!name)                                                { addOutputLine("✗ error: name is required",        true); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { addOutputLine("✗ error: valid email is required", true); return; }
  if (!message)                                             { addOutputLine("✗ error: message cannot be empty", true); return; }

  contactSubmit.disabled = true;
  addOutputLine("> sending...");

  try {
    const result = await sendToDiscord(name, email, message);

    if (result.simulated) {
      console.warn("[Contact] No discord_webhook configured in config.js — message not delivered.");
    }

    addOutputLine("✓ message sent!");

    document.getElementById("contactName").value    = "";
    document.getElementById("contactEmail").value   = "";
    document.getElementById("contactMessage").value = "";

  } catch (err) {
    console.error("[Contact] Delivery failed:", err.message);
    addOutputLine("✗ error: failed to send, please try again", true);
  } finally {
    contactSubmit.disabled = false;
  }
});

  // Ctrl+Enter to submit
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") contactSubmit?.click();
  });

});