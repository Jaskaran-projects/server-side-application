const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/whatsapp', { useNewUrlParser: true });

const GroupMessage = mongoose.model('GroupMessage', {
  group_id: String,
  sender_id: String,
  message: String,
  timestamp: Date
});

const app = express();
app.use(express.json());

// API to load all group messages in a paginated manner
app.get('/api/group_messages', (req, res) => {
  const group_id = req.query.group_id;
  const page = req.query.page || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  GroupMessage.find({ group_id }, null, { skip, limit }, (err, messages) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(messages);
    }
  });
});

// API to create a message in the group
app.post('/api/group_messages', (req, res) => {
  const group_id = req.body.group_id;
  const sender_id = req.body.sender_id;
  const message = req.body.message;
  const timestamp = new Date();

  GroupMessage.create({ group_id, sender_id, message, timestamp }, (err, message) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(message);
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
