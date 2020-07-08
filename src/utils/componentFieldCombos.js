const capitalize = require('./capitalize')
const descapitalize = require('./descapitalize')
const pluralize = require('./pluralize')

module.exports.generateComboField = function (field, modelName, moduleName) {
    let content = `
                     <v-col cols="12" sm="6">
                        <v-select
                                prepend-icon="${field.icon ? field.icon : 'label'}"
                                :items="${field.name.toLowerCase()}s"
                                :item-text="'name'"
                                :item-value="'id'"
                                v-model="form.${field.name}"
                                :label="$t('${getI18nKey(moduleName, modelName, field.name)}')"
                                :loading="loading"
                                :error="hasInputErrors('${field.name}')"
                                :error-messages="getInputErrors('${field.name}')"
                                color="secondary"
                                item-color="secondary"
                                ${field.required ? ':rules="required"' : ''}
                        ></v-select>
                    </v-col>
    `
    return content
}

module.exports.generateDataCombos = function generateDataCombos(properties) {

    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return `${field.name.toLowerCase()}s: []`
    }).join(',\n')
}


module.exports.generateImportCombos = function generateImportCombos(properties) {

    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return `import ${capitalize(field.ref)}Combobox from "./${capitalize(field.ref)}Combobox";`
    }).join('\n')
}

module.exports.generateImportComponentCombos = function generateImportCombos(properties) {

    let propFiltered = filterObjectIdProperties(properties);

    let combos = propFiltered.map(field => {
        return `${capitalize(field.ref)}Combobox`
    }).join(',\n')
    if(combos.length > 0){
        return "components: {" + combos + "},"
    }
    return ''
}

module.exports.generateMountedCombos = function generateMountedCombos(properties) {

    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return `this.fetch${capitalize(field.ref)}s()`
    }).join('\n')
}


module.exports.generateMethodsCombos = function generateMethodsCombos(properties) {
    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return generateMethodCombo(field)
    }).join(',\n')
}

function generateMethodCombo(field) {
    let content =
        `
            fetch${capitalize(field.name)}s(){
                this.loading= true
                ${capitalize(field.ref)}Provider.${descapitalize(field.ref)}Fetch().then(r => {
                    this.${descapitalize(pluralize(field.ref))} = r.data.${descapitalize(field.ref)}Fetch
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
