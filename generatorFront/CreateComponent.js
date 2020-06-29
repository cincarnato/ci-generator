const kebabCase = require('../generatorUtils/kebabCase')
const filterBackendProperties = require('../generatorUtils/filterBackendProperties')
const { generateImportCombos, generateMethodsCombos} = require('../generatorUtils/componentFieldCombos')
const importMomentIfDateExist = require('../generatorUtils/importMomentIfDateExist')
const getI18nKey = require('./../generatorUtils/getI18nKey')

module.exports = function (model,moduleName) {
    let content =
        `<template>
    <crud-create :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @create="create"
                 @close="$emit('close')"
    >
        <${kebabCase(model.name)}-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-create>
</template>

<script>

    //Provider
    import ${model.name}Provider from "../providers/${model.name}Provider";
    
    //Common
    import {CrudCreate, ClientError} from '@ci-common-module/frontend'
    
    //Form
    {model.name}Form from "../${model.name}Form";
    
    //Relations
    ${generateImportCombos(model.properties)}
    
    //Handle Dates
    ${importMomentIfDateExist(model.properties)}

    export default {
        name: "${model.name}Create",
         
        components: {GroupForm, CrudCreate},
        
        props:{
          open: {type: Boolean, default: true}
        },
        
        data() {
            return {
                title: this.$t('${getI18nKey(moduleName,model.name,'creating')}'),
                errorMessage: '',
                inputErrors: {},
                loading: false,
                form: {
                    ${generateFormObjectFields(model.properties)}
                }
            }
        },
        
        methods: {
            create() {
                if (this.$refs.form.validate()) {
                    ${model.name}Provider.create${model.name}(this.form).then(r => {
                            if (r) {
                                this.$emit('itemCreate',r.data.${model.name.toLowerCase()}Create)
                                this.$emit('closeDialog')
                            }
                        }
                    ).catch(error => {
                         let clientError = new ClientError(error)
                         this.inputErrors = clientError.inputErrors
                         this.errorMessage = clientError.showMessage
                    })
                }

            },
            ${generateMethodsCombos(model.properties)}

        },
    }
</script>

<style scoped>

</style>

`

return content
}




function generateFormObjectFields(properties) {

    let propFiltered = filterBackendProperties(properties);

    return propFiltered.map(field => {
        switch (field.type) {
            case 'Date':
                return `${field.name}: moment().format("YYYY-MM-DD")`
            case 'String':
                return `${field.name}: ''`
            case 'ObjectId':
                return `${field.name}: null`
            default:
                return `${field.name}: ''`

        }
    }).join(',\n                    ')
}

