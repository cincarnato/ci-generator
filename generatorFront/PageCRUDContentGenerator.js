const kebabCase = require('../generatorUtils/kebabCase')
module.exports = function (model) {
    let content =
`<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <${kebabCase(model.name)}-data-table />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import ${model.name}DataTable from "../components/${model.name}DataTable";
    export default {
        name: "${model.name}",
        components: {${model.name}DataTable}
    }
</script>

<style scoped>

</style>

`

    return content
}
