module.exports = function (model) {
let content =
`mutation ${model.name.toLowerCase()}Update($id: ID!, ${variables(model.properties)}){
    ${model.name.toLowerCase()}Update(id: $id, input: {${input(model.properties)} }){
        ${model.properties.map(f => f.name).join('\n        ')}
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
        return `$${field.name}:${field.type}${field.required?'!':''}`
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
