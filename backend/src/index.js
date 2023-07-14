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
    if(error.name === "CastError"){
        response.status(400).send({error: 'malformatted id', name: error.name})
    } else if(error.name === "ValidationError"){
        response.status(400).json({error: error.message, name: error.name})
    }
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

app.get("/api/persons", (request, response) =>{
    Person.find({}).then(people =>{
        response.json(people)
    })
})
app.post("/api/persons", (request, response, next) =>{
    const personObj = request.body
    const person = new Person({
        name: personObj.name,
        number: personObj.number
    })
    person.save()
        .then(savedPerson=>{
            response.status(201).json(savedPerson)
        })
        .catch(error => next(error))
})

app.get("/api/info", (request, response, next)=> {
    Person.countDocuments()
        .then(count => {
            response.send(`<p>Phone book has ${count} people saved </p> <p>${new Date()}</p>`)
        })
        .catch(error => next(error))

})

app.get("/api/persons/:id", (request, response, next) => {
    const personID = request.params.id
    Person.findById(personID)
        .then(person => {
            if(person)
                response.json(person)
            else
                response.status(404).send({error:'Person not found'})
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    const personID = request.params.id
    Person.findByIdAndRemove(personID)
        .then(deletedPerson => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const personID = request.params.id
    const body = request.body
    const newPerson = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(personID, newPerson,{new:true, runValidators:true, context: 'query'})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(unknownEndPoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server listening on port ${PORT}`)