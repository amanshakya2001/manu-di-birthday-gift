# 🎂 Happy Birthday, Manu!

A small interactive birthday site built with React + Vite. No backend, no images,
no audio files — every animation is CSS, the confetti is canvas, and the birthday
song is synthesised live with the Web Audio API.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build & share it

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

`dist/` is a fully static folder. Drag it onto **Netlify Drop**, push it to
**GitHub Pages**, or deploy with **Vercel** — it needs no server. (The build uses a
relative base path, so it works from any subfolder too.)

## Make it yours

**Everything personal lives in [`src/config.js`](src/config.js)** — the messages, the
quiz questions, the coupons, the compliments, the final letter. Edit that one file
and the whole site updates. Nothing else needs touching.

A few things worth customising:

| In `config.js` | What it controls |
| --- | --- |
| `person.age` | Set a number to show it on the cake (`null` hides it) |
| `person.from` | The signature on the final letter |
| `quiz.questions` | Swap in real inside jokes — every answer is "correct" by design |
| `gifts` | The three coupons. Make these real promises you'll actually keep 😄 |
| `wheel.compliments` | The compliment wheel. Add as many as you like — segments adjust |
| `letter.lines` | The typed-out letter. This is the one people actually remember |

## The journey

1. **Gift gate** — a wrapped box that gets impatient if she hesitates
2. **The question** — "Are you ready?" The *No* button dodges the cursor, renames
   itself each time, shrinks, and eventually quits. It can never be clicked.
3. **Cake** — blow out the candles with your real microphone, or just tap them
4. **Quiz** — four questions, every answer correct, guaranteed 100%
5. **Gift picker** — choose 1 of 3 boxes, get a redeemable coupon
6. **Compliment wheel** — spin for unsolicited sincerity
7. **The letter** — typewriter message, then a confetti storm

## Notes

- **Microphone** is optional and only requested when she taps "Blow with my mic."
  If she declines, tapping the candles works identically.
- **Sound** starts muted until a click, because browsers block autoplay. The 🎵
  button plays *Happy Birthday* on a loop; 🔊 mutes everything.
- **Reduced motion** is respected — confetti and balloons switch off for anyone
  with that OS preference enabled.
- Fully responsive down to ~360px wide.

## Project layout

```
src/
  config.js            ← edit this one
  App.jsx              ← stage order
  lib/confetti.js      ← canvas particle engine
  lib/sound.js         ← Web Audio SFX + "Happy Birthday"
  hooks/               ← microphone blow detection
  stages/              ← one file per screen
  styles/              ← tokens + CSS art (the cake and box are pure CSS)
```
