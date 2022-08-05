<template>
  <div class="container">
    <h1>Onur</h1>
    <h2 style="text-align: center:">Telefon Rehberi</h2>
    <hr>
    <div class="row">
      <div class="col-md-6">
        <div class="panel panel-warning">
          <div class="panel-heading">
            <h4>Yeni Kişi Ekle</h4>
          </div>
          <div class="panel-body">
            <form>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>Adı ve Soyadı</label>
                    <input type="text" class="form-control" id="username" v-model="username">
                  </div>
                  <label style="color: red">{{ nameError }}</label>
                  <!-- <hr> -->
                  <div class="form-group">

                    <label>Telefon Numarası</label>
                    <phone-mask-input showFlag defaultCountry="tr" v-model="phoneNumber" showDialCodeInSelection
                      inputClass="input-example" type="number" id="PhoneNumber" />
                    <!-- @onValidate="telValidate"  -->
                    <!-- <input 
                        type="number" 
                        class="form-control" 
                        id="phoneNumber" 
                        v-model="phoneNumber"> -->
                  </div>
                  <label style="color: red">{{ phoneError }}</label>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-md-12">
                  <button @click.prevent="save" :disapled="!username || !phoneNumber"
                    class="btn btn-primary">Ekle!!</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="panel panel-info">
          <div class="panel-heading">
            <h4>Kişi Listesi</h4>

          </div>
          <div class="panel-body">
                <!-- <div v-for="(item,index) in list" :key="index">
                    {{ item.username }}
                    {{ item.phoneNumber }}
                    <button  @click="remove(index)" class="btn btn-danger">Kişiyi Sil</button>
                </div> -->
            <table v-if="list && list.length > 0" class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">PhoneNumber</th>
                </tr>
              </thead>
              <tbody v-for="(item, index) in list" :key="index">
                <tr>
                  <th scope="row">{{ index + 1 }}</th>

                  <td>
                    <input :disabled="!item.editable" type="text" class="form-control" id="username"
                      v-model="item.username">
                  </td>
                  <!-- @onValidate="onValidate" -->
                  <td>
                    <phone-mask-input :disabled="!item.editable" type="number" defaultCountry="tr"
                      v-model="item.phoneNumber" wrapperClass="wrraper-example" inputClass="input-example"
                      flagClass="tr" />
                  </td>

                  <button @click="remove(index)" style="font-size: 10px">Kişiyi Sil</button>
                  <button v-if="!item.editable" @click="update(index)" style="font-size: 10px">Düzenle</button>
                  <button v-else @click.prevent="saved(index)" style="font-size: 10px">Kaydet</button>

                </tr>
                <tr>
                  <th scope="row"></th>

                  <td>
                    <textarea v-if="item.active" :disabled="!item.edit" :id="index" style="width :200%; resize: none"
                      v-model="item.note"> </textarea>
                  </td>
                  <td>
                  </td>
                  <div v-if="item.active">
                    <button v-if="!item.edit" @click="note(index)" style="font-size: 10px">Düzenle</button>
                    <button v-else @click.prevent="saveNote(index)" style="font-size: 10px">Kaydet</button>
                  </div>
                  <button v-if="!item.active" style="font-size: 10px" @click="getNotes(index)">Notlar</button>
                  <button v-else style="font-size: 10px" @click="closeNote(index)">Close</button>


                  <!--<div v-if="item.active" style="margin-top: 10px" >  
                    <p>
                      <textarea :disabled="!item.edit" style="width : 300% ;"  v-model="item.note"> </textarea>
                  <button v-if="!item.edit" @click="note(index)" style="font-size: 7px">Düzenle</button>
                  <button v-else @click.prevent="saveNote(index)" style="font-size: 7px">Kaydet</button>
                    </p>  
                    </div>  <div style="margin-top: 10px"> 
                      <button  v-if="!item.active" style="font-size: 10px" @click="addNote(index)">Not Ekle</button>  
                      <button v-else style="font-size: 8px" @click="closeNote(index)">Close</button>
                    </div> -->


                </tr>
              </tbody>
            </table>
            <dialog id="noteDialog">
              <form method="dialog">
                <button style="font-size: 10px" @click.prevent="addNote(noteIndex)">Not Ekle</button>
                <button style="font-size: 10px" @click.prevent="saveNote(index, noteIndex-1)">Kaydet</button>
                <button style="font-size: 10px" @click="closeNote(index)">Kapat</button>
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Tarih</th>
                      <th scope="col">Not</th>
                    </tr>
                  </thead>
                  <tbody v-for="(item, index) in notes" :key="index">
                    <tr>
                      <th scope="row">{{ index + 1 }}</th>

                        <td scope="row">
                          <p>{{currentDate()}}</p>
                        </td>
                      <td>
                        <textarea rows="3" cols="50" :id="index" style="width :100%; resize: none"
                          v-model="item.note" > </textarea>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  <label style="color: red">{{ noteError }}</label>

                </div>
              </form>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Vuex from 'vuex'

