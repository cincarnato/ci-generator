const kebabCase = require('../../utils/kebabCase')
const filterBackendProperties = require('../../utils/filterBackendProperties')
const {generateDataCombos, generateImportCombos, generateMethodsCombos} = require('../../utils/componentFieldCombos')
const importMomentIfDateExist = require('../../utils/importMomentIfDateExist')
const getI18nKey = require('../../utils/getI18nKey')

module.exports = function ({model,moduleName}) {
    let content =
        `<template>
        <crud-update :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @update="update"
                 @close="$emit('close')"
    >
         <${kebabCase(model.name)}-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-update>
</template>

<script>

    import ${model.name}Provider from "../../../providers/${model.name}Provider";
    
    import {CrudUpdate, ClientError} from '@ci-common-module/frontend'
    
    import ${model.name}Form from "../${model.name}Form";
  
    ${generateImportCombos(model.properties)}
    
    ${importMomentIfDateExist(model.properties)}

    export default {
        name: "${model.name}Update",
        
        components: { ${model.name}Form, CrudUpdate },
        
        props:{
          open: {type: Boolean, default: true},
          item: {type: Object, required: true}
        },

        data() {
            return {
                title: this.$t('${getI18nKey(moduleName,model.name,'editing')}'),
                errorMessage: '',
                inputErrors: {},
                loading: false,
                form: {
                     id: this.item.id,
                    ${generateFormObjectFields(model.properties)}
                },
                ${generateDataCombos(model.properties)}
            }
        },
        methods: {
            update() {
                if (this.$refs.form.validate()) {
                    ${model.name}Provider.update${model.name}(this.form).then(r => {
                            if (r) {
                                this.$emit('itemUpdated',r.data.${model.name.toLowerCase()}Update)
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
        switch(field.type){
            case 'Date':
                return `${field.name}: moment(parseInt(this.item.${field.name})).format('YYYY-MM-DD')`
            case 'ObjectId':
                return `${field.name}: this.item.${field.name}.id`
            default:
                return `${field.name}: this.item.${field.name}`
        }
    }).join(',\n                    ')
}
