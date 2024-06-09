const express = require('express');
const router = express.Router();

// GET home page.
router.get("/", function (req, res) {
  res.redirect("/catalog");
  console.log("Your URL is: ", req.url);
  console.log("Your IP is: ", req.ip);
  //res.send("<h1>Hello World!</h1>");
});

module.exports = router;