export default {
  beforeCreate() {
    this.$store.commit('initialiseStore')
  },

  data() {
    return {
      username: '',
      phoneNumber: '',
      notes: [],
      list: this.$store.state,
      nameError: '',
      phoneError: '',
      noteError: '',
      active: false,
      index: -1,
      noteIndex: 0
    }
  },
  watch: {
    list: function () {
      const listp = []
      this.list.forEach(i => {
        listp.push({ username: i.username, phoneNumber: i.phoneNumber, notes: i.notes, editable: false, edit: false, active: false })
      })
      console.log(this.list)
      console.log(listp)
      localStorage.setItem('store', JSON.stringify(listp))
    }
  },

  methods: {
    checkForm() {
      console.log(this.phoneNumber.length)

      this.nameError = '';
      this.phoneError = '';
      if (this.username && this.phoneNumber.length > 6) {
        return true;
      }



      if (!this.username) {
        this.nameError = 'username required.'
      }
      if (this.phoneNumber.length < 7) {
        this.phoneError = 'phoneNumber required.'
        // alert("lütfen bu alanı boş bırakmayınız.")
      }
      return false;
    },
    noteFrom(index){
      this.noteError = '';
      console.log(index)
      if(this.notes[index].note.length > 0) {
        return true;
      }
      else {
        this.noteError = 'Lütfen Bir Not Ekleyiniz'
        return false;
      }
    },
    save() {
      console.log(this.list)
      if (!this.checkForm()) return;

      if (this.list.some(i => i.phoneNumber == this.phoneNumber)) {
        return
      }
      this.$store.commit('SET_LIST', { username: this.username, phoneNumber: this.phoneNumber, notes: [], editable: false, edit: false, active: false })
      // this.$store.subscribe((mutation, state) => {
      //   console.log(state)
      //   localStorage.setItem('storex', JSON.stringify(state))
      // }) 
      this.list.push(this.$store.state.list)
      // console.log('ls', JSON.parse(localStorage.getItem('store')))
      console.log(this.$store.state)
      // this.list.push(this.$store.state.list)
    },
    remove(index) {
      this.list.splice(index, 1)
    },
    update(index) {
      this.list[index].editable = true
      this.list.push()
    },
    saved(index) {
      this.list[index].editable = false
      this.list.push()
    },
    telValidate(phoneNumber) {
      if (phoneNumber.valid) {
        this.validNumber = phoneNumber.number
      } else {
        this.validNumber = ''
      }
    },
    note(index) {
      this.list[index].edit = true
      this.list.push()
    },
    saveNote(index, noteIndex) {
      console.log(this.list)
      if (!this.noteFrom(noteIndex)) return;
      this.noteError = '';
      this.list[index].notes = this.notes
      // this.$store.commit('SET_LIST', { notes: s.notes, editable: false, edit: false, active: false })
      // this.list.push(this.$store.state.Note)
      console.log(this.$store.state)
    },
    addNote(index) {
      console.log(index)
      this.notes.push({ note: '', date: null })
      // this.list[index].active=true
      // this.list[index].edit=true
      // this.list.push()
      setTimeout(() => {
        if (document.getElementById(index)) {
          document.getElementById(index).focus()
        }
      }, 10)
      this.noteIndex = index + 1
    },
    getNotes(index) {
      this.notes = this.list[index].notes ? Array.from(this.list[index].notes) : []
      this.index = index
      this.noteIndex = this.notes.length
      setTimeout(() => {
        console.log(document.getElementById('noteDialog'))
        document.getElementById('noteDialog').showModal()
      }, 10)
    },
    closeNote(index) {
      this.list[index].active = false
      this.list[index].edit = true
      this.list.push()
            this.noteError = '';
    },
    currentDate() {
      const current = new Date();
      const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
      return date;
    }
  }
  }

</script>
