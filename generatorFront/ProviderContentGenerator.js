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
    
    ${findBy(model)}

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


function findBy(model){
    let properties = model.properties.filter(field => field.findby == true)

    return properties.map(field => {
        return findByMethod(model,field)
    }).join('\n')
}

function findByMethod(model, field){
    let content =
`${model.name.toLowerCase()}sBy${capitalize(field.name)}(${field.name}) {
        return graphqlClient.query({
            query: require('./gql/${model.name.toLowerCase()}sBy${capitalize(field.name)}.graphql'),
            variables: {${field.name}}
        })
    }
`
    return content
}

function capitalize(name){
    return name.charAt(0).toUpperCase() + name.slice(1)
}
