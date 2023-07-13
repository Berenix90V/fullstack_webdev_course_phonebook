import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from "morgan";
import Person from "./models/person.js";
const app = express()

const unknownEndPoint = (request, response) => {
    response.status(404).send({error: 'Unknown endpoint'})
}
const errorHandler = (error, request, response, next)=>{
    if(error.name === "CasteError")
        response.status(400).send({error: 'malformatted id'})
    next(error)
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


morgan.token('content', (request)=>{
    if(Object.keys(request.body).length>0)
        return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

/*
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
*/
app.get("/api/persons", (request, response) =>{
    Person.find({}).then(people =>{
        console.log(people)
        response.json(people)
    })
})

app.get("/api/info", (request, response)=> {
    response.send(`<p>Phone book has people saved </p> <p>${new Date()}</p>`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(n=>n.id===id)
    if(person)
        response.json(person)
    else
        response.status(404).end()
})

app.delete("/api/persons/:id", (request, response, next) => {
    const personID = request.params.id
    Person.findByIdAndRemove(personID)
        .then(deletedPerson => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post("/api/persons", (request, response) =>{
    const personObj = request.body
    const person = new Person({
        name: personObj.name,
        number: personObj.number
    })
    person.save().then(savedPerson=>{
        response.json(savedPerson)
    })
})

app.use(unknownEndPoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server listening on port ${PORT}`)