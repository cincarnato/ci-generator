module.exports = function (model) {
    let content =
        `<template>
    <v-card>

        <v-card-title class="title" primary-title>
            <span>{{title}}</span>
        </v-card-title>

        <v-card-text>
            <v-alert v-if="errorMessage" type="error" dense text>{{errorMessage}}</v-alert>
        </v-card-text>

        <v-card-text>
            <v-form ref="form" autocomplete="off">

                <v-row>
    
                   ${generateFields(model.properties)}
                    
                </v-row>


            </v-form>
        </v-card-text>


        <v-card-actions>

            <v-btn rounded color="grey" text @click="$emit('closeDialog')">
                Cerrar
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn rounded color="primary" @click="save" :loading="loading">
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


function capitalize(name){
    return name.charAt(0).toUpperCase() + name.slice(1)
}

function filterBackendProperties(properties) {
    let propFiltered = properties.filter(field => {
        if (field.name == 'createdBy' || field.name == 'updatedBy' || field.name == 'createdAt' || field.name == 'updatedAt') {
            return false
        }
        return true
    })
    return propFiltered;
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

function generateDataCombos(properties) {

    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return `${field.name}s: []`
    }).join(',\n')
}


function generateImportCombos(properties) {

    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return `import ${capitalize(field.name)}Provider from "../providers/${capitalize(field.name)}Provider";`
    }).join('\n')
}

function generateMountedCombos(properties) {

    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return `this.fetch${capitalize(field.name)}s()`
    }).join('\n')
}




function generateMethodsCombos(properties) {
    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return generateMethodsCombo(field)
    }).join(',\n')
}

function generateMethodsCombo(field){
    let content =
        `
            fetch${capitalize(field.name)}s(){
                this.loading= true
                ${capitalize(field.name)}Provider.${field.name.toLowerCase()}s().then(r => {
                    this.${field.name.toLowerCase()}s = r.data.${field.name.toLowerCase()}s
                    this.loading = false
                })
            }
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



function generateFields(properties) {
    let propFiltered = filterBackendProperties(properties);

    return propFiltered.map(field => {
        switch (field.type) {
            case 'Date':
                return generateDateField(field)
            case 'String':
                return generateTextField(field)
            case 'ObjectId':
                return generateComboField(field)
            default:
                return generateTextField(field)

        }
    }).join('\n ')

}

function generateTextField(field) {
    let content = `
                    <v-col cols="12" sm="6">
                        <v-text-field
                                prepend-icon="account_box"
                                name="${field.name}"
                                label="${field.name}"
                                type="text"
                                v-model="form.${field.name}"
                                placeholder="${field.name}"
                                class="pa-3"
                                :rules="[rules.required]"
                                :error="hasErrors('${field.name}')"
                                :error-messages="getMessageErrors('${field.name}')"
                                required
                        ></v-text-field>
                    </v-col>
    `
    return content
}


function generateComboField(field) {
    let content = `
                     <v-col cols="12" sm="6">
                        <v-select
                                prepend-icon="account_box"
                                class="pa-3"
                                :items="${field.name}s"
                                :item-text="'name'"
                                :item-value="'id'"
                                v-model="form.${field.name}"
                                label="${field.name}"
                                :loading="loading"
                                :rules="[rules.required]"
                                :error="hasErrors('${field.name}')"
                                :error-messages="getMessageErrors('${field.name}')"
                                required
                        ></v-select>
                    </v-col>
    `
    return content
}


function generateDateField(field) {
    let content = `
                   <v-col cols="12" sm="6">
                        <v-menu
                                v-model="modal"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        class="pa-3"
                                        v-model="form.${field.name}"
                                        label="${field.name}"
                                        prepend-icon="event"
                                        readonly
                                        hide-details
                                        v-on="on"
                                        :rules="[rules.required]"
                                        :error="hasErrors('${field.name}')"
                                        :error-messages="getMessageErrors('${field.name}')"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="form.${field.name}" scrollable @input="modal =false">
                            </v-date-picker>
                        </v-menu>

                    </v-col>
    `
    return content
}
