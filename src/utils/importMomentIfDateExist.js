module.exports = function importMomentIfDateExist(properties) {
    let propFilter = properties.filter(field => {
        if (field.type == 'Date') {
            return true
        }
        return false
    })
    if (propFilter.length > 0) {
        return `import moment from "moment";`
    }
    return ''
}
