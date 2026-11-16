# Portfolio site

Plain static site (HTML/CSS/JS, no build step) served by GitHub Pages from `main` / root.

- `index.html` – home page (about, project cards, contact)
- `project.html?p=<slug>` – details page for one project (shareable link)
- `projects.js` – **all the content. This is the file you edit.**
- `media/<slug>/` – photos and videos for each project
- `assets/` – styles and rendering code (no need to touch)

## Add or update a project

1. Make a folder `media/<slug>/` and drop your photos/videos in it.
2. In `projects.js`, add/edit the project object (the comment at the top shows every field).
3. Commit and push. The site updates in about a minute.

### Gallery items (`media: [...]`)

```js
{ type: "image",   src: "media/split-flap/pcb.jpg", caption: "Driver board, rev 2" },
{ type: "video",   src: "media/split-flap/flip.mp4", caption: "First flip test", poster: "media/split-flap/flip.jpg" },
{ type: "youtube", url: "https://youtu.be/XXXXXXXXXXX", caption: "Full walkthrough" },
```

The first item shows first. `poster` is optional (a still shown before the video plays).

### In-progress projects

```js
status: "in-progress",
progress: {
  updated: "2026-11-16",
  summary: "Optional short paragraph about where things stand.",
  done: ["Enclosure modeled", { text: "PCB rev 1 ordered", note: "JLCPCB, 5 boards" }],
  todo: ["Firmware", "Final assembly"],
},
updates: [ // optional build log, newest first
  { date: "2026-11-10", title: "PCBs arrived", body: "Notes…", media: [ /* same format as gallery */ ] },
],
```

The progress bar is `done / (done + todo)`; set `progress.percent: 60` to override it.
When a project is finished, change `status` to `"finished"` and it moves to the Finished tab.

### Writing

`sections` is a list of `{ heading, body }` you can add to, rename or reorder.
In any body text: blank line = new paragraph, `- ` at the start of lines = bullet list,
`**bold**`, `` `code` ``, `[link text](https://...)`.

## Media tips

- **Photos:** resize to ~1600px on the long side and save as `.webp` or `.jpg` (aim for under 500 KB each).
- **Short clips (< ~30 s):** `.mp4` (H.264) in the repo. Shrink with
  `ffmpeg -i in.mov -vf "scale=-2:720" -c:v libx264 -crf 28 -preset slow -an out.mp4`
  (drop `-an` to keep audio). GitHub rejects files over 100 MB; keep clips under ~10 MB.
- **Longer videos:** upload to YouTube (Unlisted is fine) and use `type: "youtube"`.
- Check backgrounds for anything personal (addresses, ID numbers, other people) before posting.

## Preview locally

```
python3 -m http.server
```
then open http://localhost:8000.
