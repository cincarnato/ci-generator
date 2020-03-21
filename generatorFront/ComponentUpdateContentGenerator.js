const capitalize = require('../generatorUtils/capitalize')
const filterBackendProperties = require('../generatorUtils/filterBackendProperties')
const componentField = require('../generatorUtils/componentField')
const {generateDataCombos, generateImportCombos, generateMethodsCombos, generateMountedCombos} = require('../generatorUtils/componentFieldCombos')


module.exports = function (model) {
    let content =
        `<template>
    <v-card tile>

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

            <v-btn tile outlined color="grey"  @click="$emit('closeDialog')">
                Cerrar
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn  color="primary" @click="save" :loading="loading">
                Modificar
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
        name: "${model.name}Update",
        props: {
            item: Object
        },
        data() {
            return {
                modal: false,
                title: "Modificando ${model.name}",
                errorMessage: '',
                inputError: [],
                loading: false,
                form: {
                     id: this.item.id,
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
                    ${model.name}Provider.update${model.name}(this.form).then(r => {
                            if (r) {
                                this.$emit('itemUpdate',r.data.${model.name.toLowerCase()}Update)
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

function importMomentIfDateExist(properties){
    let propFilter = properties.filter(field => {
        if(field.type == 'Date'){
            return true
        }
        return false
    })
    if(propFilter.length > 0){
        return `import moment from "moment";`
    }
    return ''
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



function generateFields(properties) {
    let propFiltered = filterBackendProperties(properties);

    return propFiltered.map(field => {
        return componentField(field)
    }).join('\n ')

}
