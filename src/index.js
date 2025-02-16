const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
//const mongoose = require('mongoose');
const {Client} = require('pg'); 
const redis = require('redis');

// connect to postgres
const DB_USER = 'root';
const DB_PASSWORD = 'example';
const DB_PORT = 5432;  
const DB_HOST = 'postgres';    
const URI = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;

const client = new Client({connectionString: URI,});

client.connect()
  .then(() => console.log("Connected to PostgreSQL..."))
  .catch((err) => console.error("Failed to connect to PostgreSQL...", err));

module.exports = client;

// connext to redis
const RED_PORT = 6379;
const RED_HOST = 'redis';
const redisClient = redis.createClient({
  url: `redis://${RED_HOST}:${RED_PORT}`
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected...'));
redisClient.connect();



// Connect Mongo_DB
/**
const DB_USER = 'root';
const DB_PASSWORD = 'example';
const DB_PORT = 27017;
const DB_HOST = 'mongo';  // Use the service name, not an IP
const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
mongoose.connect(URI)
  .then(() => console.log("Connected to DB..."))
  .catch((err) => console.log("Failed to connect to DB...", err));*/

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Home route rendering the form
app.get('/', (req, res) => {
  redisClient.set("proffestion ", "Developer.");
  res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 300px;
            text-align: center;
          }
          h1 {
            color: #4caf50;
          }
          form {
            display: flex;
            flex-direction: column;
          }
          label {
            margin: 10px 0 5px;
            color: #333;
          }
          input {
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
          }
          button {
            padding: 10px;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          button:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hello, My User! Welcome to the Production Environment.</h1>
          <form action="/submit" method="POST">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <button type="submit">Submit</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

app.get("/data", async (req, res) => {

  const proffestion  = await redisClient.get('proffestion ');
  res.send(`<h1>Hello World </h1> <h2>${proffestion}</h2>`)
});

// Submit route handling form data
app.post('/submit', (req, res) => {
  const { name, email } = req.body;
  res.send(`
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center;">
        <h1>Form Submitted!</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`App is UP and Running on port ${PORT}`);
});
