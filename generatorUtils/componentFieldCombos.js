const capitalize = require('./capitalize')

module.exports.generateDataCombos = function generateDataCombos(properties) {

    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return `${field.name}s: []`
    }).join(',\n')
}


module.exports.generateImportCombos = function generateImportCombos(properties) {

    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return `import ${capitalize(field.name)}Provider from "../providers/${capitalize(field.name)}Provider";`
    }).join('\n')
}

module.exports.generateMountedCombos = function generateMountedCombos(properties) {

    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return `this.fetch${capitalize(field.name)}s()`
    }).join('\n')
}


module.exports.generateMethodsCombos = function generateMethodsCombos(properties) {
    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return generateMethodCombo(field)
    }).join(',\n')
}

function generateMethodCombo(field){
    let content =
        `
            fetch${capitalize(field.name)}s(){
                this.loading= true
                ${capitalize(field.name)}Provider.${field.name.toLowerCase()}s().then(r => {
                    this.${field.name.toLowerCase()}s = r.data.${field.name.toLowerCase()}s
                    this.loading = false
                })
            }
        `
    return content
}


function filterObjectIdProperties(properties) {
    let propFiltered = properties.filter(field => {

        if (field.name == 'createdBy' || field.name == 'updatedBy' || field.name == 'createdAt' || field.name == 'updatedAt') {
            return false
        }

        if (field.type == 'ObjectId') {
            return true
        }
        return false
    })
    return propFiltered;
}
