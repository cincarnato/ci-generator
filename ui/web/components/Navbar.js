Vue.component('Navbar', {
    name: 'Navbar',
    props: {
      apiStatus: String
    },
    template: `
    <nav class="navbar navbar-dark bg-dark">
  <a class="navbar-brand" href="#">
    Generator
  </a>
      <div>
       <button @click="$emit('generate')" class="btn btn-primary" type="button">GENERATE</button>
       <button @click="$emit('save')" class="btn btn-success" type="button">SAVE</button>
      </div>
  </nav>
    `
    }
)
