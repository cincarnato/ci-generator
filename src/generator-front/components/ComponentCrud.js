const capitalize = require('../../utils/capitalize')
const getI18nKey = require('../../utils/getI18nKey')
const kebabCase = require('../../utils/kebabCase')

module.exports = function ({model, moduleName}) {
    let content =
        `<template>
<crud-layout title="group.title" subtitle="group.description">

        <template v-slot:list>
            <${kebabCase(model.name)}-list :items="items"
                       :totalItems="totalItems"
                       :loading="loading"
                       :headers="headers"
                       @fetch="fetch"
                       @update="update"
                       @delete="remove"
                       @show="show"
            
            />
        </template>
        
         <add-button @click="create"></add-button>
      
        <${kebabCase(model.name)}-create v-if="creating" 
                        :open="creating"
                        v-on:itemCreated="onItemCreated" 
                        v-on:close="creating=false" 
        />
        
        <${kebabCase(model.name)}-update v-if="updating" 
                        :open="updating"
                        :item="itemToEdit" 
                        v-on:itemUpdated="onItemUpdated" 
                        v-on:close="updating=false" 
        />
          
        <${kebabCase(model.name)}-show v-if="showing" 
                           :open="showing" 
                           :item="itemToShow"  
                           v-on:close="showing=false" 
         />

        <${kebabCase(model.name)}-delete v-if="deleting" 
                         :open="deleting"
                         :item="itemToDelete"  
                         v-on:itemDeleted="onItemDeleted" 
                         v-on:close="deleting=false" 
        />

        <snackbar :message="flash"/>

</crud-layout>
</template>

<script>
    import ${model.name}Provider from '../../../providers/${model.name}Provider'
    
    import ${model.name}Create from "../${model.name}Create";
    import ${model.name}Update from "../${model.name}Update";
    import ${model.name}Delete from "../${model.name}Delete";
    import ${model.name}Show from "../${model.name}Show";
    import ${model.name}List from "../${model.name}List";
    
     import {CrudLayout, AddButton, Snackbar} from "@ci-common-module/frontend"
     
    export default {
        name: "${model.name}Crud",
        components: {
            CrudLayout, AddButton, Snackbar,
            ${model.name}Create, 
            ${model.name}Update, 
            ${model.name}Delete, 
            ${model.name}Show,
            ${model.name}List
        },
        created() {
            this.fetch()
        },
        methods: {
            //On
            onItemCreated(item) {
                this.items.push(item)
                this.totalItems++
            },
            onItemUpdated(item) {
                let index = this.items.findIndex(i => i.id == item.id)
                this.$set(this.items, index, item)
            },
            onItemDeleted(item) {
                let index = this.items.findIndex(i => i.id == item.id)
                this.items.splice(index, 1)
                this.totalItems--
            },
            //Open
            create() {
                this.creating = true
            },
            update(item) {
                this.updating = true
                this.itemToEdit = item
            },
            show(item) {
                this.showing = true
                this.itemToShow = item
            },
            remove(item) {
                this.deleting = true
                this.itemToDelete = item
            },
            //Fetch Items 
            fetch(options = {
                          pageNumber: 1,
                          itemsPerPage: 5,
                          search: '',
                          orderBy: null,
                          orderDesc: false
                      }) {
                this.loading = true
                ${model.name}Provider.paginate${model.name}s(
                    options.pageNumber, 
                    options.itemsPerPage,
                    options.search,
                    options.orderBy, 
                    options.orderDesc
                ).then(r => {
                    this.items = r.data.${model.name.toLowerCase()}sPaginate.items
                    this.totalItems = r.data.${model.name.toLowerCase()}sPaginate.totalItems
                    this.loading = false
                })
            }
        },
        data() {
            return {
                title: this.$t('${getI18nKey(moduleName,model.name,'title')}'),
                flash: null,
                creating: false,
                updating: false,
                deleting: false,
                showing: false,
                loading: false,
                itemToEdit: null,
                itemToDelete: null,
                itemToShow: null,
                filter: {
                    search: '',
                },
                items: [],
                headers: [
                    ${headers(model.properties, model.name, moduleName)},
                    {text: this.$t('common.actions'), value: 'action', sortable: false},
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
