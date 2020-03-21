module.exports = function componentField(field){
    switch (field.type) {
        case 'String':
            return generateTextField(field)
        case 'Date':
            return generateDateField(field)
        case 'ObjectId':
            return generateComboField(field)
        default:
            return generateTextField(field)
    }
}

function generateTextField(field) {
    let content = `
                    <v-col cols="12" sm="6">
                        <v-text-field
                                prepend-icon="${field.icon?field.icon:'label'}"
                                name="${field.name}"
                                label="${field.label?field.label:field.name}"
                                type="text"
                                v-model="form.${field.name}"
                                placeholder="${field.label?field.label:field.name}"
                                class="pa-3"
                                :rules="[rules.required]"
                                :error="hasErrors('${field.name}')"
                                :error-messages="getMessageErrors('${field.name}')"
                                required
                        ></v-text-field>
                    </v-col>
    `
    return content
}


function generateComboField(field) {
    let content = `
                     <v-col cols="12" sm="6">
                        <v-select
                                prepend-icon="${field.icon?field.icon:'label'}"
                                class="pa-3"
                                :items="${field.name}s"
                                :item-text="'name'"
                                :item-value="'id'"
                                v-model="form.${field.name}"
                                label="${field.label?field.label:field.name}"
                                :loading="loading"
                                :rules="[rules.required]"
                                :error="hasErrors('${field.name}')"
                                :error-messages="getMessageErrors('${field.name}')"
                                required
                        ></v-select>
                    </v-col>
    `
    return content
}


function generateDateField(field) {
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
                                        label="${field.label?field.label:field.name}"
                                        prepend-icon="${field.icon?field.icon:'event'}"
                                        readonly
                                        hide-details
                                        v-on="on"
                                        :rules="[rules.required]"
                                        :error="hasErrors('${field.name}')"
                                        :error-messages="getMessageErrors('${field.name}')"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="form.${field.name}" scrollable @input="modal =false">
                            </v-date-picker>
                        </v-menu>

                    </v-col>
    `
    return content
}
