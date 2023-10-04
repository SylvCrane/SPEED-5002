// index.js

const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const connectDB = require('./app/config/db');
const cors = require('cors');

// routes
const researchPapers = require('./app/routes/api/researchPapers');
// const emailService = require('./app/routes/api/emailService');


const app = express();

// Connect Database
connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Hello world!'));

// use Routes
app.use('/api/researchPapers', researchPapers);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));
