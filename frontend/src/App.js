import {useEffect, useState} from "react";
import Form from "./components/Form";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import personsServices from "./services/persons"
import Notification from "./components/Notification";

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [notificationType, setNotificationType] = useState(null)
    const personsToShow = filter ===''? persons : persons.filter(
        (person)=>person.name.toLowerCase().includes(filter.toLowerCase())
    )

    useEffect(()=>{
        personsServices
            .getAll()
            .then((initialPersons) => {
                setPersons(initialPersons)
            })
    }, [])

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }
    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }
    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }
    const addPerson = (event) => {
        event.preventDefault()
        const existingPerson = persons.find(element => element.name === newName)
        if(existingPerson){
            const message = `${newName} is already added to phonebook, replace the old number with a new one?`
            const newPerson = {...existingPerson, number: newNumber}
            if(window.confirm(message)){
                personsServices
                    .update(existingPerson.id, newPerson)
                    .then(updatedPerson=>{
                        setPersons(persons.map(p=>p.id!==updatedPerson.id? p : updatedPerson))
                        setNewName('')
                        setNewNumber('')
                    })
                    .catch(error=>{
                        console.log(error.name)
                        setNotificationMessage(`Information about ${newPerson.name} has already been removed from server`)
                        setNotificationType('error')
                        setPersons(persons.filter(p=>p.id!==newPerson.id))
                        setTimeout(()=>{
                            setNotificationMessage(null)
                            setNotificationType(null)
                        }, 5000)
                    })
            }
        }
        else{
            const personObject = {
                name: newName,
                number: newNumber
            }
            personsServices
                .create(personObject)
                .then(createdPerson=>{
                    setPersons(persons.concat(createdPerson))
                    setNotificationMessage(`Added ${createdPerson.name}`)
                    setNotificationType('new_item')
                    setTimeout(()=>{
                        setNotificationMessage(null)
                        setNotificationType(null)
                    }, 5000)
                    setNewName('')
                    setNewNumber('')
                })
                .catch(error => {
                    setNotificationMessage(error.response.data.error)
                    setNotificationType('error')
                    setTimeout(()=>{
                        setNotificationMessage(null)
                        setNotificationType(null)
                    }, 3000)
                    setNewName('')
                    setNewNumber('')
                })
        }

    }
    const deleteSinglePerson = (id) => {
        const personToDelete = persons.find(p=>p.id===id)
        if(window.confirm(`Delete ${personToDelete.name} ?`)){
            personsServices
                .deletePerson(id)
                .then(()=>{
                    setPersons(persons.filter(person=>person.id!==id))
                })
        }
    }
    return (
    <div className="App">
        <h2>Phonebook</h2>
        <Notification message={notificationMessage} notificationType={notificationType} />
        <Filter filter={{changeHandler: handleFilterChange, value: filter}} />
        <h3>Add new</h3>
        <Form name={{changeHandler: handleNameChange, value: newName}}
              number={{changeHandler: handleNumberChange, value: newNumber}}
              addPerson={addPerson}
        />
        <h3>Numbers</h3>
        <Persons persons={personsToShow} handleDeletion={deleteSinglePerson} />
    </div>
    );
}

export default App;
