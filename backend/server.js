const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

const dataFilePath = "./db.json";

// Read data from JSON file
function getDataFromFile() {
  const rawData = fs.readFileSync(dataFilePath);
  return JSON.parse(rawData);
}

// Write data to JSON file
function writeDataToFile(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data));
}

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const data = getDataFromFile();
  // Find the user with matching credentials
  const user = data.find(
    (item) => item.email === email && item.password === password
  );
  if (user) {
    res.json({ message: "Login successful" });
  } else {
    // add a defaultPassword
    if (!user.hasOwnProperty("password")) {
      user.password = "12345678";
    }
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Get all data
app.get("/api/data", (req, res) => {
  const data = getDataFromFile();
  res.json(data);
});

// Add new data
app.post("/api/data", (req, res) => {
  const data = getDataFromFile();
  const newItem = req.body;
  data.push(newItem);
  writeDataToFile(data);
  res.json({ message: "Data added successfully" });
});

// Update data
app.put("/api/data/:id", (req, res) => {
  const data = getDataFromFile();
  const id = req.params.id;
  const newData = req.body;
  // Find the item by id and update it
  const updatedData = data.map((item) => {
    if (item.id === id) {
      return { ...item, ...newData };
    }
    return item;
  });

  writeDataToFile(updatedData);
  res.json({ message: "Data updated successfully" });
});

// Delete data
app.delete("/api/data/:id", (req, res) => {
  const data = getDataFromFile();
  const id = req.params.id;

  // Filter out the item with the matching id
  const filteredData = data.filter((item) => item.id !== id);

  writeDataToFile(filteredData);
  res.json({ message: "Data deleted successfully" });
});

const port = 3000; // Choose a port number
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
