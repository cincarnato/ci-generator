module.exports = function (model) {
    let content =
`import ${model.name} from './../models/${model.name}Model'

export const find${model.name}s = function () {
    return new Promise((resolve, reject) => {
        ${model.name}.find({}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const find${model.name} = function (id) {
    return new Promise((resolve, reject) => {
        ${model.name}.findOne({_id: id}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

${findBy(model)}

export const create${model.name} = function (user, {${fields(model.properties)}}) {
    const newDoc = new ${model.name}({
        ${docFields(model.properties)}
    })
    newDoc.id = newDoc._id;
    return new Promise((resolve, rejects) => {
        newDoc.save((error => {
            error ? rejects(error) : resolve(newDoc)
        }))
    })
}

export const update${model.name} = function (user, id, {${fields(model.properties)}}) {
    return new Promise((resolve, rejects) => {
        ${model.name}.findOneAndUpdate({_id: id},
        {${docFields(model.properties, true)}}, 
        (error,doc) => {
            error ? rejects(error) : resolve(doc)
        })
    })
}



`
    return content;
}


function findBy(model){
    let properties = model.properties.filter(field => field.findby == true)

    return properties.map(field => {
        return findByMethod(model,field)
    }).join('\n')
}

function findByMethod(model, field){
    let content =
`
export const find${model.name}sBy${capitalize(field.name)} = function (${field.name}) {
    return new Promise((resolve, reject) => {
        ${model.name}.find({${field.name}: ${field.name}}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}
`
    return content
}

function capitalize(name){
    return name.charAt(0).toUpperCase() + name.slice(1)
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

function fields(properties){

    properties =  filterBackendProperties(properties)

    return properties.map(field => field.name).join(', ')
}


function docFields(properties, update = false){

    if(update){
        properties = properties.filter(field => {
            if(field.name == 'createdAt' || field.name == 'createdBy'){
                return false
            }
            return true
        })
    }

    return properties.map(field => {
        switch(field.name) {
            case 'createdBy':
                return `createdBy: user.id`
            case 'updatedBy':
                return `updatedBy: user.id`
            case 'createdAt':
                return `createdAt: new Date()`
            case 'updatedAt':
                return `updatedAt: new Date()`
            default:
                return field.name
        }
    }).join(', ')
}
