/* =====================================================================
   HOME PAGE SLIDESHOW  —  THIS IS THE ONLY FILE YOU EDIT TO CHANGE IT
   ---------------------------------------------------------------------
   HOW TO ADD A SLIDE
   1. Put your picture inside the folder:  images/Hero/
      (use simple names, no spaces, e.g.  dell-latitude.jpg  /  flyer-wedding-1.jpg)
   2. Copy one of the blocks below, paste it under the last slide
      (keep the comma after each block), and change the words.
   3. Save, refresh the page. The order here = the order in the slideshow.

   HOW TO REMOVE A SLIDE:  delete its whole block { ... },
   HOW TO CHANGE A PICTURE: change the  image:  line to the new file name.

   THE 3 KINDS OF SLIDE
     "gadget"  -> a laptop / phone / smart device. Button goes to the Store page.
     "design"  -> your graphic design work.  Button opens WhatsApp "Request a Design".
     "event"   -> an event or wedding flyer. Button goes to the Events page.

   Do NOT run the code-scrambling (obfuscator) command on this file,
   or you will not be able to read or edit it again.
   ===================================================================== */

// The WhatsApp number used by the "Request a Design" button (no + and no spaces)
window.WHATSAPP_NUMBER = "2349015045558";

window.HERO_SLIDES = [

  /* ---------- SLIDE 1: A GADGET (laptop) ---------- */
  {
    type: "gadget",
    image: "images/Hero/Store.JPG.jpg",   // <- change this line to use a new picture
    title: "HP EliteBook 1040 G8",
    // One line per spec. Write  Label: value  (the label becomes the small grey heading)
    specs: [
      "Processor: Intel Core i7, 11th Gen",
      "Memory: 16GB RAM",
      "Storage: 256GB SSD",
      "Graphics: Intel Iris Xe",
      "Comfort: Backlit keyboard & webcam",
      "Access: Touchscreen & fingerprint"
    ]
  },

  /* ---------- SLIDE 2: AN EVENT FLYER ---------- */
  {
    type: "event",
    image: "images/Hero/events.PNG.png",        // <- put e.g. "images/Hero/flyer-wedding-1.jpg" here
    title: "Plan your wedding or ceremony with us",
    text: "From traditional and white weddings to birthdays and corporate events, book us and we help you plan, decorate and deliver a day to remember."
  },
  /* ---------- SLIDE 3: YOUR GRAPHIC DESIGN WORK ---------- */
 {
    type: "design",
    image: "images/Hero/Graphic.PNG.png",         // <- put e.g. "images/Hero/my-design-1.jpg" here
    title: "Designs that make your brand stand out",
    text: "Logos, flyers, brand kits, social media posts and more, designed in-house by our own team, so you deal with one person from idea to final file."
  }

  // ---------- COPY-AND-PASTE TEMPLATES ----------
  // To use one: copy it, paste it ABOVE the closing  ];  line at the bottom,
  // put a comma after the slide before it, and delete the two slashes // at the start of each line.
  //
  // {
  //   type: "gadget",
  //   image: "images/Hero/store.JPG.jpg",
  //   title: "Name of the laptop",
  //   specs: ["Processor: ...", "Memory: ...", "Storage: ..."]
  // },
  //
  // {
  //   type: "event",
  //   image: "images/Hero/events.PNG.png",
  //   title: "Name of the event",
  //   text: "One or two sentences about the event."
  // },
  // {
  //   type: "design",
  //   image: "images/Hero/Graphic.PNG.png",
  //   title: "Name of the design / what it is",
  //   text: "One or two sentences about this work."
  // }
];