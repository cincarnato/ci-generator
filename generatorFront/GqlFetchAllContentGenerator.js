module.exports = function (model) {
let content =
`query ${model.name.toLowerCase()}s{
    ${model.name.toLowerCase()}s{
        ${model.properties.map(f => f.name).join('\n        ')}
    }
}

`

return content
}
