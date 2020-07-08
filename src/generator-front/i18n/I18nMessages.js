const descapitalize = require('../../utils/descapitalize')

module.exports = function (source) {
    let content = `
const messages = {
    en: {
       ${descapitalize(source.module)}: {
          ${getModelMessages(source.models, 'en')}
       }
    },
    es: {
       ${descapitalize(source.module)}: {
          ${getModelMessages(source.models, 'es')}
       }
    },
    pt: {
       ${descapitalize(source.module)}: {
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
        return `${descapitalize(model.name)}: { 
          ${getTitlesMessages(model, lang)},
          ${getPropertiesMessages(model.properties, lang)},
          ${geti18nMessages(model, lang)}
          }`
    }).join(",\n")
}

function geti18nMessages(model, lang) {
    if(model.i18n){
        return aditionals.map(aditional => {
            return `  ${getPropertyMessage(aditional, lang)}`
        }).join(",\n          ")
    }
    return ''
}


function getPropertiesMessages(properties, lang) {
    return properties.map(property => {
        return `  ${getPropertyMessage(property, lang)}`
    }).join(",\n          ")
}

function getPropertyMessage(property, lang) {
    return `${property.name}: '${property.i18n[lang]}'`
}

function getTitlesMessages(model, lang) {

    const titles = {
        en: {
            title: model.name + ' management',
            subtitle: 'View, search, create, edit and delete ' + model.name,
            creating: 'Creating ' + model.name,
            editing: 'Editing ' + model.name,
            deleting: 'Deleting ' + model.name,
            showing: 'Showing ' + model.name,
        },
        es: {
            title: 'Administración de ' + model.name,
            subtitle: 'Ver, buscar, crear, editar, y borrar ' + model.name,
            creating: 'Creando '+ model.name,
            editing: 'Modificando '+ model.name,
            deleting: 'Eliminando '+ model.name,
            showing: 'Detalles de '+ model.name,
        },
        pt: {
            title: 'Administração de ' + model.name,
            subtitle: 'Ver, buscar, criar, editar e usar ' + model.name,
            creating: 'Criando '+ model.name,
            editing: 'Edição '+ model.name,
            deleting: 'Apagando '+ model.name,
            showing: 'Detalhes do '+ model.name,
        },
    }

    return `   title: '${ titles[lang].title}',
            subtitle: '${ titles[lang].subtitle}',
            creating: '${titles[lang].creating }',
            editing: '${titles[lang].editing}',
            deleting: '${titles[lang].deleting}',
            showing: '${titles[lang].showing}'`
}

