import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

// To support ES Module syntax
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import JSON file
// import data from './articles.json' assert { type: 'json' };

// Path to your JSON file
const jsonFilePath = path.resolve('articles.json');

// Helper function to load and parse the JSON file
const loadJsonData = () => {
  const rawData = fs.readFileSync(jsonFilePath, 'utf-8');
  return JSON.parse(rawData);
};

const data = loadJsonData();

const users = [
  { username: 'testUser', password: 'password123' },
  { username: 'admin', password: 'adminPass' }
];

// Initialize Express app
const app = express();
app.use(cors()); // Allow all origins for now
app.use(express.json());
const port = process.env.PORT;

// Function to filter items based on the search query
const filterItemsByTitle = (query) => {
  if (!query || !data || !data.Search) return [];

  const queryWords = query.toLowerCase().split(' ');
  return data.Search.filter(item => {
    return queryWords.some(word => item.Title.toLowerCase().includes(word));
  });
};

// Search endpoint
app.get('/search', (req, res) => {
  const query = req.query.q;

  if (!query) {
    // Return all articles if no query is provided
    return res.json({
      Search: data.Search,
      totalResults: data.Search.length.toString(),
      Response: "True"
    });
  }

  const filteredResults = filterItemsByTitle(query);
  res.json({
    Search: filteredResults,
    totalResults: filteredResults.length.toString(),
    Response: "True"
  });
});

// Define your /contact endpoint
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Your logic here for handling the form data
  res.json({
    message: 'Form submitted successfully.',
    summary: {
      name,
      email,
      messageSnippet: message.slice(0, 30), // Show the first 30 characters of the message
    },
  });
});

// Route to handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  // Find the user in the hardcoded user data
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Login successful
    res.status(200).json({ message: 'Login successful' });
  } else {
    // Login failed
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
