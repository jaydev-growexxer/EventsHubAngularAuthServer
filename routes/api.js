const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("../models/user");

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    res.status(401).json({
      hasError: true,
      msg: "Unauthorized Request",
    });
  }
  let token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401).json({
      hasError: true,
      msg: "Unauthorized Request",
    });
  }
  let payload = jwt.verify(token, process.env.SECRET_KEY);
  if (!payload) {
    res.status(401).json({
      hasError: true,
      msg: "Unauthorized Request",
    });
  }
  req.userId = payload.subject;
  next();
}

router.get("/", (req, res) => {
  res.send("Hello From Change");
});

router.get("/users", verifyToken, (req, res) => {
  res.status(201).json({
    hasError: false,
    data: [
      {
        name: "test",
      },
    ],
  });
});

router.post("/register", (req, res) => {
  new User(req.body)
    .save()
    .then((createdUser) => {
      let payload = { subject: createdUser._id };
      let token = jwt.sign(payload, process.env.SECRET_KEY);
      res.status(201).json({
        hasError: false,
        data: token,
      });
    })
    .catch((err) => {
      res.status(400).json({
        hasError: true,
        error: err,
      });
    });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json({
          hasError: true,
          data: "Invalid Email!",
        });
      } else if (req.body.password !== user.password) {
        res.status(401).json({
          hasError: true,
          data: "Invalid Password!",
        });
      } else {
        let payload = { subject: user._id };
        let token = jwt.sign(payload, process.env.SECRET_KEY);
        res.status(201).json({
          hasError: false,
          data: token,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        hasError: true,
        error: err,
      });
    });
});

module.exports = router;
