require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit');
const db = require('./db')
const app = express();
const { v4: uuidv4 } = require('uuid'); // For generating the unique titles
app.use(express.json());

// Connect to database
db.connect((err) =>{
    if (err) throw err;
    console.log('Connected to MySQL');
})

// Rate limiter middleware
const limiter = rateLimit({
    
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5
});

app.use('/api/', limiter);


async function auto_me() {
    console.log("Auto creation started");
    try {
        for (let i = 0; i < 500; i++) {
            const response = await axios.get('https://jsonplaceholder.typicode.com/users');
            const users = response.data;

            for (const user of users) {
                const [result] = await db.promise().execute(
                    'INSERT INTO autobots (name, email) VALUES (?, ?)',
                    [user.name, user.email]
                );
                const autbotId = result.insertId;

                const posts = await generatePostsForAutobot(autbotId);
                await generateCommentsForPosts(posts);
            }
        }
    } catch (err) {
        console.error('Error creating Autobots:', err.message);
    }
}

async function generatePostsForAutobot(autbotId) {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    const posts = response.data;

    const insertedPosts = [];
    for (let i = 0; i < 10; i++) {
        const uniqueTitle = `${posts[i].title}-${uuidv4()}`;
        const [postResult] = await db.promise().execute(
            'INSERT INTO posts (autbot_id, title, body) VALUES (?, ?, ?)',
            [autbotId, uniqueTitle, posts[i].body]
        );
        insertedPosts.push({ postId: postResult.insertId });
    }
    return insertedPosts;
}

async function generateCommentsForPosts(posts) {
    const response = await axios.get('https://jsonplaceholder.typicode.com/comments');
    const comments = response.data;

    for (const post of posts) {
        for (let i = 0; i < 10; i++) {
            await db.promise().execute(
                'INSERT INTO comments (post_id, name, email, body) VALUES (?, ?, ?, ?)',
                [post.postId, comments[i].name, comments[i].email, comments[i].body]
            );
        }
    }
}
// adding of cron job to refresh this per our
cron.schedule('0 * * * *', () => {
    console.log('Running Auto-me task');
    auto_me();
});

// API endpoints
app.get('/api/autobots', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM autobots LIMIT 10');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/autobots/:id/posts', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM posts WHERE autbot_id = ? LIMIT 10', [req.params.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/posts/:id/comments', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM comments WHERE post_id = ? LIMIT 10', [req.params.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
