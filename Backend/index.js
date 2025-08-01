const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());

// MySQL Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "1327", // Your MySQL password
  database: "shipment_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL Database!");
});
// const trackId = document.getElementById('trackId');

// POST endpoint to fetch form data and insert into the database
app.post("/addShipment", (req, res) => {
  // Destructure the incoming data from the request body
  const {
    track_id = 9,
    shipper_name,
    shipper_phone,
    shipper_address,
    shipper_email,
    receiver_name,
    receiver_phone,
    receiver_address,
    receiver_email,
    weight,
    courier,
    packages,
    mode,
    product,
    quantity,
    payment_mode,
    station,
    departure_time,
    origin,
    destination,
    pickup_date,
    pickup_time,
    expected_delivery,
    comments,
  } = req.body;

  //   console.log(res.body.track_id);

  // SQL query to insert data using placeholders
  const query = `
    INSERT INTO shipments (
      track_id, 
      shipper_name, shipper_phone, shipper_address, shipper_email, 
      receiver_name, receiver_phone, receiver_address, receiver_email, 
      weight, courier, packages, mode, product, quantity, 
      payment_mode, station, departure_time, origin, destination, 
      pickup_date, pickup_time, expected_delivery, comments
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    track_id,
    shipper_name,
    shipper_phone,
    shipper_address,
    shipper_email,
    receiver_name,
    receiver_phone,
    receiver_address,
    receiver_email,
    weight,
    courier,
    packages,
    mode,
    product,
    quantity,
    payment_mode,
    station,
    departure_time,
    origin,
    destination,
    pickup_date,
    pickup_time,
    expected_delivery,
    comments,
  ];

  // Execute the query
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Database insertion failed" });
    }
    res
      .status(200)
      .json({
        message: "Shipment added successfully",
        shipmentId: result.insertId,
      });
  });
});

app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.get('/u_orders', (req, res) => {
  const { username } = req.query;
  console.log("Received username:", username, "Type:", typeof username); // Debugging log
  // username = username.replace(/^"|"$/g, "");
  if (username) {
    const query = "SELECT * FROM uorders WHERE username = ?";
    db.query(query, [username], (err, results) => {  // Corrected parameter passing
      if (err) {
        console.error("Error fetching orders:", err);
        return res.status(500).json({ error: "Database query failed" });
      }
      console.log("Query Results:", results); // Log results
      res.json(results);
    });
  } else {
    console.log("No username provided, fetching all orders.");
    const query = "SELECT * FROM orders"; // Fetch all orders if no username is provided
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching orders:", err);
        return res.status(500).json({ error: "Database query failed" });
      }
      res.json(results);
    });
  }
});


app.post('/u_orders', (req, res) => {
  const { order_time, order_place, delivery_time, username } = req.body;

  if (!order_time || !order_place || !delivery_time || !username) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO uorders (order_time, order_place, delivery_time, username) VALUES (?, ?, ?, ?)";

  db.query(query, [order_time, order_place, delivery_time, username], (err, result) => {
    if (err) {
      console.error("Error inserting order:", err);
      return res.status(500).json({ error: "Database insert failed" });
    }
    res.status(201).json({ message: "Order added successfully", orderId: result.insertId });
  });
});


app.get("/shipments", (req, res) => {
  const selectQuery = `
    SELECT 
      track_id,             
      shipper_name, 
      receiver_name, 
      pickup_date
    FROM shipments
    
  `;
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    // console.log(results);
    res.json(results);
  });
});

app.get("/getDetails", (req, res) => {
  const { track_id } = req.query;
  if (!track_id) {
    return res.status(400).json({ error: "Track ID is required" });
  }
  const selectQuery = `
    SELECT 
      track_id,
      shipper_name, 
      receiver_name, 
      pickup_date
    FROM shipments where track_id=?
  `;
  db.query(selectQuery, [track_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    res.json(results[0]); // Return first matching shipment
  });
});

app.get("/test", (req, res) => {
  res.json({ message: "Hello, world!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
