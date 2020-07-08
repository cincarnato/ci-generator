const capitalize = require('../../utils/capitalize')
const descapitalize = require('../../utils/descapitalize')
const pluralize = require('../../utils/pluralize')

module.exports = function (model) {
//TYPE DEFINITION
    let content =
        `
import {${findByImport(model)} create${model.name}, update${model.name}, delete${model.name},  find${capitalize(model.name)}, fetch${pluralize(capitalize(model.name))}, paginate${pluralize(capitalize(model.name))}} from '../../services/${model.name}Service'

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {

    ${model.name.toUpperCase()}_SHOW,
    ${model.name.toUpperCase()}_UPDATE,
    ${model.name.toUpperCase()}_CREATE,
    ${model.name.toUpperCase()}_DELETE
} from "../../permissions/${model.name}";

export default {
    Query: {
        ${descapitalize(model.name)}Find: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ${model.name.toUpperCase()}_SHOW)) throw new ForbiddenError("Not Authorized")
            return find${capitalize(model.name)}(id)
        },
        ${descapitalize(model.name)}Fetch: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ${model.name.toUpperCase()}_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetch${pluralize(capitalize(model.name))}()
        },
        ${descapitalize(model.name)}Paginate: (_, {pageNumber, itemsPerPage, search, orderBy, orderDesc}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ${model.name.toUpperCase()}_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginate${pluralize(capitalize(model.name))}(pageNumber, itemsPerPage, search, orderBy, orderDesc)
        },
        ${findBy(model)}
    },
    Mutation: {
        ${descapitalize(model.name)}Create: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ${model.name.toUpperCase()}_CREATE)) throw new ForbiddenError("Not Authorized")
            return create${capitalize(model.name)}(user, input)
        },
        ${descapitalize(model.name)}Update: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ${model.name.toUpperCase()}_UPDATE)) throw new ForbiddenError("Not Authorized")
            return update${capitalize(model.name)}(user, id, input)
        },
        ${descapitalize(model.name)}Delete: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ${model.name.toUpperCase()}_DELETE)) throw new ForbiddenError("Not Authorized")
            return delete${capitalize(model.name)}(id)
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
`${descapitalize(model.name)}By${capitalize(field.name)}: (_, {${field.name}}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            return find${pluralize(capitalize(model.name))}By${capitalize(field.name)}(${field.name})
        },
`
    return content
}

