import mongoose from 'mongoose'

if (process.argv.length < 3) {
    console.log('Argument missing. At least password required')
    process.exit(1)
} else {
    if (process.argv.length === 4) {
        console.log('Argument missing. Name and number required')
        process.exit(1)
    }
    if (process.argv.length === 5 || process.argv.length === 3) {
        const password = process.argv[2]
        const url = `mongodb+srv://fullstack:${password}@cluster0.93p0nk3.mongodb.net/phonebook?retryWrites=true&w=majority`

        const personSchema = new mongoose.Schema({
            name: String,
            number: String
        })
        const Person = mongoose.model('Person', personSchema)

        mongoose.set('strictQuery', false)
        mongoose.connect(url)

        if (process.argv.length === 5) {
            const name = process.argv[3]
            const number = process.argv[4]

            const person = new Person({ name, number })

            person.save().then(result => {
                console.log(`added ${result.name} ${result.number} to phonebook`)
                mongoose.connection.close()
            })
        } else {
            Person.find({}).then(result => {
                result.forEach(person => {
                    console.log(person)
                })
                mongoose.connection.close()
            })
        }
    }
}
