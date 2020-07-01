const kebabCase = require('../../../generatorUtils/kebabCase')
module.exports = function (model) {
    let content =
`<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <${kebabCase(model.name)}-crud />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import ${model.name}Crud from "../components/${model.name}Crud";
    export default {
        name: "${model.name}",
        components: {${model.name}Crud}
    }
</script>

<style scoped>

</style>

`

    return content
}
