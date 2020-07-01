const kebabCase = require('../../utils/kebabCase')
const filterBackendProperties = require('../../utils/filterBackendProperties')
const { generateImportCombos, generateMethodsCombos} = require('../../utils/componentFieldCombos')
const importMomentIfDateExist = require('../../utils/importMomentIfDateExist')
const getI18nKey = require('../../utils/getI18nKey')

module.exports = function ({model,moduleName}) {
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

    import ${model.name}Provider from "../../../providers/${model.name}Provider";
    
    import {CrudCreate, ClientError} from '@ci-common-module/frontend'
    
    import ${model.name}Form from "../${model.name}Form";
    
    ${generateImportCombos(model.properties)}
    
    ${importMomentIfDateExist(model.properties)}

    export default {
        name: "${model.name}Create",
         
        components: { ${model.name}Form, CrudCreate },
        
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
                                this.$emit('itemCreated',r.data.${model.name.toLowerCase()}Create)
                                this.$emit('close')
                            }
                        }
                    ).catch(error => {
                         let clientError = new ClientError(error)
                         this.inputErrors = clientError.inputErrors
                         this.errorMessage = clientError.i18nMessage
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

