const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('<h1>Welcome to the Collaborative Drawing Platform</h1>');
});

module.exports = router;
