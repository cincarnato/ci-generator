module.exports = function (model) {
let content =
`query ${model.name.toLowerCase()}sPaginate($limit:Int!, $pageNumber: Int, $search: String){
    ${model.name.toLowerCase()}sPaginate(limit: $limit, pageNumber: $pageNumber, search: $search){
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
