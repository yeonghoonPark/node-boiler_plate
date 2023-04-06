const express = require("express");
const app = express();
const port = 5000;

// mongodb+srv://huklmnj2:<password>@youtubeclone.7mckhl7.mongodb.net/?retryWrites=true&w=majority

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://huklmnj2:qkMQmtUbj8PmWcRr@youtubeclone.7mckhl7.mongodb.net/?retryWrites=true&w=majority",
    {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    },
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log("Error", err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
