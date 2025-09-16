const express = require("express");
const cors = require("cors");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

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
            const credentials = require("./disaster-management312-be80c55826f0.json");
            await doc.useServiceAccountAuth(credentials);
        }

        await doc.loadInfo();
        console.log("Google Sheets initialized successfully");
        console.log("Sheet title:", doc.title);
        console.log("Sheet count:", doc.sheetCount);
    } catch (error) {
        console.error("Error initializing Google Sheets:", error.message);
        console.error("Full error:", error);
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
                "Timestamp": timestamp || new Date().toISOString(),
            });
            res.json({ message: "User created", phone, created: true });
        }
    } catch (error) {
        console.error("Error saving user:", error.message);
        res.status(500).json({ error: "Failed to save user data" });
    }
});

// Start server
async function startServer() {
    await initializeSheets();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
startServer();
