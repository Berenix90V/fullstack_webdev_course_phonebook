const Form = ({name, number, addPerson}) => {
    return(
        <form onSubmit={addPerson}>
            <div>
                name: <input onChange={name.changeHandler} value={name.value}/>
            </div>
            <div>
                number: <input onChange={number.changeHandler} value={number.value}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default Form