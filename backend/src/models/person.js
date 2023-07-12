import mongoose from "mongoose";

const url = process.env.MONGO_URL
mongoose.set('strictQuery', false)
console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error=> {
        console.log('Error connecting to Mongo', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number:String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = document._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

export default Person

