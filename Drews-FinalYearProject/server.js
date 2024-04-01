// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require('./routes/taskRoutes'); // Added task routes
const gamificationRoutes = require('./routes/gamificationRoutes'); // Import gamification routes
const profileRoutes = require('./routes/profileRoutes'); // Import profile routes
const http = require('http');
const WebSocket = require('ws');
const { parse } = require('cookie');
const { URL } = require('url');
const { isAuthenticated } = require('./routes/middleware/authMiddleware'); // Import isAuthenticated middleware

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

// Session configuration with connect-mongo
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
});

app.use(sessionMiddleware);

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Authentication Routes
app.use(authRoutes);

// Task Management Routes
app.use(taskRoutes); // Registering task routes

// Gamification Routes
app.use(gamificationRoutes); // Registering gamification routes

// Profile Routes
app.use(profileRoutes); // Registering profile routes

// Root path response
app.get("/", (req, res) => {
  if (req.session && req.session.userId) {
    res.redirect("/dashboard");
  } else {
    res.render("index");
  }
});

// Dashboard route with isAuthenticated middleware to ensure only authenticated users can access it
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard");
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', function connection(ws) {
  ws.on('message', async function incoming(message) {
    const chatMessage = JSON.parse(message);
    // Save message to the database
    try {
      await require('./models/chatModel').create(chatMessage);
    } catch (error) {
      console.error(`Error saving chat message: ${error.message}`, error.stack);
    }
    // Broadcast to all clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

server.on('upgrade', function upgrade(request, socket, head) {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  if (pathname === '/chat') { // Assuming '/chat' is the WebSocket endpoint
    sessionMiddleware(request, {}, () => {
      if (!request.session.userId) {
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
    });
  } else {
    socket.destroy();
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});