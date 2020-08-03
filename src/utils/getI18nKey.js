const descapitalize = require('./descapitalize')
module.exports  = function getI18nKey(moduleName, modelName, fieldName, labels = false) {
    if(labels){
        return descapitalize(moduleName) + '.' + descapitalize(modelName) + '.labels.' + fieldName

    }else{
        return descapitalize(moduleName) + '.' + descapitalize(modelName) + '.' + fieldName

    }

}
