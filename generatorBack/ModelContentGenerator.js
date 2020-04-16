module.exports = function (model) {
    let content =
`const mongoose = require('mongoose'); 
const softDelete = require('mongoose-softdelete')
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const ${model.name}Schema = new Schema({ 

${fields(model.properties)}


}${timestamp(model.timestamp)});

${model.name}Schema.plugin(softDelete);
${model.name}Schema.plugin(mongoosePaginate);

const ${model.name} = mongoose.model('${model.name}', ${model.name}Schema);

module.exports = ${model.name};`

    return content;
}

function fields(properties) {

    return properties.map(field => {
        if(!field.name) throw new Error("Field needs name atributte")
        if(!field.type) throw new Error("Field " + field.name + " needs type atributte")
        switch (field.type) {
            case "ObjectId":
                if(!field.ref) throw new Error("Field " + field.name + "  has ObjectId type so needs ref atributte")
                return ` ${field.name}: {type: mongoose.Schema.Types.ObjectId, ref: "${field.ref}",required: ${field.required}}`
            case "Float":
                return ` ${field.name}: {type: Number, required: ${field.required}}`
            default:
                return ` ${field.name}: {type: ${field.type}, required: ${field.required}}`

        }
    }).join(',\n')
}

function timestamp(timestamp){
    if(timestamp){
        return `, { timestamps: true }`
    }
    return ""
}
