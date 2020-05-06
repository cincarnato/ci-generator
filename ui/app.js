var app = new Vue({
    el: '#app',
    computed: {
        getPropSelected(){
            if(this.propSelected != null){
                return this.modules[this.moduleSelected].properties[this.propSelected]
            }
            return {name:'',type:'', ref:'', label:'',icon:'',required:false,search: false}
        }
    },
    methods:{
      apply(property){
          console.log(property)
          if(this.moduleSelected !== null && this.modules[this.moduleSelected] !== undefined){
             let index = this.modules[this.moduleSelected].properties.findIndex(prop => prop.name == property.name)
              if(index === -1){
                  this.modules[this.moduleSelected].properties.push(property)
              }else{
                  this.modules[this.moduleSelected].properties[index] = property
              }
          }
      }
    },
    data: {
        moduleSelected: null,
        propSelected: null,
        modules: [{
            name: "Demo",
            properties: []
        }]
    }
})

