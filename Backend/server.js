const express = require("express");
const cors = require("cors");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const path = require("path");

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

// Google Sheets configuration
const SHEET_ID =
    process.env.GOOGLE_SHEET_ID ||
    "1W82kmjNEDbnUPtyc1rjz24CjUn5V1RKZmlF6Ym9B2_A";

let doc;

// Initialize Google Sheets
async function initializeSheets() {
    try {
        console.log("Initializing Google Sheets...");
        console.log("Sheet ID:", SHEET_ID);
        console.log("Environment:", process.env.NODE_ENV || 'development');

        doc = new GoogleSpreadsheet(SHEET_ID);

        // Try environment variables first, fallback to JSON file
        if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
            console.log("Using environment variables for authentication");
            await doc.useServiceAccountAuth({
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            });
        } else {
            console.log("Using JSON credentials file for authentication");
            try {
                const credentials = require("./disaster-management312-be80c55826f0.json");
                await doc.useServiceAccountAuth(credentials);
            } catch (fileError) {
                console.error("Could not load credentials file:", fileError.message);
                throw new Error("No Google Sheets credentials found. Please set environment variables or provide credentials file.");
            }
        }

        await doc.loadInfo();
        console.log("Google Sheets initialized successfully");
        console.log("Sheet title:", doc.title);
        console.log("Sheet count:", doc.sheetCount);
    } catch (error) {
        console.error("Error initializing Google Sheets:", error.message);
        if (process.env.NODE_ENV === 'development') {
            console.error("Full error:", error);
        }
        // Don't throw error in production to allow server to start
        if (process.env.NODE_ENV === 'production') {
            console.log("Server will continue without Google Sheets integration");
        }
    }
}

// Get or create Users Info sheet
async function getUsersInfoSheet() {
    try {
        // First try to find "Users Info" sheet
        let sheet = Object.values(doc.sheetsById).find(s => s.title === "Users Info");
        
        if (sheet) {
            console.log("Using Users Info sheet for data storage");
        } else {
            console.log("Users Info sheet not found, creating...");
            sheet = await doc.addSheet({
                title: "Users Info",
                headerValues: [
                    "Phone No.",
                    "Area",
                    "City",
                    "Alerts",
                    "Email",
                    "Full Address",
                    "Timestamp",
                ],
            });
        }

        // Ensure the sheet has the correct headers
        try {
            await sheet.loadHeaderRow();
            const currentHeaders = sheet.headerValues || [];
            const requiredHeaders = ["Phone No.", "Area", "City", "Alerts", "Email", "Full Address", "Timestamp"];
            
            // Check if we need to add missing headers
            const missingHeaders = requiredHeaders.filter(header => !currentHeaders.includes(header));
            if (missingHeaders.length > 0) {
                console.log("Current headers:", currentHeaders);
                console.log("Missing headers:", missingHeaders);
                console.log("Setting up complete headers for Users Info sheet:", requiredHeaders);
                // Set the header row properly
                await sheet.setHeaderRow(requiredHeaders);
            } else {
                console.log("Users Info sheet headers are already correct");
            }
        } catch (error) {
            console.log("Setting up headers for new Users Info sheet:", requiredHeaders);
            // For new sheets, set the header row
            await sheet.setHeaderRow(["Phone No.", "Area", "City", "Alerts", "Email", "Full Address", "Timestamp"]);
        }
        return sheet;
    } catch (error) {
        console.error("Error getting Users Info sheet:", error.message);
        throw error;
    }
}

// Get or create SOS Alert sheet
async function getSOSAlertSheet() {
    try {
        // First try to find "SOS Alert" sheet
        let sheet = Object.values(doc.sheetsById).find(s => s.title === "SOS Alert");
        
        if (sheet) {
            console.log("Using SOS Alert sheet for emergency data storage");
        } else {
            console.log("SOS Alert sheet not found, creating...");
            sheet = await doc.addSheet({
                title: "SOS Alert",
                headerValues: [
                    "Phone No.",
                    "SOS Coordinates",
                    "Timestamp",
                    "Accuracy",
                    "Status"
                ],
            });
        }

        // Ensure the sheet has the correct headers
        try {
            await sheet.loadHeaderRow();
            const currentHeaders = sheet.headerValues || [];
            const requiredHeaders = ["Phone No.", "SOS Coordinates", "Timestamp", "Accuracy", "Status"];
            
            // Check if we need to add missing headers
            const missingHeaders = requiredHeaders.filter(header => !currentHeaders.includes(header));
            if (missingHeaders.length > 0) {
                console.log("Current headers:", currentHeaders);
                console.log("Missing headers:", missingHeaders);
                console.log("Setting up complete headers for SOS Alert sheet:", requiredHeaders);
                // Set the header row properly
                await sheet.setHeaderRow(requiredHeaders);
            } else {
                console.log("SOS Alert sheet headers are already correct");
            }
        } catch (error) {
            console.log("Setting up headers for new SOS Alert sheet:", requiredHeaders);
            // For new sheets, set the header row
            await sheet.setHeaderRow(["Phone No.", "SOS Coordinates", "Timestamp", "Accuracy", "Status"]);
        }
        return sheet;
    } catch (error) {
        console.error("Error getting SOS Alert sheet:", error.message);
        throw error;
    }
}

