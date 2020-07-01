module.exports = function (model) {

    let content =`
export const ${model.name.toUpperCase()}_SHOW = "${model.name.toUpperCase()}_SHOW"
export const ${model.name.toUpperCase()}_UPDATE = "${model.name.toUpperCase()}_UPDATE"
export const ${model.name.toUpperCase()}_CREATE = "${model.name.toUpperCase()}_CREATE"
export const ${model.name.toUpperCase()}_DELETE = "${model.name.toUpperCase()}_DELETE"
    `
    return content
}

