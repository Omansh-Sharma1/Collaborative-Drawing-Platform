const express = require('express');
const router = express.Router();
const path = require('path');

// Route to serve the login form
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'log-in', 'log-in.html'));
});

// Route to handle login form submission
router.post('/login', (req, res) => {
  const { userName } = req.body;
  console.log(`User logged in with name: ${userName}`);

  //AUTH FEATURES ARE NOT YET INTEGRATED.
  res.redirect('/canvas');
});

// Route to serve the canvas page
router.get('/canvas', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'canvas', 'canvas.html'));
});

module.exports = router;
