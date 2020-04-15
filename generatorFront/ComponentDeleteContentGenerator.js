const kebabCase = require('../generatorUtils/kebabCase')
module.exports = function (model) {
    let content =
        `<template>
    <v-card>

        <v-toolbar flat color="primary">
            <v-toolbar-title class="onPrimary--text">{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn icon color="primary" class="onPrimary--text" @click="$emit('closeDialog')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <v-card-text>
          <${kebabCase(model.name)}-show-data :item="item" />
        </v-card-text>

        <v-card-text>
            <v-alert v-if="errorMessage" type="error" dense text>{{errorMessage}}</v-alert>
        </v-card-text>

        <v-card-text>
            <v-row justify="center">
                <span class="title">{{areYouSure}}</span>
            </v-row>
        </v-card-text>


        <v-card-actions>
            <v-btn color="grey" tile outlined @click="$emit('closeDialog')">
                Cerrar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="remove" :loading="loading">
                Confirmar
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script>
    import ${model.name}ShowData from "./${model.name}ShowData";
     import ${model.name}Provider from "../providers/${model.name}Provider";
     
    export default {
        name: "${model.name}Delete",
        components: {${model.name}ShowData},
        props: {
            item: Object
        },
        data() {
            return {
                modal: false,
                title: "Borrando ${model.name}",
                areYouSure: "¿Esta seguro que desea borrar este registro?",
                errorMessage: '',
                loading: false,
            }
        },
        methods: {
            remove() {
                ${model.name}Provider.delete${model.name}(this.item.id).then(result => {
                            if (result.data.${model.name.toLowerCase()}Delete.deleteSuccess) {
                                this.$emit('itemDelete',result.data.${model.name.toLowerCase()}Delete)
                                this.$emit('closeDialog')
                            }else{
                                this.errorMessage = 'Error on Delete'
                            }
                        }
                    ).catch(err =>{
                    this.errorMessage = err.message
                })
            },
        },
    }
</script>


`

    return content
}
