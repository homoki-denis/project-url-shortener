require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");

const app = express();

const options = {
  // Setting family as 6 i.e. IPv6
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

// express.json() and express.urlencoded() are built-in middleware
//  functions to support JSON-encoded and URL-encoded bodies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint

let urlMapping = {};

app.post("/api/shorturl", function (req, res) {
  let originalUrl = req.body.url;
  let shortUrl = Math.floor(Math.random() * 1000);

  let domain = new URL(originalUrl).hostname;

  dns.lookup(domain, options, (err, address, family) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    urlMapping[shortUrl] = originalUrl;

    return res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

app.get("/api/shorturl/:shortLink", (req, res) => {
  let shortLink = req.params.shortLink;

  res.redirect(urlMapping[shortLink]);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
