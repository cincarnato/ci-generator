module.exports = function (model) {
//TYPE DEFINITION
    let content =
        `
type ${model.name}{
id: ID!
${fields(model.properties)}
}

type Query {
    ${model.name.toLowerCase()}s: [${model.name}]
    ${model.name.toLowerCase()}(id:ID!): ${model.name}
    ${findBy(model)}
    
}

input ${model.name}Input{
   ${fields(model.properties, true)}
}

type Mutation {
    ${model.name.toLowerCase()}Create(input: ${model.name}Input): ${model.name}
    ${model.name.toLowerCase()}Update(id: ID!, input: ${model.name}Input): ${model.name}
}
`

    return content
}

function capitalize(name){
    return name.charAt(0).toUpperCase() + name.slice(1)
}


function findBy(model){
    let properties = model.properties.filter(field => field.findby == true)

    return properties.map(field => {
        return findByMethod(model,field)
    }).join('\n')
}

function findByMethod(model, field){
    let content = `${model.name.toLowerCase()}sBy${capitalize(field.name)}(${field.name}:String!):[${model.name}]`
    return content
}


function filterBackendProperties(properties) {
    let propFiltered = properties.filter(field => {
        if (field.name == 'createdBy' || field.name == 'updatedBy' || field.name == 'createdAt' || field.name == 'updatedAt') {
            return false
        }
        return true
    })
    return propFiltered;
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
