/* Site rendering. Content lives in /projects.js — you shouldn't need to edit this file. */
(function () {
  "use strict";
  const S = window.SITE || {};
  const ALL = window.PROJECTS || [];
  const $ = (sel, root = document) => root.querySelector(sel);

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Tiny formatter: blank line = paragraph, "- " = bullet, **bold**, `code`, [text](url)
  function inline(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+|[\w./#?=-]+)\)/g, (m, t, u) => {
        const ext = /^https?:/.test(u);
        return `<a href="${u}"${ext ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`;
      });
  }
  function prose(text) {
    if (!text) return "";
    return String(text).trim().split(/\n\s*\n/).map((chunk) => {
      const lines = chunk.split("\n");
      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
        return "<ul>" + lines.map((l) => "<li>" + inline(l.replace(/^\s*[-*]\s+/, "")) + "</li>").join("") + "</ul>";
      }
      return "<p>" + lines.map(inline).join("<br>") + "</p>";
    }).join("");
  }

  const itemText = (i) => (typeof i === "string" ? i : i.text);
  const itemNote = (i) => (typeof i === "string" ? "" : i.note || "");
  function progressOf(p) {
    const pr = p.progress;
    if (!pr) return null;
    const done = (pr.done || []).length, todo = (pr.todo || []).length, total = done + todo;
    const pct = typeof pr.percent === "number" ? pr.percent : total ? Math.round((done / total) * 100) : 0;
    return { done, todo, total, pct };
  }
  function fmtDate(d) {
    if (!d) return "";
    const dt = new Date(d + "T12:00:00");
    return isNaN(dt) ? d : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  function ytId(u) {
    if (!u) return "";
    if (/^[\w-]{11}$/.test(u)) return u;
    const m = String(u).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : "";
  }
  const isVideo = (m) => m.type === "video" || m.type === "youtube";

  function chrome() {
    const name = esc(S.name);
    const h = $("#site-header"), f = $("#site-footer");
    if (h) h.innerHTML = `
      <a class="brand" href="index.html#top"><span class="dot"></span>${name}</a>
      <nav class="site-nav" aria-label="Main">
        <a href="index.html#about">About</a><a href="index.html#projects">Projects</a><a href="index.html#contact">Contact</a>
      </nav>`;
    if (f) f.innerHTML = `<span>© ${new Date().getFullYear()} ${name}</span><span>Las Vegas, NV</span>`;
  }

  /* ---------------------------------------------------------------- HOME */
  function renderHome() {
    const grid = $("#grid"), count = $("#count");
    const tabs = [...document.querySelectorAll(".tab")];
    const params = new URLSearchParams(location.search);
    let tab = params.get("tab") === "progress" ? "progress" : "finished";

    function draw() {
      const list = ALL.filter((p) => (tab === "progress" ? p.status === "in-progress" : p.status !== "in-progress"));
      count.textContent = String(list.length).padStart(2, "0") + " shown";
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === tab)));
      grid.innerHTML = list.map((p) => {
        const pr = progressOf(p);
        const nMedia = (p.media || []).length;
        const hasVid = (p.media || []).some(isVideo);
        const badge = nMedia > 1 || hasVid ? `<span class="badge">${nMedia} ${nMedia === 1 ? "item" : "items"}${hasVid ? " · video" : ""}</span>` : "";
        return `
        <a class="card" href="project.html?p=${encodeURIComponent(p.slug)}">
          <div class="card-media">
            ${p.cover ? `<img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy" style="object-position:${esc(p.coverPosition || "center")}">` : ""}
            ${badge}
          </div>
          <div class="card-body">
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.summary)}</p>
            ${pr ? `<div class="meter"><div class="meter-top"><span>Progress</span><span>${pr.pct}%</span></div><div class="meter-bar"><span style="width:${pr.pct}%"></span></div></div>` : ""}
            <div class="tags">${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
            <div class="card-foot"><span class="go">Details →</span></div>
          </div>
        </a>`;
      }).join("") || `<p class="count">Nothing here yet.</p>`;
    }
    tabs.forEach((t) => t.addEventListener("click", () => {
      tab = t.dataset.tab;
      const u = new URL(location.href);
      tab === "progress" ? u.searchParams.set("tab", "progress") : u.searchParams.delete("tab");
      history.replaceState(null, "", u);
      draw();
    }));
    draw();

    const gh = "https://github.com/" + S.github, li = "https://linkedin.com/in/" + S.linkedin;
    $("#contact-list").innerHTML = `
      <a href="${gh}" target="_blank" rel="noopener"><span>GitHub</span><span>github.com/${esc(S.github)} ↗</span></a>
      <a href="${li}" target="_blank" rel="noopener"><span>LinkedIn</span><span>linkedin.com/in/${esc(S.linkedin)} ↗</span></a>
      <a href="mailto:${esc(S.email)}"><span>Email</span><span>${esc(S.email)}</span></a>`;
    document.querySelectorAll("[data-name]").forEach((el) => (el.textContent = S.name));
  }

  /* ------------------------------------------------------------- PROJECT */
  function renderProject() {
    const slug = new URLSearchParams(location.search).get("p");
    const idx = ALL.findIndex((p) => p.slug === slug);
    const root = $("#project");
    if (idx < 0) {
      document.title = "Project not found — " + S.name;
      root.innerHTML = `<div class="notfound"><p class="eyebrow">404</p><h1 class="h2">That project doesn't exist.</h1><p><a class="btn btn-ghost" href="index.html#projects">← All projects</a></p></div>`;
      return;
    }
    const p = ALL[idx];
    const inProg = p.status === "in-progress";
    document.title = `${p.title} — ${S.name}`;
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", p.summary || "");

    const back = `index.html${inProg ? "?tab=progress" : ""}#projects`;
    const links = (p.links || []).filter((l) => l && l.url);
    const media = (p.media || []).filter(Boolean);
    const pr = progressOf(p);

    // siblings within same status for prev/next
    const sibs = ALL.filter((x) => (x.status === "in-progress") === inProg);
    const si = sibs.indexOf(p);
    const prev = sibs[(si - 1 + sibs.length) % sibs.length], next = sibs[(si + 1) % sibs.length];

    const list = (title, arr) => arr && arr.length ? `<div class="aside-block"><h2 class="label">${title}</h2><ul>${arr.map((x) => `<li>${inline(x)}</li>`).join("")}</ul></div>` : "";
    const check = (arr, cls) => `<ul class="checklist ${cls}">${arr.map((i) => `<li><span>${inline(itemText(i))}${itemNote(i) ? `<span class="note">${inline(itemNote(i))}</span>` : ""}</span></li>`).join("")}</ul>`;

    const progressHTML = inProg && p.progress ? `
      <section class="progress-card" aria-labelledby="prog-h">
        <div class="progress-top">
          <h2 id="prog-h">Build status</h2>
          <span class="meta">${pr.done}/${pr.total} milestones${p.progress.updated ? " · updated " + esc(fmtDate(p.progress.updated)) : ""}</span>
        </div>
        <div class="meter"><div class="meter-bar"><span style="width:${pr.pct}%"></span></div></div>
        ${p.progress.summary ? `<div class="prose">${prose(p.progress.summary)}</div>` : ""}
        <div class="checklists">
          ${(p.progress.done || []).length ? `<div class="block"><h3 class="label">Completed</h3>${check(p.progress.done, "done")}</div>` : ""}
          ${(p.progress.todo || []).length ? `<div class="block"><h3 class="label">Still to do</h3>${check(p.progress.todo, "todo")}</div>` : ""}
        </div>
      </section>` : "";

    const updates = (p.updates || []).filter(Boolean);
    const updatesHTML = updates.length ? `
      <section class="block" aria-labelledby="log-h">
        <h2 id="log-h">Build log</h2>
        <ol class="log">${updates.map((u, ui) => `
          <li>
            ${u.date ? `<time datetime="${esc(u.date)}">${esc(fmtDate(u.date))}</time>` : ""}
            ${u.title ? `<h3>${inline(u.title)}</h3>` : ""}
            ${u.body ? `<div class="prose">${prose(u.body)}</div>` : ""}
            ${(u.media || []).length ? `<div class="log-media">${u.media.map((m, mi) => thumbHTML(m, `data-log="${ui}" data-i="${mi}"`)).join("")}</div>` : ""}
          </li>`).join("")}
        </ol>
      </section>` : "";

    const sectionsHTML = (p.sections || []).filter((s) => s && (s.heading || s.body)).map((s) => `
      <section class="block">${s.heading ? `<h2>${inline(s.heading)}</h2>` : ""}<div class="prose">${prose(s.body)}</div></section>`).join("");

    root.innerHTML = `
      <a class="back" href="${back}">← All projects</a>
      <header class="proj-head">
        <div class="eyebrow">${inProg ? '<span class="pulse"></span>In progress' : "Finished project"}</div>
        <h1>${esc(p.title)}</h1>
        <p class="lede">${inline(p.summary)}</p>
        ${(p.tags || []).length ? `<div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
        ${links.length ? `<div class="row">${links.map((l, i) => `<a class="btn btn-sm ${i === 0 ? "btn-primary" : "btn-ghost"}" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")}</div>` : ""}
      </header>
      ${media.length ? `
      <section class="gallery" aria-label="Photos and videos">
        <div class="stage" id="stage"></div>
        <p class="caption" id="caption"></p>
        ${media.length > 1 ? `<div class="thumbs" id="thumbs">${media.map((m, i) => thumbHTML(m, `data-i="${i}"`)).join("")}</div>` : ""}
      </section>` : ""}
      <div class="layout">
        <div class="article">${progressHTML}${sectionsHTML}${updatesHTML}</div>
        <aside class="aside">${list("Hardware", p.hardware)}${list("Software &amp; languages", p.software)}</aside>
      </div>
      ${sibs.length > 1 ? `<nav class="pager" aria-label="More projects">
        <a href="project.html?p=${encodeURIComponent(prev.slug)}"><small>← Previous</small><span>${esc(prev.title)}</span></a>
        <a class="next" href="project.html?p=${encodeURIComponent(next.slug)}"><small>Next →</small><span>${esc(next.title)}</span></a>
      </nav>` : ""}`;

    if (media.length) gallery(media);
    // log thumbnails open in lightbox (images) or new tab (videos)
    root.querySelectorAll(".log-media .thumb").forEach((b) => b.addEventListener("click", () => {
      const u = updates[+b.dataset.log], items = u.media;
      const m = items[+b.dataset.i];
      if (m.type === "image") lightbox(items.filter((x) => x.type === "image"), items.filter((x) => x.type === "image").indexOf(m));
      else window.open(m.type === "youtube" ? "https://www.youtube.com/watch?v=" + ytId(m.url || m.id) : m.src, "_blank", "noopener");
    }));
  }

  function thumbHTML(m, attrs) {
    let inner = "";
    if (m.type === "image") inner = `<img src="${esc(m.thumb || m.src)}" alt="" loading="lazy">`;
    else if (m.type === "youtube") inner = `<img src="https://i.ytimg.com/vi/${ytId(m.url || m.id)}/mqdefault.jpg" alt="" loading="lazy"><span class="play">▶</span>`;
    else if (m.type === "video") inner = (m.poster ? `<img src="${esc(m.poster)}" alt="" loading="lazy">` : `<video src="${esc(m.src)}#t=0.1" muted playsinline preload="metadata"></video>`) + `<span class="play">▶</span>`;
    return `<button type="button" class="thumb" ${attrs} aria-label="${esc(m.caption || (isVideo(m) ? "Video" : "Photo"))}">${inner}</button>`;
  }

  function gallery(media) {
    const stage = $("#stage"), cap = $("#caption"), thumbs = [...document.querySelectorAll("#thumbs .thumb")];
    let cur = 0;
    function show(i) {
      cur = (i + media.length) % media.length;
      const m = media[cur];
      let el = "";
      if (m.type === "image") el = `<img src="${esc(m.src)}" alt="${esc(m.caption || "")}">`;
      else if (m.type === "video") el = `<video src="${esc(m.src)}" controls playsinline preload="metadata"${m.poster ? ` poster="${esc(m.poster)}"` : ""}></video>`;
      else if (m.type === "youtube") el = `<iframe src="https://www.youtube-nocookie.com/embed/${ytId(m.url || m.id)}?rel=0" title="${esc(m.caption || "YouTube video")}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
      const nav = media.length > 1 ? `<span class="stage-count">${cur + 1} / ${media.length}</span><button class="stage-nav prev" type="button" aria-label="Previous">‹</button><button class="stage-nav next" type="button" aria-label="Next">›</button>` : "";
      stage.innerHTML = el + nav;
      cap.innerHTML = inline(m.caption || "");
      thumbs.forEach((t, k) => t.setAttribute("aria-current", String(k === cur)));
      const strip = $("#thumbs"), t = thumbs[cur];
      if (strip && t && (t.offsetLeft < strip.scrollLeft || t.offsetLeft + t.offsetWidth > strip.scrollLeft + strip.clientWidth)) strip.scrollTo({ left: t.offsetLeft - 8, behavior: "smooth" });
      const img = stage.querySelector("img");
      if (img) img.addEventListener("click", () => {
        const imgs = media.filter((x) => x.type === "image");
        lightbox(imgs, imgs.indexOf(m), (j) => show(media.indexOf(imgs[j])));
      });
      const pv = stage.querySelector(".prev"), nx = stage.querySelector(".next");
      if (pv) pv.onclick = () => show(cur - 1);
      if (nx) nx.onclick = () => show(cur + 1);
    }
    thumbs.forEach((t) => t.addEventListener("click", () => show(+t.dataset.i)));
    // swipe on touch
    let x0 = null;
    stage.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    stage.addEventListener("touchend", (e) => {
      if (x0 === null || media[cur].type !== "image") return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    });
    document.addEventListener("keydown", (e) => {
      if ($(".lightbox.open") || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
      if (e.key === "ArrowRight") show(cur + 1);
      if (e.key === "ArrowLeft") show(cur - 1);
    });
    show(0);
  }

  function lightbox(imgs, start, onMove) {
    if (!imgs.length) return;
    let lb = $(".lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "lightbox";
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.innerHTML = `<img alt=""><button class="close" type="button" aria-label="Close">×</button><button class="stage-nav prev" type="button" aria-label="Previous">‹</button><button class="stage-nav next" type="button" aria-label="Next">›</button><p class="lb-cap"></p>`;
      document.body.appendChild(lb);
    }
    let i = start < 0 ? 0 : start;
    const img = lb.querySelector("img"), capEl = lb.querySelector(".lb-cap");
    const multi = imgs.length > 1;
    lb.querySelectorAll(".stage-nav").forEach((b) => (b.style.display = multi ? "" : "none"));
    const set = (k) => { i = (k + imgs.length) % imgs.length; img.src = imgs[i].src; img.alt = imgs[i].caption || ""; capEl.innerHTML = inline(imgs[i].caption || ""); onMove && onMove(i); };
    const close = () => { lb.classList.remove("open"); document.removeEventListener("keydown", key); document.body.style.overflow = ""; };
    const key = (e) => { if (e.key === "Escape") close(); if (multi && e.key === "ArrowRight") set(i + 1); if (multi && e.key === "ArrowLeft") set(i - 1); };
    lb.querySelector(".close").onclick = close;
    lb.querySelector(".prev").onclick = (e) => { e.stopPropagation(); set(i - 1); };
    lb.querySelector(".next").onclick = (e) => { e.stopPropagation(); set(i + 1); };
    lb.onclick = (e) => { if (e.target === lb) close(); };
    document.addEventListener("keydown", key);
    set(i);
    document.body.style.overflow = "hidden";
    lb.classList.add("open");
    lb.querySelector(".close").focus();
  }

  window.Site = { renderHome, renderProject };
  chrome();
})();
