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
                                type="text"
                                v-model="form.${field.name}"
                                :label="$t('${getI18nKey(moduleName,modelName,field.name)}')"
                                :placeholder="$t('${getI18nKey(moduleName,modelName,field.name)}')"
                                class="pa-3"
                                ${field.required?':rules="[rules.required]"':''}
                                :error="hasErrors('${field.name}')"
                                :error-messages="getMessageErrors('${field.name}')"
                                required
                                 color="secondary"
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
                                class="pa-3"
                                :items="${field.name.toLowerCase()}s"
                                :item-text="'name'"
                                :item-value="'id'"
                                v-model="form.${field.name}"
                                :label="$t('${getI18nKey(moduleName,modelName,field.name)}')"
                                :loading="loading"
                                :rules="[rules.required]"
                                :error="hasErrors('${field.name}')"
                                :error-messages="getMessageErrors('${field.name}')"
                                required
                                color="secondary"
                                item-color="secondary"
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
                                        class="pa-3"
                                        v-model="form.${field.name}"
                                        :label="$t('${getI18nKey(moduleName,modelName,field.name)}')"
                                        prepend-icon="${field.icon ? field.icon : 'event'}"
                                        readonly
                                        hide-details
                                        v-on="on"
                                        :rules="[rules.required]"
                                        :error="hasErrors('${field.name}')"
                                        :error-messages="getMessageErrors('${field.name}')"
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
