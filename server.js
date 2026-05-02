const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

function readData() {
  return JSON.parse(fs.readFileSync("data.json"));
}
function writeData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

app.post("/login", (req, res) => {
  const { code } = req.body;
  let data = readData();
  const user = data.codes.find(c => c.code === code);
  if (!user) return res.json({ success: false, message: "Kode tidak valid" });
  if (user.used) return res.json({ success: false, message: "Kode sudah digunakan" });
  res.json({ success: true });
});

app.post("/vote", (req, res) => {
  const { code, candidate } = req.body;
  let data = readData();
  const user = data.codes.find(c => c.code === code);
  if (!user || user.used) return res.json({ success: false });
  data.votes[candidate]++;
  user.used = true;
  writeData(data);
  res.json({ success: true });
});

app.get("/results", (req, res) => {
  res.json(readData().votes);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan di port " + PORT));
