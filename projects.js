/* ==========================================================================
   PROJECT CONTENT — this is the only file you need to edit to update the site.
   See README.md for a full guide. Quick reference for one project:

   {
     slug: "my-project",              // URL id: project.html?p=my-project. Media folder: media/my-project/
     title: "My Project",
     status: "finished",              // "finished" or "in-progress"
     summary: "One or two sentences shown on the card and at the top of the page.",
     tags: ["ESP32", "C++"],
     cover: "media/my-project/cover.webp",
     coverPosition: "center 30%",     // optional: which part of the cover shows when cropped on the card
     links: [                         // optional buttons on the details page
       { label: "GitHub", url: "https://github.com/..." },
       { label: "3D files", url: "https://..." },
     ],
     media: [                         // gallery, shown in this order. Mix and match:
       { type: "image",   src: "media/my-project/front.jpg", caption: "Front view" },
       { type: "video",   src: "media/my-project/demo.mp4",  caption: "Short clip", poster: "media/my-project/demo.jpg" },
       { type: "youtube", url: "https://youtu.be/VIDEO_ID",  caption: "Full walkthrough" },
     ],
     hardware: ["..."],
     software: ["..."],

     // In-progress projects only (all optional):
     progress: {
       updated: "2026-11-16",
       done: ["Thing that is finished", "Another thing"],
       todo: ["Thing left to do"],
     },
     updates: [                       // build log, newest first
       { date: "2026-11-10", title: "PCBs arrived", body: "Text…", media: [ ...same format as above... ] },
     ],

     // Write-up. Add, remove, rename or reorder sections freely.
     // Blank line = new paragraph. "- " at line start = bullet. **bold**, `code`, [text](https://link).
     sections: [
       { heading: "Inspiration", body: "..." },
     ],
   }
   ========================================================================== */

window.SITE = {
  name: "William Sullivan",
  github: "willsulli2004",
  linkedin: "william-sullivan-963388274",
  email: "sulliw2@unlv.nevada.edu",
};

