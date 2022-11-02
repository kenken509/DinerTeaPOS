const express = require('express');
const userModel = require('../models/userModel');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const user = await userModel.findOne({
      userId: req.body.userId,
      password: req.body.password,
      verified: true,
    });
    if (user) {
      res.send(user);
    } else {
      res.send(response.status);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/register', async (req, res) => {
  try {
    const newUser = new userModel(req.body);
    await newUser.save();
    res.send('Registered Successfully.');
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
