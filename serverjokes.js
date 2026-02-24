const express = require('express');
const cors = require('cors')

const app = express();
const PORT = 3000;
app.use(cors())
app.use(express.json());
/**
 * =====================================================
 * 🗑️ DELETE JOKE BY ID
 * =====================================================
 *
 * DELETE /api/jokes/:id
 *
 * Success Response (200):
 *
 * {
 *   "statusCode": 200,
 *   "message": "Joke deleted successfully",
 *   "deletedJoke": {
 *     "id": 1,
 *     "type": "single",
 *     "joke": "Why do programmers prefer dark mode? Because light attracts bugs!",
 *     "setup": "",
 *     "delivery": ""
 *   }
 * }
 *
 * Error Response (404):
 *
 * {
 *   "statusCode": 404,
 *   "error": "Joke not found"
 * }
 */
app.delete('/api/jokes/:id', (req, res) => {
  const id = Number(req.params.id);
  const jokeIndex = extendedJokes.findIndex(j => j.id === id);

  if (jokeIndex === -1) {
    return res.status(404).json({
      statusCode: 404,
      error: 'Joke not found'
    });
  }

  // Store the joke before removing it
  const deletedJoke = extendedJokes[jokeIndex];
  
  // Remove from both arrays
  extendedJokes.splice(jokeIndex, 1);
  
  // Also remove from the main jokes array if it's one of the original jokes
  const mainJokeIndex = jokes.findIndex(j => j.id === id);
  if (mainJokeIndex !== -1) {
    jokes.splice(mainJokeIndex, 1);
  }

  // Return success response
  res.status(200).json({
    statusCode: 200,
    message: 'Joke deleted successfully',
    deletedJoke: {
      id: deletedJoke.id,
      type: deletedJoke.type,
      setup: deletedJoke.setup || '',
      delivery: deletedJoke.delivery || '',
      joke: deletedJoke.joke || ''
    }
  });
});

/**
 * =====================================================
 * 🎲 REAL RANDOM ERROR MIDDLEWARE
 * =====================================================
 */
const ENABLE_RANDOM_ERRORS = false; // <-- set to false to disable random errors
const ERROR_RATE = 0.3; // 30% failure rate

app.use((req, res, next) => {
  if (!ENABLE_RANDOM_ERRORS) {
    return next(); // skip random errors entirely
  }

  if (Math.random() > ERROR_RATE) {
    return next(); // normal request
  }

  const errors = [
    { status: 400, message: 'Bad Request' },
    { status: 401, message: 'Unauthorized' },
    { status: 403, message: 'Forbidden' },
    { status: 404, message: 'Not Found' },
    { status: 500, message: 'Internal Server Error' },
    { status: 503, message: 'Service Unavailable' },
  ];

  const error = errors[Math.floor(Math.random() * errors.length)];

  res.status(error.status).send({
    statusCode: error.status,
    error: error.message,
  });
});


/**
 * =====================================================
 * 🎭 JOKE DATA
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


const extendedJokes = [];
for (let i = 1; i <= 100; i++) {
  const originalJoke = jokes[(i - 1) % jokes.length];
  extendedJokes.push({
    ...originalJoke,
    id: i,
    page: Math.ceil(i / 10)
  });
}
/**
 * =====================================================
 * 📚 LIST ALL JOKES
 * =====================================================
 *
 * Sample Response:
 *
 * {
 *   "count": 10,
 *   "jokes": [
 *     {
 *       "id": 1,
 *       "type": "single",
 *       "joke": "Why do programmers prefer dark mode? Because light attracts bugs!"
 *     },
 *     {
 *       "id": 2,
 *       "type": "twopart",
 *       "setup": "Why did the developer go broke?",
 *       "delivery": "Because he used up all his cache."
 *     }
 *   ]
 * }
 */
app.get('/api/jokes', (req, res) => {
  res.status(200).json({
    count: jokes.length,
    jokes,
  });
});


/**
 * =====================================================
 * 🎲 RANDOM JOKE
 * =====================================================
 *
 * Sample Response:
 *
 * {
 *   "id": 3,
 *   "type": "single",
 *   "joke": "A SQL query walks into a bar and asks: \"Can I JOIN you?\""
 * }
 *
 * OR
 *
 * {
 *   "id": 2,
 *   "type": "twopart",
 *   "setup": "Why did the developer go broke?",
 *   "delivery": "Because he used up all his cache."
 * }
 */
app.get('/api/jokes/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  res.status(200).json(jokes[randomIndex]);
});

