const fs = require("fs-extra");
const path = require("path");

const source = path.join(__dirname, "../public");
const destination = path.join(__dirname, "../dist/public");

fs.copy(source, destination)
  .then(() => console.log("copied successfully!"))
  .catch((err) => console.error("Error copying:", err));