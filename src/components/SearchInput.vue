<template>
  <input
    ref="search"
    :placeholder="$t('column.search')"
    :aria-label="$t('column.search')"
    :type="type"
    :value="initialQuery"
    class="search inpt inpt-large"
    autocomplete="off"
    name="query"
    @change="onQueryChange"
    @focus="onQueryFocus"
  >
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import afpNews from '@/plugins/api'

export default {
  name: 'SearchInput',
  components: {},
  props: {
    type: {
      type: String,
      required: false,
      default: 'search'
    },
    initialQuery: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      input: ''
    }
  },
  computed: {},
  methods: {
    onQueryChange (ev) {
      const query = ev.target.value
      this.$emit('submit', query)
    },
    onQueryFocus (ev) {
      ev.target.setSelectionRange(ev.target.value.length, ev.target.value.length)
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";
</style>
