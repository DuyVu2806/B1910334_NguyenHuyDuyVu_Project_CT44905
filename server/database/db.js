const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/mevn_stack';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
}).then(() => {
  console.log('MongoDB connected successfully.');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});
// mongodb+srv://duyvu2806:duyvu2806@cluster0.cqub2vz.mongodb.net/mevn_stack?retryWrites=true&w=majority