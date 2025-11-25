const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Essential for client-side code from a different domain/port
const dotenv = require('dotenv');

// 1. Load Environment Variables (e.g., from a .env file)
dotenv.config(); 
// The secret key is stored securely in your .env file on the VPS
const SECRET_ACCESS_KEY = process.env.ACCESS_KEY; 

if (!SECRET_ACCESS_KEY) {
    console.error("FATAL ERROR: ACCESS_KEY is not defined in the environment variables.");
    // Exit if the secret key is missing, ensuring the server doesn't run insecurely
    process.exit(1); 
}

const app = express();
// NOTE: Port 3000 is used by the Node app. You will use a web server 
// like Nginx or Apache to proxy requests from port 443 (HTTPS) to 3000.
const PORT = 3000; 

// 2. Middleware setup
// Allows requests from different origins (like your hosted HTML page)
app.use(cors()); 
// Parses the incoming JSON body from the client
app.use(bodyParser.json()); 

// 3. The API Endpoint: /api/verify-access
app.post('/api/verify-access', (req, res) => {
    const userKey = req.body.key;

    // SECURITY NOTE: This is an insecure direct comparison for demonstration.
    // Replace this logic with a secure HASH comparison (e.g., using bcrypt) 
    // and a database lookup in a production environment.
    if (userKey && userKey === SECRET_ACCESS_KEY) {
        // Success: Send a 200 OK status
        console.log(`Access granted for key: ${userKey.substring(0, 4)}...`);
        return res.status(200).json({ message: 'Access granted' });
    } else {
        // Failure: Send a 401 Unauthorized status
        console.log(`Access denied for key attempt: ${userKey}`);
        return res.status(401).json({ message: 'Access denied: Invalid key.' });
    }
});

// 4. Start the server
app.listen(PORT, () => {
    console.log(`Access Verification API running on port ${PORT}`);
    console.log(`Secret Key set: ${SECRET_ACCESS_KEY.substring(0, 4)}...`);
});
