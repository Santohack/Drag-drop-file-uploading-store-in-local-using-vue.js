const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Directory to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Keep original file name
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.array('files[]'), (req, res) => {

  
  res.status(200).send('Files uploaded successfully');
});

// Serving uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
