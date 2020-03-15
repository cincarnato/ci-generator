module.exports = function (model) {
let content =
`import graphqlClient from "../../../apollo";

class ${model.name}Provider {


    ${model.name.toLowerCase()}s() {
        return graphqlClient.query({query: require('./gql/${model.name.toLowerCase()}s.graphql')})
    }

    ${model.name.toLowerCase()}(id) {
        return graphqlClient.query({
            query: require('./gql/${model.name.toLowerCase()}.graphql'),
            variables: {id:id}
        })
    }

    create${model.name}(form) {
        return graphqlClient.mutate({
            mutation: require('./gql/${model.name.toLowerCase()}Create.graphql'),
            variables: form
        })
    }
    
    update${model.name}(form) {
        return graphqlClient.mutate({
            mutation: require('./gql/${model.name.toLowerCase()}Update.graphql'),
            variables: form
        })
    }

}

export default new ${model.name}Provider()


`

    return content
}
