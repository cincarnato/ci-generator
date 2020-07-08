const capitalize = require('../../utils/capitalize')
const descapitalize = require('../../utils/descapitalize')
const filterBackendProperties = require('../../utils/filterBackendProperties')

module.exports = function (model) {
//TYPE DEFINITION
    let content =
        `
type ${model.name}{
id: ID!
${fields(model.properties)}
}

type ${model.name}Paginated{
    totalItems: Int!
    page: Int!
    items: [${model.name}!]
}

type Query {
    ${descapitalize(model.name)}Find(id:ID!): ${model.name}
    ${descapitalize(model.name)}Fetch: [${model.name}]
    ${descapitalize(model.name)}Paginate( pageNumber: Int, itemsPerPage: Int, search: String, orderBy: String, orderDesc: Boolean): ${model.name}Paginated  
    ${findBy(model)}
    
}

input ${model.name}Input{
   ${fields(model.properties, true)}
}

type ${model.name}Delete{
    id: ID!
    success: Boolean!
}


type Mutation {
    ${descapitalize(model.name)}Create(input: ${model.name}Input): ${model.name}
    ${descapitalize(model.name)}Update(id: ID!, input: ${model.name}Input): ${model.name}
    ${descapitalize(model.name)}Delete(id: ID!): ${model.name}Delete!
}
`

    return content
}

function findBy(model){
    let properties = model.properties.filter(field => field.findby == true)

    return properties.map(field => {
        return findByMethod(model,field)
    }).join('\n')
}

function findByMethod(model, field){
    let content = `${descapitalize(model.name)}By${capitalize(field.name)}(${field.name}:String!):[${model.name}]`
    return content
}


function fields(properties, input = false) {

    if(input){
        properties = filterBackendProperties(properties)
    }

    return properties.map(field => {
        if (!field.name) throw new Error("Field needs name atributte")
        if (!field.type) throw new Error("Field " + field.name + " needs type atributte")
        switch (field.type) {
            case "ObjectId":
                if (!field.ref) throw new Error("Field " + field.name + "  has ObjectId type so needs ref atributte")

                if (input) {
                    return ` ${field.name}: ID${field.required ? "!" : ""}`
                }

                return ` ${field.name}: ${field.ref}${field.required ? "!" : ""}`
            case "Date":
                return ` ${field.name}: String${field.required ? "!" : ""}`
            default:
                return ` ${field.name}: ${field.type}${field.required ? "!" : ""}`

        }
    }).join('\n')
}
