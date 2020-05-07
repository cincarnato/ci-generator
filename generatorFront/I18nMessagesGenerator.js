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
            title: '',
            creating: 'Creating ',
            editing: 'Editing ',
            deleting: 'Deleting ',
            areYouSure: 'Are you sure you want to blur this record?'
        },
        es: {
            title: '',
            creating: 'Creando ',
            editing: 'Modificando ',
            deleting: 'Eliminando ',
            areYouSure: '¿Esta seguro que desea borrar este registro?'
        },
        pt: {
            title: '',
            creating: 'Criando ',
            editing: 'Edição ',
            deleting: 'Apagando ',
            areYouSure: 'Tem certeza de que deseja excluir este registro?'
        },
    }

    return `  title: '${ titles[lang].title + (model.namei18n?model.namei18n[lang]:model.name) }',
            creating: '${titles[lang].creating + (model.namei18n?model.namei18n[lang]:model.name) }',
            editing: '${titles[lang].editing + (model.namei18n?model.namei18n[lang]:model.name) }',
            deleting: '${titles[lang].deleting + (model.namei18n?model.namei18n[lang]:model.name) }''`
}