window.PROJECTS = [
  /* ------------------------------------------------------------------ */
  /*  IN PROGRESS                                                        */
  /* ------------------------------------------------------------------ */
  {
    slug: "split-flap",
    title: "Split Flap Display",
    status: "in-progress",
    summary: "A split flap display built from scratch. 3D-modeled enclosure and custom PCBs to control all 45 motors from a single microcontroller.",
    tags: ["PCB Design", "3D Printing", "Stepper Motors", "Embedded"],
    cover: "media/split-flap/cover.webp",
    links: [{ label: "GitHub", url: "https://github.com/willsulli2004" }],
    media: [
      { type: "image", src: "media/split-flap/cover.webp", caption: "Display build" },
    ],
    hardware: ["45 stepper motors", "Custom PCBs", "3D-printed enclosure and flaps", "Microcontroller (TBD)"],
    software: ["TBD"],
    // EDIT ME: these checklist items are placeholders — replace with where the build actually stands.
    progress: {
      updated: "2026-11-16",
      done: [
        "Enclosure and flap mechanism modeled in CAD",
        "Custom driver PCB designed",
      ],
      todo: [
        "Choose the microcontroller",
        "Assemble and test all 45 modules",
        "Firmware for homing and character lookup",
        "Final enclosure print and wiring",
      ],
    },
    updates: [],
    sections: [
      { heading: "Inspiration", body: "Write-up coming soon." },
      { heading: "Challenges so far", body: "Write-up coming soon." },
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  FINISHED                                                           */
  /* ------------------------------------------------------------------ */
  {
    slug: "march-madness",
    title: "March Madness Machine Learning Model",
    status: "finished",
    summary: "XGBoost, logistic regression, neural network, and random forest models predicting NCAA Men's basketball matchups and outputting a full bracket. 74.6% of games correct in 2026, 77.7% in 2025, with both champions predicted correctly.",
    tags: ["Python", "XGBoost", "scikit-learn", "Neural Networks"],
    cover: "media/march-madness/cover.webp",
    links: [{ label: "GitHub", url: "https://github.com/willsulli2004/March-Madness-ML" }],
    media: [
      { type: "image", src: "media/march-madness/cover.webp", caption: "Predicted bracket" },
    ],
    hardware: ["Personal computer (CPU training)"],
    software: ["Python", "XGBoost", "scikit-learn", "Neural network / random forest / logistic regression models"],
    sections: [
      { heading: "Inspiration", body: "Every year me and my family compete in a pool against each other to see who has the best bracket. For the 2026 tournament I decided to step up my game by using my fairly new knowledge in machine learning to make my bracket." },
      { heading: "What I learned", body: "This project taught me a lot about machine learning and the data collection process. I learned a lot of the more intricate parts of data collection using pandas, specifically building a pipeline that normalizes names and stats across different data sources. I learned about where each type of model shines and how to combine their outputs for the most accurate predictions." },
      { heading: "What I'd do differently", body: "If I could do this project again I would want to get more into the data myself. While some of the stats I used were familiar to me, some of the more unique and more analytical stats were beyond my understanding of basketball. Spending more time understanding advanced basketball stats could have had lots of benefits to my model and could've led me to collecting/calculating some more advanced stats in my data collection pipeline." },
    ],
  },
  {
    slug: "christmas-tree",
    title: "WS2811 LED Christmas Tree",
    status: "finished",
    summary: "WS2811 LED bulbs driven by a Raspberry Pi with custom scenes for a Christmas tree. Each bulb is mapped to an (x, y) coordinate, enabling sweeps top to bottom, side to side, and rotations around a central point.",
    tags: ["Raspberry Pi", "Python", "WS2811"],
    cover: "media/christmas-tree/cover.webp",
    coverPosition: "center 35%",
    links: [{ label: "GitHub", url: "https://github.com/willsulli2004/WS2811-LED-Christmas-Tree" }],
    media: [
      { type: "image", src: "media/christmas-tree/cover.webp", caption: "Tree mid-scene" },
    ],
    hardware: ["Raspberry Pi", "WS2811 LED bulb strings"],
    software: ["Python", "Homebridge"],
    sections: [
      { heading: "Inspiration", body: "My inspiration for this project came from watching a YouTube video where someone made their own Christmas decorations. It inspired me to do something similar with my Christmas tree." },
      { heading: "What I learned", body: "This project taught me the correlation between basic 2 dimensional math and lighting scenes that come standard in many basic smart home lighting products. I also learned how to add my own products into my smart home and how to quickly deploy new scenes and controls for them." },
      { heading: "What I'd do differently", body: "If I could do this again I would try and incorporate a z dimension for even more robust scenes. I could do this by turning the tree as a map the lights, and/or by creating a function that maps the light level from each bulb into a z coordinate. The brighter the bulb the closer to the front of the tree it is." },
    ],
  },
  {
    slug: "fpga-blackjack",
    title: "FPGA Blackjack",
    status: "finished",
    summary: "A complete hardware implementation of a 2-deck Blackjack game written in VHDL for the Altera/Intel DE2-115 FPGA Development Board.",
    tags: ["VHDL", "FPGA", "DE2-115", "Quartus"],
    cover: "media/fpga-blackjack/cover.webp",
    coverPosition: "center 35%",
    links: [{ label: "GitHub", url: "https://github.com/willsulli2004/FPGA-BlackJack" }],
    media: [
      { type: "image", src: "media/fpga-blackjack/cover.webp", caption: "DE2-115 board running the game" },
    ],
    hardware: ["Altera/Intel DE2-115 FPGA board", "On-board switches, buttons, 7-segment displays and LEDs"],
    software: ["VHDL", "Intel Quartus Prime"],
    sections: [
      { heading: "Inspiration", body: "This was one of my final projects for an FPGA class. My inspiration came from being born and raised in Vegas and my enjoyment of playing blackjack." },
      { heading: "What I learned", body: "This taught me just how complex games can be to translate into software. There are many rules that complicate the logic, such as aces being treated as 1 or 11 and dealers hitting on soft 17s." },
      { heading: "What I'd do differently", body: "If I could do this again, the only difference I can think of would be to add more features. Since the board belonged to the school, I had to give it back afterward and did not get to add double down, insurance, or splitting." },
    ],
  },
  {
    slug: "card-shuffler",
    title: "Automatic Card Shuffler and Dealer",
    status: "finished",
    summary: "Fully self-designed and 3D-printed mechanism that riffle shuffles a deck of cards and deals them one by one, controlled by an ESP32 microcontroller.",
    tags: ["ESP32", "C++", "3D Printing", "CAD"],
    cover: "media/card-shuffler/cover.webp",
    coverPosition: "center 35%",
    links: [],
    media: [
      { type: "image", src: "media/card-shuffler/cover.webp", caption: "Shuffler mid-deal" },
    ],
    hardware: ["ESP32", "Stepper/DC motors and drivers", "Buck converter", "LCD screen", "3D-printed shuffler and dealer mechanism"],
    software: ["C++ (Arduino framework)", "Fusion 360"],
    sections: [
      { heading: "Inspiration", body: "For this project I wanted to recreate the auto shufflers and dealers I had seen online. I wanted to see what all went into the mechanics of shuffling and dealing cards." },
      { heading: "What I learned", body: "This was my most mechanically intensive project so far. I learned a lot about 3D modeling and rebuilt my design from the ground up several times after discovering fundamental issues with previous prototypes. I learned the importance of modular designs and how much they helped with making changes and printing reliable parts." },
      { heading: "What I'd do differently", body: "If I could do this again, I would do it completely differently and adopt a whole different shuffling mechanism. Modern auto shufflers do not riffle shuffle like this; instead they use software to generate a shuffled order and hardware to physically arrange the cards into it. This would make the design even more mechanically challenging, but it would look and function a lot better than what I made." },
    ],
  },
];
