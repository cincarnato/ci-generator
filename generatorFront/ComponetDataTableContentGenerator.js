const capitalize = require('../generatorUtils/capitalize')

module.exports = function (model, moduleName) {
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
            <v-text-field v-model="filter.search" v-on:keyup.native.enter="updatePage" append-icon="search" label="Buscar" hide-details />
           </v-col>

           <v-data-table dense class="mt-3" :headers="headers" :items="items"
                         :search="filter.search" :single-expand="false" :loading="loading"
                         :server-items-length="totalItems" 
                         :items-per-page.sync="limit" :page.sync="pageNumber" 
                         :sort-by.sync="orderBy" :sort-desc.sync="orderDesc"
                         @update:page="updatePage" @update:items-per-page="updatePage"
                          @update:sort-by="updatePage" @update:sort-desc="updatePage"
                          >

              <div slot="no-data" color="info" outline class="text-xs-center">Sin datos</div>
               
              <div slot="loading" outline color="info">Cargando</div>

              <template v-slot:item.action="{ item }">
                  <v-icon color="info" small class="mr-2" @click="openShow(item)">search</v-icon>
                  <v-icon color="primary" small class="mr-2" @click="openEdit(item)">edit</v-icon>
                  <v-icon color="red" small class="mr-2" @click="openDelete(item)">delete</v-icon>
              </template>

            </v-data-table>
        </v-card-text>


        <v-dialog :value="showing" width="850" fullscreen persistent>
            <${model.name.toLowerCase()}-show :item="itemToShow" v-if="showing"  v-on:closeDialog="showing=false" />
        </v-dialog>
        
        <v-dialog :value="deleting" width="850" fullscreen persistent>
            <${model.name.toLowerCase()}-delete :item="itemToDelete" v-if="deleting" v-on:itemDelete="updatePage" v-on:closeDialog="deleting=false" />
        </v-dialog>

        <v-dialog :value="creating" width="850" fullscreen persistent>
            <${model.name.toLowerCase()}-create v-if="creating" v-on:itemCreate="itemCreate" v-on:closeDialog="creating=false" />
        </v-dialog>
        
         <v-dialog :value="updating" width="850" persistent>
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
    import ${model.name}Delete from "./${model.name}Delete";
    import ${model.name}Show from "./${model.name}Show";
    
    export default {
        name: "${model.name}DataTable",
        components: {${model.name}Create, ${model.name}Update, ${model.name}Delete, ${model.name}Show},
        created() {
            this.updatePage()
        },
        methods: {
            itemCreate(item) {
                this.items.push(item)
                this.totalItems++
            },
            itemUpdate(item) {
                let index = this.items.findIndex(i => i.id == item.id)
                this.$set(this.items, index, item)
            },
            openEdit(item) {
                this.updating = true
                this.itemToEdit = item
            },
            openShow(item) {
                this.showing = true
                this.itemToShow = item
            },
            openDelete(item) {
                this.deleting = true
                this.itemToDelete = item
            },
            update() {
                this.loading = true
                ${model.name}Provider.${model.name.toLowerCase()}s().then(r => {
                    this.items = r.data.${model.name.toLowerCase()}s
                    this.loading = false
                })
            },
            updatePage() {
                this.loading = true
                ${model.name}Provider.paginate${model.name}s(this.limit, this.pageNumber, this.filter.search, this.getOrderBy, this.getOrderDesc).then(r => {
                    this.items = r.data.${model.name.toLowerCase()}sPaginate.items
                    this.totalItems = r.data.${model.name.toLowerCase()}sPaginate.totalItems
                    this.loading = false
                })
            }
        },
        computed: {
          getOrderBy(){
              return  (Array.isArray(this.orderBy)) ? this.orderBy[0]: this.orderBy
          },
          getOrderDesc(){
              return  (Array.isArray(this.orderDesc)) ? this.orderDesc[0]: this.orderDesc
          } 
        },
        data() {
            return {
                title: 'Listado de ${model.name}',
                creating: false,
                updating: false,
                deleting: false,
                showing: false,
                loading: false,
                expanded: [],
                itemToEdit: null,
                itemToDelete: null,
                itemToShow: null,
                filter: {
                    search: '',
                },
                items: [],
                headers: [
                    ${headers(model.properties, model.name, moduleName)},
                    {text: 'Aciones', value: 'action', sortable: false},
                ],
                totalItems: 0,
                limit: 5,
                pageNumber: 1,
                orderBy: null,
                orderDesc: false
            }
        }
    }
</script>


`

    return content
}


function headers(properties, modelName, moduleName) {

    let content = properties.map(field => {
        return `{text: this.$t('${getI18nKey(moduleName,modelName,field.name)}'), value: '${field.name}'}`
    }).join(',\n                    ')
    return content
}

function getI18nKey(moduleName, modelName, fieldName) {
    return moduleName.toLowerCase() + '.' + modelName.toLowerCase() + '.' + fieldName.toLowerCase()
}
