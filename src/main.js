import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
// import { useStore } from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    list: [],
    // note : [],
  },
  mutations: {
    initialiseStore(state) {
      if (localStorage.getItem('store')) {
        console.log('initial', state)
        this.replaceState(
          Object.assign(state.list, JSON.parse(localStorage.getItem('store')))
        )
        console.log('end', state)
      }
    },
    SET_LIST: (state, list) => {
      state.list = list
    },

    // initialiseNote(state) {
    //   if(localStorage,getItem('store')) {
    //     this.replaceState(
    //       object.assign(state.note, JSON.parse(localStorage.getItem('store')))
    //     )
    //   }
    // },
    // SET_NOTE: (state, note) => {
    //   state.note = note
    // }
    
  }
})

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
