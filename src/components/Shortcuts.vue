<template>
  <form class="shortcuts">
    <label for="default-language">
      {{ $t("shortcuts.change-contents") }}
    </label>
    <select
      id="default-language"
      v-model="lang"
    >
      <option
        disabled
        selected
        :value="null"
      >
        {{ $t("shortcuts.select-language") }}
      </option>
      <option
        v-for="language in languages"
        :key="language"
        :value="language"
      >
        {{ $t(`languages.${language}`) }}
      </option>
    </select>
    <button
      class="reset btn"
      @click="resetDefaultLanguage()"
    >
      {{ $t("shortcuts.reset-contents") }}
    </button>
  </form>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Shortcuts',
  computed: {
    ...mapState([
      'defaultLang'
    ]),
    lang: {
      get () {
        return this.defaultLang
      },
      set (val) {
        this.changeAllContentLanguage(val)
      }
    },
    languages() {
      return ['en', 'fr', 'de', 'es', 'pt', 'ar', 'zh-tw', 'zh-cn']
    }
  },
  methods: {
    ...mapActions([
      'changeAllContentLanguage',
      'resetDefaultLanguage'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.shortcuts {
  display: flex;
  align-items: center;
  padding: 0.6rem 2.5rem;

  @include breakpoint(mobile) {
    font-size: 13px;
  }

  @media print {
    display: none;
  }

  .reset {
    background-color: transparent;
    color: $font-color;
    text-shadow: none;
    font-weight: 400;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
    margin-left: auto;

    @include breakpoint(mobile) {
      display: none;
    }
  }

  select {
    background: transparent;
    border: none;
    color: $secondary-color;
    margin-left: 10px;
    outline: none;
  }
}
</style>