const getI18nKey = require('../../utils/getI18nKey')
const kebabCase = require('../../utils/kebabCase')

module.exports = function ({model, moduleName}) {
    let content =
        `<template>
<crud-layout :title="title" :subtitle="subtitle">

        <template v-slot:list>
            <${kebabCase(model.name)}-list 
                       ref="list"
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
        data() {
            return {
                title: '${getI18nKey(moduleName,model.name,'title')}',
                subtitle: '${getI18nKey(moduleName,model.name,'subtitle')}',
                flash: null,
                creating: false,
                updating: false,
                deleting: false,
                showing: false,
                itemToEdit: null,
                itemToDelete: null,
                itemToShow: null,
            }
        },
        methods: {
            //On
            onItemCreated() {
                this.$refs.list.fetch()
                this.flash= "common.created"
            },
            onItemUpdated() {
                this.$refs.list.fetch()
                this.flash= "common.updated"
            },
            onItemDeleted() {
                this.$refs.list.fetch()
                this.flash= "common.deleted"
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
            }
        }
        
    }
</script>


`

    return content
}
