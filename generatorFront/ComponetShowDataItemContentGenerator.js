module.exports = function (model) {
    let content =
        `<template>
    <v-list-item>
        <v-list-item-icon class="mr-5">
            <v-icon color="primary">{{icon}}</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="mr-0">
            <v-list-item-title>{{item}}</v-list-item-title>
            <v-list-item-subtitle>{{label}}</v-list-item-subtitle>
        </v-list-item-content>
    </v-list-item>
</template>
<script>
    export default {
        name: '${model.name}ShowItem',
        props: {
            item: String,
            label: String,
            icon: String
        }
    }
</script>


`

    return content
}
