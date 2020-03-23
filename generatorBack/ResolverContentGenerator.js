const capitalize = require('../generatorUtils/capitalize')

module.exports = function (model) {
//TYPE DEFINITION
    let content =
        `
import {${findByImport(model)} create${model.name}, update${model.name}, delete${model.name},  find${model.name}, fetch${model.name}s} from '../../services/${model.name}Service'

export default {
    Query: {
        ${model.name.toLowerCase()}s: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            return fetch${model.name}s()
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
         ${model.name.toLowerCase()}Delete: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, "SECURITY-ADMIN-DELETE")) throw new ForbiddenError("Not Authorized")
            return delete${model.name}(id)
        },
    }

}

`

    return content
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

