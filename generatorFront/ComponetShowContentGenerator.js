module.exports = function (model) {
    let content =
        `<template>
    <v-card>

        <v-toolbar  flat color="primary">
            <v-toolbar-title class="onPrimary--text">{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn icon color="primary" class="onPrimary--text" @click="$emit('closeDialog')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <v-card-text>
            <${model.name.toLowerCase()}-show-data :item="item" />
        </v-card-text>


        <v-card-actions>
            <v-btn color="grey" tile outlined @click="$emit('closeDialog')">
                Cerrar
            </v-btn>
            <v-spacer></v-spacer>
        </v-card-actions>

    </v-card>
</template>

<script>
    import ${model.name}ShowData from "./${model.name}ShowData";

    export default {
        name: "${model.name}Show",
        components: {${model.name}ShowData},
        props: {
            item: Object
        },
        data() {
            return {
                title: "Detalles de ${model.name}",
            }
        },
    }
</script>

`

    return content
}

