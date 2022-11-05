const express = require('express');
const userModel = require('../models/userModel');
const router = express.Router();

router.get('/get-all-users', async (req, res) => {
  try {
    const user = await userModel.find();
    res.send(user);
  } catch (error) {
    res.send('there is an error!').json(error);
  }
});
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

router.post('/add-employee', async (req, res) => {
  try {
    const newEmployee = new userModel(req.body);
    await newEmployee.save();
    res.send('New Account Created Successfully.');
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/edit-employee', async (req, res) => {
  try {
    await userModel.findOneAndUpdate({ _id: req.body.userID }, req.body);
    res.send('Updated successfully');
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/delete-employee', async (req, res) => {
  try {
    await userModel.findOneAndDelete({ _id: req.body.userID });
    res.send('Deleted successfully.');
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
