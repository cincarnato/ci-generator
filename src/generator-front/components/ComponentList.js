const getI18nKey = require('../../utils/getI18nKey')
const pluralize = require('../../utils/pluralize')
const capitalize = require('../../utils/capitalize')
const descapitalize = require('../../utils/descapitalize')

module.exports = function ({model, moduleName}) {
    let content =
        `<template>
 <v-row row wrap>

    <v-col cols="12" sm="6" md="4" offset-md="8" offset-sm="6">
        <search-input  @search="performSearch" v-model="search" />
    </v-col>

    <v-col cols="12">

       <v-data-table
                class="mt-3"
                :headers="headers"
                :items="items"
                :search="search"
                :single-expand="false"
                :server-items-length="totalItems"
                :loading="loading"
                :page.sync="pageNumber"
                :items-per-page.sync="itemsPerPage"
                :sort-by.sync="orderBy"
                :sort-desc.sync="orderDesc"
                :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50] }"
                @update:page="fetch"
                @update:sort-by="fetch"
                @update:sort-desc="fetch"
                @update:items-per-page="fetch"
        >

           <template slot="no-data">
                <div class="text-xs-center" v-t="'common.noData'"></div>
            </template>

            <template slot="loading">
                <div   class="text-xs-center" v-t="'common.loading'"></div>
            </template>

             <template v-slot:item.action="{ item }">
                <show-button  @click="$emit('show', item)" />
                <edit-button  @click="$emit('update', item)" />
                <delete-button @click="$emit('delete', item)" />
            </template>

        </v-data-table>
    </v-col>
</v-row>
</template>

<script>
   import ${model.name}Provider from "../../../providers/${model.name}Provider";
   
   import {DeleteButton, EditButton, ShowButton, SearchInput} from "@ci-common-module/frontend"
    
    export default {
        name: "${model.name}List",
        components: {DeleteButton, EditButton, ShowButton, SearchInput},
        data() {
            return {
                items: [],
                totalItems: null,
                loading: false,
                orderBy: null,
                orderDesc: false,
                itemsPerPage: 5,
                pageNumber: 1,
                search: '',
                headers: [
                    //Entity Headers
                    ${headers(model.properties, model.name, moduleName)},
                    //Actions
                    {text: this.$t('common.actions'), value: 'action', sortable: false},
                ],
            }
        },
        created() {
            this.fetch()
        },
        methods:{
            performSearch(){
                this.pageNumber = 1
                this.fetch()
            },
            fetch() {
                this.loading = true
                ${model.name}Provider.paginate${pluralize(capitalize(model.name))}(
                    this.pageNumber, 
                    this.itemsPerPage,
                    this.search,
                    this.getOrderBy, 
                    this.getOrderDesc
                ).then(r => {
                    this.items = r.data.${descapitalize(model.name)}Paginate.items
                    this.totalItems = r.data.${descapitalize(model.name)}Paginate.totalItems
                }).catch(err => {
                    console.error(err)
                }).finally(() => this.loading = false)
            }
        },
        computed: {
          getOrderBy(){
              return  (Array.isArray(this.orderBy)) ? this.orderBy[0]: this.orderBy
          },
          getOrderDesc(){
              return  (Array.isArray(this.orderDesc)) ? this.orderDesc[0]: this.orderDesc
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
