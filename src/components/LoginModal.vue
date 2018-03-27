<template>
  <modal
    id="login-modal"
    @close="$emit('close')">
    <h3 slot="header">Please authenticate</h3>
    <form
      slot="body"
      @submit.stop.prevent="login">
      <input
        id="client-id"
        v-model.lazy="clientId"
        type="text"
        name="client-id"
        placeholder="Client ID"
        autocomplete="off">
      <input
        id="client-secret"
        v-model.lazy="clientSecret"
        type="password"
        name="client-secret"
        placeholder="Client Secret"
        autocomplete="off">
      <input
        id="username"
        v-model="username"
        type="text"
        name="username"
        placeholder="Username">
      <input
        id="password"
        v-model="password"
        type="password"
        name="password"
        placeholder="Password">
      <button type="submit">Submit</button>
    </form>
    <p slot="footer" />
  </modal>
</template>

<script>
import Modal from '@/components/Modal'
import { mapActions } from 'vuex'

export default {
  name: 'LoginModal',
  components: { Modal },
  data () {
    return {
      username: undefined,
      password: undefined
    }
  },
  computed: {
    clientId: {
      get () {
        return this.$store.state.credentials.clientId
      },
      set (value) {
        this.$store.commit('updateClientId', value)
      }
    },
    clientSecret: {
      get () {
        return this.$store.state.credentials.clientSecret
      },
      set (value) {
        this.$store.commit('updateClientSecret', value)
      }
    }
  },
  methods: {
    ...mapActions([
      'authenticate'
    ]),
    login () {
      this.authenticate({ username: this.username, password: this.password })
        .then(() => {
          this.$emit('close')
        })
    }
  }
}
</script>
