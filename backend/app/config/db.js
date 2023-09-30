const mongoose = require('mongoose')

const db = "mongodb+srv://speed5002:b8IKNhDBWqVwFqZ2@speed.ofx9x1s.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(db, {
            useNewUrlParser: true,
        })

        console.log('MongoDB is Connected.')
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}

module.exports = connectDB
