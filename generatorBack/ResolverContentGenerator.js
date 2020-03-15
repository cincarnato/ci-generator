module.exports = function (model) {
//TYPE DEFINITION
    let content =
        `
import {${findByImport(model)} create${model.name}, update${model.name}, find${model.name}, find${model.name}s} from '../../services/${model.name}Service'

export default {
    Query: {
        ${model.name.toLowerCase()}s: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            return find${model.name}s()
        },
        ${model.name.toLowerCase()}: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            return find${model.name}(id)
        },
        ${findBy(model)}
    },
    Mutation: {
        ${model.name.toLowerCase()}Create: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, "SECURITY-ADMIN-CREATE")) throw new ForbiddenError("Not Authorized")
            return create${model.name}(user, input)
        },
          ${model.name.toLowerCase()}Update: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, "SECURITY-ADMIN-UPDATE")) throw new ForbiddenError("Not Authorized")
            return update${model.name}(user, id, input)
        },
    }

}

`

    return content
}


function capitalize(name){
    return name.charAt(0).toUpperCase() + name.slice(1)
}

function findByImport(model){
    let properties = model.properties.filter(field => field.findby == true)

    if(properties.length>0){

    let content = properties.map(field => {
        return findByImportMethod(model,field)
    }).join(',')

    return content + ','
    }

    return ''
}

function findByImportMethod(model, field){
    let content = `find${model.name}sBy${capitalize(field.name)}`
    return content
}

function findBy(model){
    let properties = model.properties.filter(field => field.findby == true)

    return properties.map(field => {
        return findByMethod(model,field)
    }).join(',\n')
}

function findByMethod(model, field){
    let content =
`${model.name.toLowerCase()}sBy${capitalize(field.name)}: (_, {${field.name}}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            return find${model.name}sBy${capitalize(field.name)}(${field.name})
        },
`
    return content
}




function fields(properties) {

    return properties.map(field => {
        if (!field.name) throw new Error("Field needs name atributte")
        if (!field.type) throw new Error("Field " + field.name + " needs type atributte")
        switch (field.type) {
            case "ObjectId":
                if (!field.ref) throw new Error("Field " + field.name + "  has ObjectId type so needs ref atributte")
                return ` ${field.name}: ${field.ref}${field.required ? "!" : ""}`
            case "Date":
                return ` ${field.name}: String${field.required ? "!" : ""}`
            default:
                return ` ${field.name}: ${field.type}${field.required ? "!" : ""}`

        }
    }).join('\n')
}
