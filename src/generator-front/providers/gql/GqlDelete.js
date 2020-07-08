const descapitalize = require('../../../utils/descapitalize')

module.exports = function (model) {
let content =
`mutation ${descapitalize(model.name)}Delete($id: ID!){
    ${descapitalize(model.name)}Delete(id: $id){
        id
        success
    }
}

`

return content
}
