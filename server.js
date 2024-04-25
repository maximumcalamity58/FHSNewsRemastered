const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3005;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Redirection middleware to remove 'www.'
app.use((req, res, next) => {
    if (req.headers.host.slice(0, 4) === 'www.') {
        const newHost = req.headers.host.slice(4);
        return res.redirect(301, `https://${newHost}${req.originalUrl}`);
    }
    next();
});

// Specific route for /calendar
app.get('/calendar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/calendar.html'));
});

// Specific route for /clubs
app.get('/clubs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/clubs.html'));
});

// Specific route for /info
app.get('/info', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/info.html'));
});

// Redirect /kart to an external URL
app.get('/kart', (req, res) => {
    res.redirect('https://mkpc.malahieude.net/mariokart.php');
});

// Catch-all route to handle all other requests and return the index.html file
app.get('*', (req, res) => {
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
