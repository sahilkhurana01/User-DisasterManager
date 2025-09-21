const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || [
        'http://localhost:8080', 
        'http://localhost:8081', 
        'http://localhost:3000',
        'http://localhost:5173' // Vite default port
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Routes
app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "Server running" });
});

// Mock user data storage (in-memory for now)
let users = [];
let sosAlerts = [];

app.post("/api/users", async (req, res) => {
    try {
        const { phone, email, city, locality, fullAddress, timestamp } = req.body;

        if (!phone || !email || !city || !locality || !fullAddress) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingUserIndex = users.findIndex((user) => user.phone === phone);

        if (existingUserIndex >= 0) {
            users[existingUserIndex] = {
                ...users[existingUserIndex],
                email,
                city,
                locality,
                fullAddress,
                timestamp: timestamp || new Date().toISOString(),
            };
            res.json({ message: "User updated", phone, updated: true });
        } else {
            users.push({
                phone,
                email,
                city,
                locality,
                fullAddress,
                alerts: "green", // Default to green
                timestamp: timestamp || new Date().toISOString(),
            });
            res.json({ message: "User created", phone, created: true });
        }
    } catch (error) {
        console.error("Error saving user:", error.message);
        res.status(500).json({ error: "Failed to save user data" });
    }
});

// Get user alerts status
app.get("/api/users/:phone/alerts", async (req, res) => {
    try {
        const { phone } = req.params;
        
        if (!phone) {
            return res.status(400).json({ error: "Phone number is required" });
        }

        const user = users.find((user) => user.phone === phone);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const alertStatus = user.alerts || "green";
        res.json({ 
            phone, 
            alertStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error fetching user alerts:", error.message);
        res.status(500).json({ error: "Failed to fetch alert status" });
    }
});

// Update user alerts status (for testing)
app.put("/api/users/:phone/alerts", async (req, res) => {
    try {
        const { phone } = req.params;
        const { alertStatus } = req.body;
        
        if (!phone) {
            return res.status(400).json({ error: "Phone number is required" });
        }

        if (!alertStatus || !["green", "red"].includes(alertStatus)) {
            return res.status(400).json({ error: "Alert status must be 'green' or 'red'" });
        }

        const userIndex = users.findIndex((user) => user.phone === phone);

        if (userIndex === -1) {
            return res.status(404).json({ error: "User not found" });
        }

        users[userIndex].alerts = alertStatus;

        res.json({ 
            message: "Alert status updated", 
            phone, 
            alertStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error updating user alerts:", error.message);
        res.status(500).json({ error: "Failed to update alert status" });
    }
});

// SOS Alert endpoint - Save emergency coordinates
app.post("/api/sos", async (req, res) => {
    try {
        const { phone, coordinates, accuracy, timestamp } = req.body;

        if (!phone || !coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
            return res.status(400).json({ 
                error: "Missing required fields: phone and coordinates [lat, lng] are required" 
            });
        }

        const [lat, lng] = coordinates;
        if (typeof lat !== 'number' || typeof lng !== 'number') {
            return res.status(400).json({ 
                error: "Coordinates must be valid numbers [latitude, longitude]" 
            });
        }

        const coordinatesString = `${lat}, ${lng}`;
        
        sosAlerts.push({
            phone,
            coordinates: coordinatesString,
            timestamp: timestamp || new Date().toISOString(),
            accuracy: accuracy || "Unknown",
            status: "Active"
        });

        console.log(`SOS Alert saved: Phone ${phone}, Coordinates: ${coordinatesString}`);
        
        res.json({ 
            message: "SOS Alert saved successfully", 
            phone,
            coordinates: coordinatesString,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error saving SOS alert:", error.message);
        res.status(500).json({ error: "Failed to save SOS alert" });
    }
});

// Google Places API proxy endpoint to avoid CORS issues
app.get("/api/places/nearby", async (req, res) => {
    try {
        const { lat, lng, type, radius } = req.query;
        
        if (!lat || !lng || !type) {
            return res.status(400).json({ 
                error: "Missing required parameters: lat, lng, and type are required" 
            });
        }

        // Get API key from environment or use the one from the frontend config
        const apiKey = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyC-RQrNZyJ4_YmnvZNWz8-wf1pnV5jJzXs';
        
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${lat},${lng}&radius=${radius || 5000}&type=${type}`;
        
        // Use Node.js built-in fetch (available in Node.js 18+)
        const response = await fetch(url);
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error("Error fetching places:", error.message);
        res.status(500).json({ error: "Failed to fetch places" });
    }
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Server accessible from all interfaces on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
