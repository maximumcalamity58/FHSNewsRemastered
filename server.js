const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to handle all other requests and return the index.html file
app.get('*', (req, res) => {
  // Only serve index.html if the request path does not contain a file extension
  // This allows other static files to be accessed
  if (path.extname(req.path).length > 0) {
    res.status(404).end();
  } else {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  }
});

const { exec } = require('child_process');

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
