const Person = ({person, handleDeletion}) =>{
    return(
        <p key={person.name}>{person.name}: {person.number} <button onClick={()=>handleDeletion(person.id)}>delete</button></p>
    )
}

const Persons = ({persons, handleDeletion}) => {
    return(
        <div>
            {persons.map((person)=><Person key={person.name} person={person} handleDeletion={handleDeletion}/>)}
        </div>
    )
}

export default Persons