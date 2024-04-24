const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Chat = require('../models/chatModel');

// Fetch all users except the logged-in user and render the chat page
router.get('/chat', async (req, res) => {
    if (!req.session.userId) {
        console.error('Access denied. No user session found.');
        res.status(403).send('Access denied. You must be logged in to view chat messages.');
        return;
    }

    try {
        const users = await User.find({ _id: { $ne: req.session.userId } }).select('username');
        res.render('chat', { users: users, userId: req.session.userId, username: req.session.username }); // Pass the list of users and userId to the chat page
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Error fetching users');
    }
});

// Fetch chat history between the logged-in user and another user
router.get('/chat/history/:userId', async (req, res) => {
    if (!req.session.userId) {
        console.error('Access denied. No user session found.');
        res.status(403).send('Access denied. You must be logged in to view chat history.');
        return;
    }

    const targetUserId = req.params.userId;
    try {
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            res.status(404).send('User not found');
            return;
        }

        const chats = await Chat.find({
            $or: [
                { sender: req.session.userId, recipient: targetUserId },
                { recipient: req.session.userId, sender: targetUserId }
            ]
        }).sort('timestamp').exec();

        res.json(chats.map(chat => {
            // Transform the chat data for the client
            return {
                sender: chat.sender.toString() === req.session.userId.toString() ? 'You' : targetUser.username,
                message: chat.message,
                timestamp: chat.timestamp
            };
        }));
    } catch (err) {
        console.error('Error fetching chat history:', err);
        res.status(500).send('Error fetching chat history');
    }
});

// Add a route to provide the logged-in user's ID for WebSocket communication
router.get('/chat/userId', (req, res) => {
    if(req.session && req.session.userId) {
        res.json({ userId: req.session.userId });
    } else {
        res.status(403).send('User ID not found');
    }
});

module.exports = router;