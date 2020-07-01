module.exports = function (model) {
let content =
`query ${model.name.toLowerCase()}sPaginate( $pageNumber: Int, $itemsPerPage:Int, $search: String, $orderBy: String, $orderDesc: Boolean){
    ${model.name.toLowerCase()}sPaginate( pageNumber: $pageNumber, itemsPerPage: $itemsPerPage, search: $search, orderBy: $orderBy, orderDesc: $orderDesc){
        totalItems
        page
        items{
          id
          ${retorno(model.properties)}
        }
    }
}
`

return content
}

function retorno(properties){


    return properties.map(field => {

        if(field.name == 'createdBy' || field.name == 'updatedBy'){
            return `${field.name}{
                id
                name
                username
            }`
        }

        if(field.type == 'ObjectId'){
            return `${field.name}{
                id
            }`
        }

        return `${field.name}`
    }).join('\n        ')
}
