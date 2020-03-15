module.exports = function (model, field) {
let content =
`query ${model.name.toLowerCase()}sBy${capitalize(field.name)}($${field.name}:String!){
    ${model.name.toLowerCase()}sBy${capitalize(field.name)}(${field.name}:$${field.name}){
        ${model.properties.map(f => f.name).join('\n        ')}
    }
}
`

return content
}

function capitalize(name){
    return name.charAt(0).toUpperCase() + name.slice(1)
}
