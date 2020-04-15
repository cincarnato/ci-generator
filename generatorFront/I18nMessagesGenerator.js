module.exports = function (source) {
    let content = `
const messages = {
    en: {
       ${source.module}: {
          ${getModelMessages(source.models, 'en')}
       }
    },
    es: {
       ${source.module}: {
          ${getModelMessages(source.models, 'es')}
       }
    },
    pt: {
       ${source.module}: {
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
          ${getPropertiesMessages(model.properties, lang)},
          ${getAditionalMessages(model.i18n,lang)}
          }`
    }).join(",\n")
}

function getAditionalMessages(aditionals, lang) {
    return aditionals.map(aditional => {
        return `  ${getPropertyMessage(aditional, lang)}`
    }).join(",\n          ")
}

function getPropertiesMessages(properties, lang) {
    return properties.map(property => {
        return `  ${getPropertyMessage(property, lang)}`
    }).join(",\n          ")
}

function getPropertyMessage(property, lang) {
    return `${property.name}: '${property.i18n[lang]}'`
}
