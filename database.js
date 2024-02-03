const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB database');
});
mongoose.connection.on('error', (error) => {
    console.log('Error connecting to MongoDB database:', error);
});