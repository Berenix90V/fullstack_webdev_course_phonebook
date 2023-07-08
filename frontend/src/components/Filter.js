const Filter = ({filter}) => {
    return(
        <div>
            filter shown with <input onChange={filter.changeHandler} value={filter.value}/>
        </div>
    )
}

export default Filter