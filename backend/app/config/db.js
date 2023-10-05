const mongoose = require('mongoose');

// const db = "mongodb+srv://speed5002:b8IKNhDBWqVwFqZ2@speed.ofx9x1s.mongodb.net/?retryWrites=true&w=majority";
// >>>>>>> main

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);  // Exit the process with a failure status
    }
};

module.exports = connectDB;
