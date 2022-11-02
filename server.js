const express = require('express');
const dbConnect = require('./dbConnect');
const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;
const itemsRoute = require('./routes/itemsRoute');
const usersRoute = require('./routes/usersRoute');
const billsRoute = require('./routes/billsRoute.js');

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/items', itemsRoute);
app.use('/api/users', usersRoute);
app.use('/api/bills', billsRoute);

// ********<<<< DEPLOYMENT CODE  STARTS HERE>>>>>>********
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use('/home', express.static('my-app/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'my-app/build/index.html'));
  });
}

// ********<<<< DEPLOYMENT CODE  ENDS HERE>>>>>>********

app.listen(port, () => {
  console.log(`NodeJS server running on port ${port}!`);
});
