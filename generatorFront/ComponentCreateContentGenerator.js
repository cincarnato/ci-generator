const capitalize = require('../generatorUtils/capitalize')
const filterBackendProperties = require('../generatorUtils/filterBackendProperties')
const componentField = require('../generatorUtils/componentField')
const {generateDataCombos, generateImportCombos, generateMethodsCombos, generateMountedCombos} = require('../generatorUtils/componentFieldCombos')

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

        <v-card-text>
            <v-alert v-if="errorMessage" type="error" dense text>{{errorMessage}}</v-alert>
        </v-card-text>

        <v-card-text>
            <v-form ref="form" autocomplete="off" v-on:keyup.native.enter="save">

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
                inputError: [],
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
            hasErrors: (state) => (field) => {
                return state.inputError[field] != undefined
            },
            getMessageErrors: (state) => (field) => {
                if (state.inputError[field] != undefined) {
                    let message = state.inputError[field].message
                    return [message]
                }
                return []

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
                    )
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




function importMomentIfDateExist(properties) {
    let propFilter = properties.filter(field => {
        if (field.type == 'Date') {
            return true
        }
        return false
    })
    if (propFilter.length > 0) {
        return `import moment from "moment";`
    }
    return ''
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
