// ─────────────────────────────────────────────────────────────
//  ✏️  EDIT ME — everything personal lives in this one file.
//  Change the words, add inside jokes, and the site updates itself.
// ─────────────────────────────────────────────────────────────

// ── Google Sheet logging (optional) ───────────────────────────
// Paste the Apps Script web app URL here to record visits, devices and her
// gift picks. Leave it blank and nothing is sent anywhere.
// Setup instructions: apps-script/SETUP.md
export const tracking = {
  endpoint: 'https://script.google.com/macros/s/AKfycbzVJIKjhdfesXOJSajqo03lmcw45re_YpC1WaWfsb7MnctVE73zhU8GrsAoMVXDM8It/exec',
}

export const person = {
  name: 'Manu',
  fullName: 'Manu Muni',
  // Shown on the cake. Set to a number if she'd like to see it 😄
  age: null,
  // Used in the final letter signature
  from: 'Asthe',
  // What she called him back in the hostel days
  oldNickname: 'Basanti',
}

// ── Stage 1: the wrapped gift box on the landing screen ───────
export const gate = {
  eyebrow: 'Delivery for one (1) financial analyst',
  title: `Something arrived for you, ${person.name}`,
  hint: 'tap the box',
  // Nudges that appear if she waits too long before clicking
  nags: [
    'Go on. Tap it. 👀',
    'You analyse portfolios for a living. It is a box.',
    'The box is getting impatient.',
    'This is the most suspense a gift box has ever had.',
    'Fine. I can wait. I have all day.',
  ],
}

// ── Stage 2: the Yes / No question ────────────────────────────
export const question = {
  title: `Ready for your birthday surprise, ${person.name} Muni?`,
  subtitle: 'Choose carefully. One of these buttons is a complete coward.',
  yesLabel: 'YES!! 🎉',
  // The "No" button cycles through these as it runs away
  noLabels: [
    'No',
    'Are you sure?',
    'Really sure??',
    'Think again 🥺',
    'Last chance!',
    'Catch me first',
    'Nope, too slow',
    'You taught me chemistry, not this',
    'Still no? Wow.',
    'Fine. I quit.',
  ],
}

// ── Stage 3: the cake ─────────────────────────────────────────
export const cake = {
  title: 'Make a wish 🕯️',
  subtitle: 'Blow into your mic, or just tap the candles like a normal person.',
  doneTitle: 'Wish locked in. 🤞',
  doneSubtitle: "Don't tell anyone what it was or it won't come true. Not even me.",
}

// ── Stage 4: the quiz (every answer is correct — that's the joke)
export const quiz = {
  title: `How well do you know ${person.fullName}?`,
  subtitle: 'This quiz is rigged entirely in your favour.',
  questions: [
    {
      q: 'Give her a completely free weekend. What actually happens?',
      options: [
        'A book gets finished. Possibly two.',
        'A new food place gets hunted down and reviewed',
        'Coffee. Several. Non-negotiable.',
        'All three, in that order, with commentary',
      ],
      reactions: [
        'Correct. The to-read pile never stood a chance.',
        'Correct — and the place will be obscure and excellent.',
        'Correct. Coffee is a food group.',
        'Correct. This was always the answer.',
      ],
    },
    {
      q: 'Hostel, 2014–15, 11 PM. What is she doing?',
      options: [
        'Explaining chemistry to a very confused 9th standard kid',
        'Making maths sound weirdly easy',
        'Gossiping, obviously',
        'Announcing that Basanti has failed her again',
      ],
      reactions: [
        'Correct. Patiently. Every single night.',
        'Correct. Still unexplained how you did that.',
        'Correct. The real syllabus.',
        'Correct, and deeply deserved. 🫡',
      ],
    },
    {
      q: 'A “quick 10-minute call” with Manu ends after…',
      options: [
        '3 hours',
        '3 hours, but we solved world economics',
        '3 hours of gossip and zero regrets',
        'Wait, it is 2 AM?',
      ],
      reactions: [
        'Correct. Every time. Without fail.',
        'Correct. Markets explained, problems solved.',
        'Correct. The gossip is load-bearing.',
        'Correct. And worth it.',
      ],
    },
    {
      q: 'Her actual superpower is:',
      options: [
        'Knowing something about literally everything',
        'Never making anyone feel small for not knowing it',
        'Being brilliant and completely down to earth at once',
        'Making people believe they can do better',
      ],
      reactions: [
        'Correct. The reading pays off.',
        'Correct. That part is rare, and you do it without trying.',
        'Correct. Genuinely rare combination.',
        'Correct — and that one changed things for me.',
      ],
    },
  ],
  finalNote: `Score: 100%. Somehow you know ${person.fullName} better than anyone. Shocking.`,
}

