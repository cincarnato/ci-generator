const getI18nKey = require('../../utils/getI18nKey')
module.exports = function ({model, moduleName}) {
    let columns = distribute(model.properties)
    let content =
        `<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
            <v-list>
                ${getItems(model, columns[1], moduleName)}
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                ${getItems(model, columns[2], moduleName)}
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                ${getItems(model, columns[3], moduleName)}
            </v-list>
        </v-col>

    </v-row>
</template>
<script>
    import {ShowField} from '@ci-common-module/frontend'
    
    export default {
        name: '${model.name}ShowData',
        components: {ShowField},
        props: {
            item: {type: Object, required: true}
        }
    }
</script>

`

    return content
}


function distribute(properties) {

    let columnNum = 1
    let columns = {1: [], 2: [], 3: []}
    properties.forEach(prop => {
        columns[columnNum].push(prop)
        columnNum++
        if (columnNum > 3) {
            columnNum = 1
        }
    })
    return columns
}


function getItems(model, column, moduleName) {

    return column.map(field => {
        return ` <show-field :value="item.${field.name}" :label="$t('${getI18nKey(moduleName,model.name, field.name)}')" icon="${field.icon}"/>`
    }).join('\n                ')
}
