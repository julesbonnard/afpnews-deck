<template>
  <input
    ref="search"
    :placeholder="$t('column.search')"
    :aria-label="$t('column.search')"
    :type="type"
    :value="initialQuery"
    class="search"
    autocomplete="off"
    name="query"
    @change="onQueryChange"
    @focus="onQueryFocus"
  >
</template>

<script>
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

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

.search.input {
  border: 0;
}

@media screen {
  .night-mode {
    .search.input {
      background-color: rgba(0,0,0,.2);
      color: white;
      &::placeholder {
        color: rgba(white, 0.2);
      }
    }
  }
}
</style>
