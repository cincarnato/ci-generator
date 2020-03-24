module.exports = function (model) {
    let columns = distribute(model.properties)
    let content =
        `<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
            <v-list>
                ${getItems(model, columns[1])}
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                ${getItems(model, columns[2])}
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                ${getItems(model, columns[3])}
            </v-list>
        </v-col>

    </v-row>
</template>
<script>
    import ${model.name}ShowItem from "./${model.name}ShowDataItem"

    export default {
        name: '${model.name.toLowerCase()}-show-data',
        components: {${model.name}ShowItem},
        props: {
            item: {}
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


function getItems(model, column) {

    return column.map(field => {
        return ` <${model.name.toLowerCase()}-show-item :item="item.${field.name}" label="${field.label}" icon="${field.icon}"/>`
    }).join('\n                ')
}