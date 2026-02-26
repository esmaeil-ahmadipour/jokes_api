// jokes.js
/**
 * =====================================================
 * 🎭 LIST OF JOKES
 * =====================================================
 */
const jokes = [
  { id: 1, type: 'single', joke: 'Why do programmers prefer dark mode? Because light attracts bugs!' },
  { id: 2, type: 'twopart', setup: 'Why did the developer go broke?', delivery: 'Because he used up all his cache.' },
  { id: 3, type: 'single', joke: 'A SQL query walks into a bar and asks: "Can I JOIN you?"' },
  { id: 4, type: 'twopart', setup: 'Why do Java developers wear glasses?', delivery: 'Because they don’t C#.' },
  { id: 5, type: 'single', joke: 'There are 10 kinds of people: those who understand binary and those who don’t.' },
  { id: 6, type: 'twopart', setup: 'Why was the JavaScript developer sad?', delivery: 'Because he didn’t know how to null his feelings.' },
  { id: 7, type: 'single', joke: 'Debugging: Being the detective in a crime movie where you are also the murderer.' },
  { id: 8, type: 'twopart', setup: 'Why did the function return early?', delivery: 'Because it had a timeout.' },
  { id: 9, type: 'single', joke: 'Programmers don’t panic — they debug.' },
  { id: 10, type: 'twopart', setup: 'Why did the programmer quit his job?', delivery: 'Because he didn’t get arrays.' },
];

// Extended version for pagination / random
const extendedJokes = [];
for (let i = 1; i <= 100; i++) {
  const originalJoke = jokes[(i - 1) % jokes.length];
  extendedJokes.push({
    ...originalJoke,
    id: i,
    page: Math.ceil(i / 10)
  });
}

module.exports = { jokes, extendedJokes };
