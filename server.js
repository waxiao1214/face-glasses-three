const express = require("express");
const app = express();
const path = require("path");
const port_number = process.env.PORT || 8000;

app.use(express.static("public"));
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "html");

app.listen(port_number, () =>
  console.log(`This project is listening on port ${port_number}!`)
);
