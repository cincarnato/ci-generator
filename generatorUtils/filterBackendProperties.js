module.exports = function filterBackendProperties(properties) {
    let propFiltered = properties.filter(field => {
        if (field.name == 'createdBy' || field.name == 'updatedBy') {
            return false
        }
        return true
    })
    return propFiltered;
}
