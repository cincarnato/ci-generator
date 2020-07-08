const descapitalize = require('../../../utils/descapitalize')

module.exports = function (model) {
let content =
`mutation ${descapitalize(model.name)}Create(${variables(model.properties)}){
    ${descapitalize(model.name)}Create(input: {${input(model.properties)} }){
        id
        ${retorno(model.properties)}
    }
}

`

return content
}

function variables(properties){

    let propFiltered = properties.filter(field => {
        if(field.name == 'createdBy' || field.name == 'updatedBy' || field.name == 'createdAt' || field.name == 'updatedAt'){
            return false
        }
        return true
    })

    return propFiltered.map(field => {
        switch(field.type){
            case 'ObjectId':
                return `$${field.name}:ID${field.required?'!':''}`
            case 'Date':
                return `$${field.name}:String${field.required?'!':''}`
            default:
                return `$${field.name}:${field.type}${field.required?'!':''}`
        }

    }).join(', ')
}


function input(properties){

    let propFiltered = properties.filter(field => {
        if(field.name == 'createdBy' || field.name == 'updatedBy' || field.name == 'createdAt' || field.name == 'updatedAt'){
            return false
        }
        return true
    })

    return propFiltered.map(field => {
        return `${field.name}: $${field.name}`
    }).join(', ')
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
