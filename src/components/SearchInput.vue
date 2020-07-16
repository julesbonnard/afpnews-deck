<template>
  <input
    ref="search"
    :placeholder="$t('column.search')"
    :aria-label="$t('column.search')"
    :type="type"
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

.night-mode .search .search-input {
  background-color: $font-color;
  color: white;
  &::placeholder {
    color: $grey-cold-5;
  }
}

.search {
  .search-input {
    height: $form-element-height;
    background-color: white;
    text-indent: 14px;
    border: none;
    margin-bottom: 4px;
    font-size: 1.1rem;
    border-radius: 4px;
    width: 100%;
  }
}
</style>
