module.exports  = function getI18nKey(moduleName, modelName, fieldName) {
    return moduleName.toLowerCase() + '.' + modelName.toLowerCase() + '.' + fieldName
}
