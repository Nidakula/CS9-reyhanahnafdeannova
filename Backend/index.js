const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT; 
const cors = require('cors');

// Konfigurasi opsi CORS 
const corsOptions = { 
    origin: 'http://localhost:5173', 
    methods: 'GET,POST,PUT,DELETE' 
  };
  
// Terapkan middleware CORS secara global 
app.use(cors(corsOptions));

app.use(express.json());
// Tambahkan route default untuk root path
app.use('/', (req, res) => {
  res.send('Server is running on Vercel!');
});

app.use('/store', require('./src/routes/store.route'));
app.use('/user', require('./src/routes/user.route'));
app.use('/item', require('./src/routes/item.route'));
app.use('/transaction', require('./src/routes/transaction.route'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


