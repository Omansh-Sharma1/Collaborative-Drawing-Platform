const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/collab_drawing_platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
     
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

const Schema = mongoose.Schema;


const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});


const User = mongoose.model('User', userSchema);

module.exports = User;
