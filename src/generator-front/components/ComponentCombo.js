const capitalize = require('../../utils/capitalize')
const descapitalize = require('../../utils/descapitalize')
const pluralize = require('../../utils/pluralize')
const getI18nKey = require('../../utils/getI18nKey')

module.exports = function ({field, model, moduleName}) {
    let content =
`<template>
    <v-col cols="12" sm="6">
        <v-select
                prepend-icon="${field.icon ? field.icon : 'label'}"
                :items="items"
                :item-text="'name'"
                :item-value="'id'"
                v-model="item"
                :label="$t('${getI18nKey(moduleName,model.name,field.name)}')"
                :loading="loading"
                :error="hasInputErrors('${field.name}')"
                :error-messages="getInputErrors('${field.name}')"
                color="secondary"
                item-color="secondary"
                ${field.required?':rules="required"':''}
        ></v-select>
    </v-col>
</template>

<script>

    import {InputErrorsByProps, RequiredRule} from '@ci-common-module/frontend'
    
    import ${capitalize(field.ref)}Provider from "../../../providers/${capitalize(field.ref)}Provider"
    

    export default {
        name: "${model.name}Form",
        mixins: [InputErrorsByProps, RequiredRule],
        props:{
            value: {
                type: String
            },
        },
        data() {
            return {
                items: [],
                loading: false
            }
        },
        computed: {
           item: {
                get() { return this.value },
                set(val) {this.$emit('input', val)}
            }
        },
        mounted() {
         this.fetch()
        },
        methods: {
            validate(){
              return this.$refs.form.validate()
            },
            fetch(){
                this.loading= true
                ${capitalize(field.ref)}Provider.fetch${capitalize(pluralize(field.ref))}().then(r => {
                    this.items = r.data.${descapitalize(field.ref)}Fetch
                }).catch(err => console.error(err))
                .finally(()=> this.loading = false)
              
            }
            
        }
    }
</script>

<style scoped>

</style>

`

return content
}

