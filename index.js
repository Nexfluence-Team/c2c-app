const express = require("express")
const mongoose = require("mongoose")
const app = express()

app.use(express.json())

mongoose.connect("YOUR_MONGODB_URL")

app.post("/score", (req, res) => {
  res.json({ success: true, result: req.body })
})

app.listen(4000, () => console.log("Server running"))
