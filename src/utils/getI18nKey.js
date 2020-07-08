const descapitalize = require('./descapitalize')
module.exports  = function getI18nKey(moduleName, modelName, fieldName) {
    return descapitalize(moduleName) + '.' + descapitalize(modelName) + '.' + fieldName
}
