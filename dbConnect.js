const mongoose = require('mongoose');

const URL =
  'mongodb+srv://kenortz:wRPM3fqeG9awzYcA@cluster0.tlg1vje.mongodb.net/dinerTeaDb';

mongoose.connect(URL);

let connectionObj = mongoose.connection;

connectionObj.on('connected', () => {
  console.log('Mongo DB connection successful!');
});

connectionObj.on('error', () => {
  console.log('Mongo Db connection failed');
});
