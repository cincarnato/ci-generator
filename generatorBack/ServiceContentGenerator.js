const capitalize = require('../generatorUtils/capitalize')
const filterBackendProperties = require('../generatorUtils/filterBackendProperties')

module.exports = function (model) {

    let content =
`import ${model.name} from './../models/${model.name}Model'

export const fetch${model.name}s = async function () {
    return new Promise((resolve, reject) => {
        ${model.name}.find({}).isDeleted(false).${populate(model.properties)}exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const paginate${model.name} = function (limit, pageNumber = 1, search = null) {

    function qs(search) {
        let qs = {}
        if (search) {
            qs = {
                $or: [
                    ${searchParams(model.properties)}
                ]
            }
        }
        return qs
    }

    let query = {deleted: false, ...qs(search)}
    let populate = ${populateArray(model.properties)}
    let params = {page: pageNumber, limit: limit, populate}

    return new Promise((resolve, reject) => {
        ${model.name}.paginate(query, params).then(result => {
                resolve({items: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}

export const find${model.name} = async function (id) {
    return new Promise((resolve, reject) => {
        ${model.name}.findOne({_id: id}).${populate(model.properties)}exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

${findBy(model)}

export const create${model.name} = async function (user, {${paramsFields(model.properties)}}) {
    
    const doc = new ${model.name}({
        ${docFields(model.properties)}
    })
    doc.id = doc._id;
    return new Promise((resolve, rejects) => {
        doc.save((error => {
            error ? rejects(error) : ${resolvePopulate(model.properties)}
        }))
    })
}

export const update${model.name} = async function (user, id, {${paramsFields(model.properties)}}) {
    return new Promise((resolve, rejects) => {
        ${model.name}.findOneAndUpdate({_id: id},
        {${docFields(model.properties, true)}}, 
        {new: true},
        (error,doc) => {
            error ? rejects(error) : ${resolvePopulate(model.properties)}
        })
    })
}

export const delete${model.name} = function (id) {
    return new Promise((resolve, rejects) => {
        find${model.name}(id).then((doc) => {
            doc.softdelete(function (err) {
                err ? rejects(err) : resolve({id: id, deleteSuccess: true})
            });
        })
    })
}

`
    return content;
}


// ---------------- FINDS BY ----------------------

function findBy(model){
    let properties = model.properties.filter(field => field.findby == true)

    return properties.map(field => {
        return findByMethod(model,field)
    }).join('\n')
}

function findByMethod(model, field){
    let content =
`
export const find${model.name}sBy${capitalize(field.name)} = async function (${field.name}) {
    return new Promise((resolve, reject) => {
        ${model.name}.find({${field.name}: ${field.name}}).${populate(model.properties)}exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}
`
    return content
}
// ---------------- END FINDS BY ----------------------

// ---------------- SEARCH ----------------------
function searchParams(properties){
    properties = properties.filter(field => field.search)
    return properties.map(field => {
        return `{${field.name}: {$regex: search, $options: 'i'}}`
    }).join(',\n')
}

// ---------------- POPULATE ----------------------
function resolvePopulate(properties){
    properties = getObjectIdProperties(properties)

    if(properties.length > 0){
        return 'doc.'+properties.map(field => {
            return `populate('${field.name}')`
        }).join('.') + '.execPopulate(() => resolve(doc))'
    }
    return 'resolve(doc)'
}


function populateArray(properties){
    properties = getObjectIdProperties(properties)

    if(properties.length > 0){
        return '[' + properties.map(field => {
            return `'${field.name}'`
        }).join(',') + ']'
    }
    return null
}

function populate(properties){
    properties = getObjectIdProperties(properties)

    if(properties.length > 0){
        return properties.map(field => {
            return `populate('${field.name}')`
        }).join('.') + '.'
    }
    return ''
}

function getObjectIdProperties(properties) {
    let propFiltered = properties.filter(field => {
        if (field.type == 'ObjectId') {
            return true
        }
        return false
    })
    return propFiltered;
}

// ---------------- END POPULATE ----------------------


function paramsFields(properties){
    properties =  filterBackendProperties(properties)
    return properties.map(field => field.name).join(', ')
}


function docFields(properties, update = false){
    return properties.map(field => {
        switch(field.name) {
            case 'createdBy':
                return `createdBy: user.id`
            case 'updatedBy':
                return `updatedBy: user.id`
            default:
                return field.name
        }
    }).join(', ')
}

