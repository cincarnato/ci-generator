const kebabCase = require('../../utils/kebabCase')
const getI18nKey = require('../../utils/getI18nKey')

module.exports = function ({model,moduleName}) {
    let content =
        `<template>
    <crud-show :title="title" :open="open"  @close="$emit('close')">

        <v-card-text>
            <${kebabCase(model.name)}-show-data :item="item" />
        </v-card-text>

  </crud-show>
</template>

<script>
    import ${model.name}ShowData from "./${model.name}ShowData";
    import {CrudShow} from '@ci-common-module/frontend'
 
    export default {
        name: "${model.name}Show",
        components: {CrudShow, ${model.name}ShowData},
        props: {
            open: {type: Boolean, default: true},
            item: {type: Object, required: true}
        },
        data() {
            return {
                title: '${getI18nKey(moduleName,model.name,'showing')}',
            }
        },
    }
</script>

`

    return content
}

