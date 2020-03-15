module.exports = function (model) {
let content =
`query ${model.name.toLowerCase()}($id:ID!){
    ${model.name.toLowerCase()}(id:$id){
        ${model.properties.map(f => f.name).join('\n        ')}
    }
}
`

return content
}
