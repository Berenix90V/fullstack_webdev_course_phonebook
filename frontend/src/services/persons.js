import axios from "axios";
const baseUrl = "/api/persons"

const getAll = ()=> {
    return axios
        .get(baseUrl)
        .then(response=>response.data)
}

const create = (personObject) => {
    return axios
        .post(baseUrl, personObject)
        .then(response=> response.data)
}

const deletePerson = (id) => {
    return axios
        .delete(`${baseUrl}/${id}`)
        .then(response=> response.data)
}

const update = (id, personObject) => {
    return axios
        .put(`${baseUrl}/${id}`, personObject)
        .then(response=> response.data)
}

const personsServices = {
    getAll: getAll,
    create: create,
    deletePerson: deletePerson,
    update: update
}
export default personsServices