// Routes
app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "Server running" });
});

app.post("/api/users", async (req, res) => {
    try {
        const { phone, email, city, locality, fullAddress, timestamp } = req.body;

        if (!phone || !email || !city || !locality || !fullAddress) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const sheet = await getUsersInfoSheet();
        const rows = await sheet.getRows();
        const existingUser = rows.find((row) => row["Phone No."] === phone);

        if (existingUser) {
            existingUser["Email"] = email;
            existingUser["City"] = city;
            existingUser["Area"] = locality;
            existingUser["Full Address"] = fullAddress;
            existingUser["Timestamp"] = timestamp || new Date().toISOString();
            await existingUser.save();
            res.json({ message: "User updated", phone, updated: true });
        } else {
            await sheet.addRow({
                "Phone No.": phone,
                "Email": email,
                "City": city,
                "Area": locality,
                "Full Address": fullAddress,
                "Alerts": "green", // Default to green
                "Timestamp": timestamp || new Date().toISOString(),
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

        const sheet = await getUsersInfoSheet();
        const rows = await sheet.getRows();
        const user = rows.find((row) => row["Phone No."] === phone);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const alertStatus = user["Alerts"] || "green";
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

        const sheet = await getUsersInfoSheet();
        const rows = await sheet.getRows();
        const user = rows.find((row) => row["Phone No."] === phone);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user["Alerts"] = alertStatus;
        await user.save();

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

        const sheet = await getSOSAlertSheet();
        
        // Format coordinates as "lat, lng" for the SOS Coordinates column
        const coordinatesString = `${lat}, ${lng}`;
        
        await sheet.addRow({
            "Phone No.": phone,
            "SOS Coordinates": coordinatesString,
            "Timestamp": timestamp || new Date().toISOString(),
            "Accuracy": accuracy || "Unknown",
            "Status": "Active"
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

// Google Places API (New) proxy endpoint to avoid CORS issues
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
        
        // Use the new Places API (New) textSearch endpoint
        // Convert type to a search query format
        const searchQuery = `${type} near ${lat},${lng}`;
        const url = `https://places.googleapis.com/v1/places:searchText?key=${apiKey}`;
        
        const requestBody = {
            textQuery: searchQuery,
            locationBias: {
                circle: {
                    center: {
                        latitude: parseFloat(lat),
                        longitude: parseFloat(lng)
                    },
                    radius: parseFloat(radius || 5000)
                }
            },
            maxResultCount: 20,
            fieldMask: "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.regularOpeningHours,places.iconMaskBaseUri"
        };
        
        // Use Node.js built-in fetch (available in Node.js 18+)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.regularOpeningHours,places.iconMaskBaseUri'
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        
        // Transform the new API response to match the legacy format for compatibility
        if (data.places) {
            const transformedData = {
                results: data.places.map(place => ({
                    place_id: place.id,
                    name: place.displayName?.text || 'Unknown',
                    vicinity: place.formattedAddress || '',
                    formatted_address: place.formattedAddress || '',
                    geometry: {
                        location: {
                            lat: place.location?.latitude || 0,
                            lng: place.location?.longitude || 0
                        }
                    },
                    rating: place.rating || 0,
                    opening_hours: place.regularOpeningHours ? {
                        open_now: place.regularOpeningHours.openNow || false
                    } : null,
                    icon: place.iconMaskBaseUri || ''
                })),
                status: 'OK'
            };
            res.json(transformedData);
        } else {
            res.json({ results: [], status: 'ZERO_RESULTS' });
        }
        
    } catch (error) {
        console.error("Error fetching places:", error.message);
        res.status(500).json({ error: "Failed to fetch places" });
    }
});

// Start server
async function startServer() {
    try {
        // Try to initialize Google Sheets, but don't fail if it doesn't work
        try {
            await initializeSheets();
        } catch (sheetsError) {
            console.warn('Google Sheets initialization failed, but continuing with server startup:', sheetsError.message);
        }
        
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Server accessible from all interfaces on port ${PORT}`);
        });
        
        server.on('error', (err) => {
            console.error('Server error:', err);
        });
        
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
