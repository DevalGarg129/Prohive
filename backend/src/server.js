// backend/src/server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const notificationRoutes = require('./routes/notifications');
const storyRoutes = require('./routes/stories');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true },
});

// Middleware

// expose io globally so other modules (event handlers) can emit without
// requiring module interop between ESM/CJS in this mixed codebase
global.io = io;
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 150, message: { message: 'Too many requests, try again later.' } }));

// Attach io to app for use in controllers
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (_, res) => res.json({ ok: true, ts: new Date() }));

// Socket.IO connection management
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  socket.on('user:join', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(`user:${userId}`);
    io.emit('users:online', Array.from(onlineUsers.keys()));
  });

  socket.on('disconnect', () => {
    for (const [uid, sid] of onlineUsers.entries()) {
      if (sid === socket.id) { onlineUsers.delete(uid); break; }
    }
    io.emit('users:online', Array.from(onlineUsers.keys()));
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prohive')
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, async () => {
      console.log(`🚀 Prohive API running on http://localhost:${PORT}`);

      // initialize Redis subscribers
      try {
        const subs = require('./events/subscriber');
        if (subs && typeof subs.initSubscribers === 'function') {
          await subs.initSubscribers();
          console.log('🔔 Redis subscribers initialized');
        }
      } catch (e) {
        console.error('Failed to initialize Redis subscribers:', e);
      }
    });
  })
  .catch((err) => { console.error('❌ DB connect failed:', err.message); process.exit(1); });

// also export io for CommonJS consumers
module.exports = { io };