// ── Stage 5: the gift menu — she picks, he pays ───────────────
export const gifts = [
  {
    emoji: '📚',
    title: 'Buy me a book',
    text: 'Any book. Any genre. Any length. You pick, I pay, no questions asked about the page count.',
  },
  {
    emoji: '☕',
    title: 'Coffee on me',
    text: 'A proper coffee, from a proper place. Not the instant stuff. You deserve better and we both know it.',
  },
  {
    emoji: '🍽️',
    title: 'Feed me for a whole day',
    text: 'Breakfast, lunch, dinner and everything in between. Budget conversations are strictly forbidden.',
  },
  {
    emoji: '👗',
    title: 'Order me clothes',
    text: 'You choose it, I pay for it. You have better taste than me anyway.',
  },
  {
    emoji: '🍜',
    title: 'A food crawl',
    text: 'One day, one city, as many famous food places as we can physically survive. Your itinerary.',
  },
  {
    emoji: '🎁',
    title: 'Surprise me',
    text: 'Whatever you can bring on. Name it and it is yours. This is a genuinely dangerous option.',
  },
]

export const giftPicker = {
  title: 'Pick your gift 🎀',
  subtitle: 'Pick one. Or don\'t — I already know you won\'t stop at one.',
  // Escalating panic as she selects more. Index = number selected.
  reactions: [
    '',
    'Done. Consider it bought.',
    'Two? … Okay. For you, fine.',
    'Three. My wallet has entered its villain era.',
    `Four?! ${person.oldNickname} is being openly exploited.`,
    'Five. I am writing all of this down, for the record.',
    'All six. Absolutely shameless. I respect it enormously. 🫡',
  ],
  confirm: 'Send it over and it is legally binding. No takebacks.',
  emptyNote: 'Nothing selected yet. Bold strategy.',
  sendLabel: `Send my list to ${person.from} 📩`,
  sentTitle: 'Sent! 📬',
  sentNote: `${person.from} has received the bill and is currently lying down.`,
}

// ── Stage 6: the compliment wheel ─────────────────────────────
export const wheel = {
  title: 'Spin the Compliment Wheel 🎡',
  subtitle: 'Warning: contains unsolicited sincerity.',
  compliments: [
    'You read about everything, and then explain it like it was obvious. It was not obvious.',
    'You are brilliant at your work and somehow have zero ego about it.',
    'You have never once made me feel stupid for asking a basic question.',
    'You found the good food places before it was a personality trait.',
    'Three-hour calls with you never feel like three hours.',
    'You are the most down-to-earth smart person I know.',
    'You have been quietly pushing me to be better since I was in 9th standard.',
    'Elder sister energy, best friend delivery. Unbeatable combination.',
    'You remember the small things about people. That is genuinely rare.',
    'You made one year in a hostel worth ten years of friendship.',
  ],
}

// ── Stage 7: the final letter (typed out line by line) ────────
export const letter = {
  title: `Happy Birthday, ${person.fullName} 💐`,
  lines: [
    `2014. A hostel. Me in 9th standard, completely lost. You three years ahead, in the bed right next to mine, somehow patient enough to explain chemistry to me at 11 PM when you absolutely did not have to.`,
    `You called me ${person.oldNickname}. I called you Nidhi didi, because that felt like the respectful thing to do. Somewhere along the way you became Manu Muni, and it stuck forever.`,
    `That was one year. One. And we have not stopped talking since — the three-hour calls, the gossip, the knowledge exchange, the laughing at things nobody else would find funny.`,
    `You read everything and you know something about everything, and you have never once used that to make me feel small. You just explain it. Same as you did with those chemistry chapters.`,
    `Every time we talk I come away wanting to do better. You have been doing that to me for ten years without even trying.`,
    `So go finish the book. Order the coffee. Find that ridiculous food place nobody has heard of yet. You have earned every bit of it.`,
  ],
  signoff: `— ${person.oldNickname}, a.k.a. ${person.from} ❤️`,
  replayLabel: 'Do it all again 🔁',
  // Tiny easter egg button at the very bottom
  easterEggLabel: 'Do NOT press this',
  easterEggReply: `🫡 ${person.oldNickname} reporting for duty. Still bad at chemistry. Still your problem.`,
}
