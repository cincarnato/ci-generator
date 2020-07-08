const capitalize = require('../../../utils/capitalize')
const descapitalize = require('../../../utils/descapitalize')

module.exports = function ({model, field}) {
let content =
`query ${descapitalize(model.name)}By${capitalize(field.name)}($${field.name}:String!){
    ${descapitalize(model.name)}By${capitalize(field.name)}(${field.name}:$${field.name}){
        id
        ${retorno(model.properties)}
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

