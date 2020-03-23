module.exports = function (model) {
let content =
`mutation ${model.name.toLowerCase()}Delete($id: ID!){
    ${model.name.toLowerCase()}Delete(id: $id){
        id
        deleteSuccess
    }
}

`

return content
}
