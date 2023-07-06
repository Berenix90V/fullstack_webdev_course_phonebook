import express from 'express'
import morgan from "morgan";
const app = express()
app.use(express.json())

morgan.token('content', (request)=>{
    if(Object.keys(request.body).length>0)
        return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

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

app.get("/api/persons", (request, response) =>{
    response.json(persons)
})

app.get("/api/info", (request, response)=> {
    response.send(`<p>Phone book has ${persons.length} people </p> <p>${new Date()}</p>`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(n=>n.id===id)
    if(person)
        response.json(person)
    else
        response.status(404).end()
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p=>p.id!==id)
    response.status(204).end()
})

const generateID = () => {
    if(persons){
        const maxID = Math.max(...persons.map(p=>p.id))
        return Math.floor(Math.random() * (1000 - maxID + 1)) + maxID;
    }
    else
        return 0
}
app.post("/api/persons", (request, response) =>{
    const person = request.body
    if(!person)
        response.status(400).json({error:'Content missing'})
    if(!person.name)
        response.status(400).json({error:'Name missing'})
    if(!person.number)
        response.status(400).json({error:'Number missing'})
    if(persons.find(p=>p.name === person.name))
        response.status(400).json({error:'Name must be unique'})
    const newPerson = {
        id: generateID(),
        name: person.name,
        number: person.number
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)

})

const PORT = 3001
app.listen(PORT)
console.log(`Server listening on port ${PORT}`)