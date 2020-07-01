const getI18nKey = require('./getI18nKey')

module.exports = function componentField(field, modelName, moduleName) {
    switch (field.type) {
        case 'String':
            return generateTextField(field, modelName, moduleName)
        case 'Date':
            return generateDateField(field, modelName, moduleName)
        case 'ObjectId':
            return generateComboField(field, modelName, moduleName)
        default:
            return generateTextField(field, modelName, moduleName)
    }
}

function generateTextField(field, modelName, moduleName) {
    let content = `
                    <v-col cols="12" sm="6">
                        <v-text-field
                                prepend-icon="${field.icon ? field.icon : 'label'}"
                                name="${field.name}"
                                v-model="form.${field.name}"
                                :label="$t('${getI18nKey(moduleName,modelName,field.name)}')"
                                :placeholder="$t('${getI18nKey(moduleName,modelName,field.name)}')"
                                :error="hasInputErrors('${field.name}')"
                                :error-messages="getInputErrors('${field.name}')"
                                color="secondary"
                                ${field.required?':rules="required"':''}
                        ></v-text-field>
                    </v-col>
    `
    return content
}


function generateComboField(field, modelName, moduleName) {
    let content = `
                     <v-col cols="12" sm="6">
                        <v-select
                                prepend-icon="${field.icon ? field.icon : 'label'}"
                                :items="${field.name.toLowerCase()}s"
                                :item-text="'name'"
                                :item-value="'id'"
                                v-model="form.${field.name}"
                                :label="$t('${getI18nKey(moduleName,modelName,field.name)}')"
                                :loading="loading"
                                :error="hasInputErrors('${field.name}')"
                                :error-messages="getInputErrors('${field.name}')"
                                color="secondary"
                                item-color="secondary"
                                ${field.required?':rules="required"':''}
                        ></v-select>
                    </v-col>
    `
    return content
}


function generateDateField(field, modelName, moduleName) {
    let content = `
                   <v-col cols="12" sm="6">
                        <v-menu
                                v-model="modal"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        v-model="form.${field.name}"
                                        :label="$t('${getI18nKey(moduleName,modelName,field.name)}')"
                                        prepend-icon="${field.icon ? field.icon : 'event'}"
                                        readonly
                                        v-on="on"
                                        ${field.required?':rules="required"':''}
                                        :error="hasInputErrors('${field.name}')"
                                        :error-messages="getInputErrors('${field.name}')"
                                        color="secondary"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="form.${field.name}" scrollable @input="modal =false">
                            </v-date-picker>
                        </v-menu>

                    </v-col>
    `
    return content
}
