const capitalize = require('../../../utils/capitalize')
const pluralize = require('../../../utils/pluralize')

module.exports = function ({model, field}) {
let content =
`query ${pluralize(model.name.toLowerCase())}By${capitalize(field.name)}($${field.name}:String!){
    ${pluralize(model.name.toLowerCase())}By${capitalize(field.name)}(${field.name}:$${field.name}){
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

