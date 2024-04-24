const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3005;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (req.hostname.startsWith('www.')) {
        return res.redirect(`https://${req.hostname.slice(4)}${req.url}`);
    }
    next();
});


// Specific route for /calendar
app.get('/calendar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/calendar.html'));
});

// Specific route for /calendar
app.get('/clubs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/clubs.html'));
});

// Specific route for /calendar
app.get('/info', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/info.html'));
});

// Redirect /kart to an external URL
app.get('/kart', (req, res) => {
    res.redirect('https://mkpc.malahieude.net/mariokart.php');
});

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