/**
 * =====================================================
 * 🎯 GET JOKE BY ID
 * =====================================================
 *
 * Success Response (200):
 *
 * {
 *   "id": 1,
 *   "type": "single",
 *   "joke": "Why do programmers prefer dark mode? Because light attracts bugs!"
 * }
 *
 * Error Response (404):
 *
 * {
 *   "statusCode": 404,
 *   "error": "Joke not found"
 * }
 */
app.get('/api/jokes/:id', (req, res) => {
  const id = Number(req.params.id);
  const joke = extendedJokes.find(j => j.id === id);

  if (!joke) {
    return res.status(404).send({
      statusCode: 404,
      error: 'Joke not found',
    });
  }

  res.status(200).json(joke);
});

/**
 * =====================================================
 * 📄 PAGINATED JOKES API
 * =====================================================
 *
 * GET /api/jokesPaginated?page=1&limit=10
 *
 * Query Parameters:
 *
 * - page  (number, optional, default: 1)
 * - limit (number, optional, default: 10)
 *
 * Example Request:
 *
 * GET /api/jokesPaginated?page=2&limit=5
 *
 * Success Response (200):
 *
 * {
 *   "page": 2,
 *   "limit": 5,
 *   "totalItems": 100,
 *   "totalPages": 20,
 *   "count": 5,
 *   "jokes": [
 *     {
 *       "id": 6,
 *       "type": "twopart",
 *       "setup": "Why was the JavaScript developer sad?",
 *       "delivery": "Because he didn’t know how to null his feelings."
 *     },
 *     {
 *       "id": 7,
 *       "type": "single",
 *       "joke": "Debugging: Being the detective in a crime movie where you are also the murderer."
 *     }
 *   ]
 * }
 *
 * Error Response (400):
 *
 * {
 *   "statusCode": 400,
 *   "error": "Invalid pagination parameters"
 * }
 */

app.get('/api/jokesPaginated', (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);

  const totalItems = extendedJokes.length;
  const totalPages = Math.ceil(totalItems / limit);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedJokes = extendedJokes.slice(startIndex, endIndex);


  const cleanJokes = paginatedJokes.map(({ _index, ...rest }) => rest);

  res.status(200).json({
    page,
    limit,
    totalItems,
    totalPages,
    count: cleanJokes.length,
    jokes: cleanJokes,
  });
});


/**
 * =====================================================
 * ➕ ADD NEW JOKE
 * =====================================================
 *
 * POST /api/jokes
 *
 * Request Body:
 *
 * {
 *   "type": "single", // or "twopart"
 *   "joke": "Your single joke here", // required for type="single"
 *   "setup": "", // required for type="twopart"
 *   "delivery": "" // required for type="twopart"
 * }
 *
 * Success Response (201):
 *
 * {
 *   "statusCode": 201,
 *   "message": "Joke added successfully",
 *   "joke": {
 *     "id": 101,
 *     "type": "single",
 *     "joke": "Your single joke here",
 *     "setup": "",
 *     "delivery": ""
 *   }
 * }
 *
 * Error Response (400):
 *
 * {
 *   "statusCode": 400,
 *   "error": "Validation failed",
 *   "details": {
 *     "joke": "Joke is required for single type"
 *   }
 * }
 */
app.post('/api/jokes', (req, res) => {
  const { type, joke, setup, delivery } = req.body;
  
  // Validation
  const errors = {};
  
  if (!type || (type !== 'single' && type !== 'twopart')) {
    errors.type = 'Type must be either "single" or "twopart"';
  }
  
  if (type === 'single') {
    if (!joke || joke.trim() === '') {
      errors.joke = 'Joke is required for single type';
    }
  } else if (type === 'twopart') {
    if (!setup || setup.trim() === '') {
      errors.setup = 'Setup is required for two-part joke';
    }
    if (!delivery || delivery.trim() === '') {
      errors.delivery = 'Delivery is required for two-part joke';
    }
  }
  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Validation failed',
      details: errors
    });
  }
  
  // Create new joke
  const newId = extendedJokes.length + 1;
  
  const newJoke = {
    id: newId,
    type,
    joke: type === 'single' ? joke : '',
    setup: type === 'twopart' ? setup : '',
    delivery: type === 'twopart' ? delivery : '',
  };
  
  // Add to both arrays
  extendedJokes.push(newJoke);
  
  // Also add to main jokes array if it's a new original joke
  jokes.push({
    id: newId,
    type,
    joke: type === 'single' ? joke : '',
    setup: type === 'twopart' ? setup : '',
    delivery: type === 'twopart' ? delivery : '',
  });
  
  res.status(201).json({
    statusCode: 201,
    message: 'Joke added successfully',
    joke: newJoke
  });
});

/**
 * =====================================================
 * 🚀 START SERVER
 * =====================================================
 */
app.listen(PORT, () => {
  console.log(`😂 Joke API running at http://localhost:${PORT}`);
});

