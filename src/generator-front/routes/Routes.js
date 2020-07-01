module.exports = function (models) {
    let content =
`${getImportPages(models)}

const routes = [
    ${getRoutesPages(models)}
]

export default routes;
`
    return content
}

function getImportPages(models) {
    return models.map(model => {
        return `import ${model.name + 'ManagementPage'} from '../pages/${model.name + 'ManagementPage'}'`
    }).join("\n")
}

function getRoutesPages(models) {
    return models.map(model => {
        return ` {name: '${model.name + 'ManagementPage'}', path: '/${model.name.toLowerCase()}-management', component: ${model.name + 'ManagementPage'}}`
    }).join(",\n")
}