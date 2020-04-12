module.exports = function (source) {
    let content = `
const messages = {
    en: {
       ${source.module.toLowerCase()}: {
          ${getModelMessages(source.models, 'en')}
       }
    },
    es: {
       ${source.module.toLowerCase()}: {
          ${getModelMessages(source.models, 'es')}
       }
    },
    pt: {
       ${source.module.toLowerCase()}: {
          ${getModelMessages(source.models, 'pt')}
       }
    }
}

export default messages
    `
    return content
}


function getModelMessages(models, lang) {
    return models.map(model => {
        return `${model.name}: { 
          ${getPropertiesMessages(model.properties, lang)} 
          }`
    }).join(",\n")
}

function getPropertiesMessages(properties, lang) {
    return properties.map(property => {
        return `  ${getPropertyMessage(property, lang)}`
    }).join(",\n          ")
}

function getPropertyMessage(property, lang) {
    return `${property.name}: '${property.i18n[lang]}'`
}
