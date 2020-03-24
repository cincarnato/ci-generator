const capitalize = require('../generatorUtils/capitalize')
const filterBackendProperties = require('../generatorUtils/filterBackendProperties')
const componentField = require('../generatorUtils/componentField')
const {generateDataCombos, generateImportCombos, generateMethodsCombos, generateMountedCombos} = require('../generatorUtils/componentFieldCombos')
const importMomentIfDateExist = require('../generatorUtils/importMomentIfDateExist')

module.exports = function (model) {
    let content =
        `<template>
    <v-card>

       <v-toolbar flat dark color="primary">
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn icon dark @click="$emit('closeDialog')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <v-card-text class="pt-3">
            <v-alert v-if="errorMessage" type="error" dense text>{{errorMessage}}</v-alert>
        </v-card-text>

        <v-card-text>
            <v-form ref="form" autocomplete="off" @submit.prevent="save" >

                <v-row>
    
                   ${generateFields(model.properties)}
                    
                </v-row>


            </v-form>
        </v-card-text>


        <v-card-actions>

            <v-btn tile outlined color="grey" @click="$emit('closeDialog')">
                Cerrar
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn color="primary" @click="save" :loading="loading">
                Crear
            </v-btn>

        </v-card-actions>

    </v-card>
</template>

<script>
    import ${model.name}Provider from "../providers/${model.name}Provider";
    import {ClientError} from 'front-module-commons';
    
    //Relations
    ${generateImportCombos(model.properties)}
    
    //Handle Dates
    ${importMomentIfDateExist(model.properties)}

    export default {
        name: "${model.name}Create",
        data() {
            return {
                modal: false,
                title: "Creando ${model.name}",
                errorMessage: '',
                inputErrors: {},
                loading: false,
                form: {
                    ${generateFormObjectFields(model.properties)}
                },
                rules: {
                    required: value => !!value || 'Requerido'
                },
                ${generateDataCombos(model.properties)}
            }
        },
        mounted() {
         ${generateMountedCombos(model.properties)}
        },
        computed: {
             hasErrors() {
                return field => this.inputErrors[field] != undefined
            },
            getMessageErrors() {
                return field => {
                    if (this.inputErrors[field] != undefined) {
                        let message = this.inputErrors[field].message
                        return [message]
                    }
                    return []
                }
            },
        },
        methods: {
            save() {
                if (this.$refs.form.validate()) {
                    this.form.amount = parseFloat(this.form.amount)
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


function generateFields(properties) {
    let propFiltered = filterBackendProperties(properties);

    return propFiltered.map(field => {
        return componentField(field)
    }).join('\n ')

}
