const capitalize = require('../generatorUtils/capitalize')

module.exports = function (model) {
    let content =
`<template>
    <v-card class="elevation-6">

        <v-card-title>
            <v-row>
                <v-col class="text-xs-center"><h2>{{title}}</h2></v-col>
            </v-row>
        </v-card-title>

        <v-card-text>
           
           <v-col md6 xs12 class="offset-md6">
            <v-text-field v-model="filter.search" append-icon="search" label="Buscar" hide-details />
           </v-col>

           <v-data-table dense class="mt-3" :headers="headers" :items="items"
                          :search="filter.search" :single-expand="false" :loading="loading">

              <div slot="no-data" color="info" outline class="text-xs-center">Sin datos</div>
               
              <div slot="loading" outline color="info">Cargando</div>

              <template v-slot:item.action="{ item }">
                  <v-icon small class="mr-2" @click="openEdit(item)">edit</v-icon>
              </template>

            </v-data-table>
        </v-card-text>


        <v-dialog :value="creating" width="800" fullscreen persistent>
            <${model.name.toLowerCase()}-create v-if="creating" v-on:itemCreate="itemCreate" v-on:closeDialog="creating=false" />
        </v-dialog>
        
         <v-dialog :value="updating" width="800" persistent>
            <${model.name.toLowerCase()}-update v-if="updating" :item="itemToEdit" v-on:itemUpdate="itemUpdate" v-on:closeDialog="updating=false" />
        </v-dialog>


        <v-btn class="elevation-8" color="#D81B60" fab fixed bottom right dark @click="creating = true">
            <v-icon>add</v-icon>
        </v-btn>

    </v-card>
</template>

<script>
    import ${model.name}Provider from '../providers/${model.name}Provider'
    
    import ${model.name}Create from "./${model.name}Create";
    import ${model.name}Update from "./${model.name}Update";

    export default {
        name: "CovenantList",
        components: {${model.name}Create, ${model.name}Update},
        created() {
            this.loading = true
            ${model.name}Provider.${model.name.toLowerCase()}s().then(r => {
                this.items = r.data.${model.name.toLowerCase()}s
                this.loading = false
            })
        },
        methods: {
            itemCreate(item) {
                this.items.push(item)
            },
            itemUpdate(item) {
                let index = this.items.findIndex(i => i.id == item.id)
                this.$set(this.items, index, item)
            },
            openEdit(item) {
                this.updating = true
                this.itemToEdit = item
            },
            update() {
                this.loading = true
                ${model.name}Provider.${model.name.toLowerCase()}s().then(r => {
                    this.items = r.data.${model.name.toLowerCase()}s
                    this.loading = false
                })
            }
        },
        data() {
            return {
                title: 'Creando ${model.name}',
                creating: false,
                updating: false,
                loading: false,
                expanded: [],
                itemToEdit: null,
                filter: {
                    search: '',
                },
                items: [],
                headers: [
                    ${headers(model.properties)},
                    {text: 'Aciones', value: 'action', sortable: false},
                ],
            }
        }
    }
</script>


`

    return content
}


function headers(properties){

    let content = properties.map(field => {
        return `{text: '${capitalize(field.name)}', value: '${field.name}'}`
    }).join(',\n                    ')
    return content
}
