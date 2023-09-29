const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// If you have API routes, you can define them before the catch-all route
// For example:
// app.get('/api/some-data', (req, res) => {
//   res.json({ key: 'value' });
// });

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

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
