<template>
  <header id="sidebar">
    <button @click="$emit('addColumn')">
      <i class="UI-icon UI-search" />
    </button>
    <button
      :class="{ success: autoRefresh }"
      @click="$emit('update:autoRefresh', !autoRefresh)">
      <i class="UI-icon UI-refreshing" />
    </button>
    <button
      v-if="allowLogin"
      :class="{ success: isLogged }"
      @click="$emit('toggleLoginModal')">
      <i class="UI-icon UI-user-male" />
    </button>
    <button
      @click="$emit('toggleCreditsModal')">
      <i class="UI-icon UI-heart" />
    </button>
  </header>
</template>

<script>

export default {
  name: 'SideBar',
  props: {
    autoRefresh: {
      type: Boolean,
      required: true
    },
    isLogged: {
      type: Boolean,
      required: true
    },
    allowLogin: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@afp/toolkit-styles/scss/variables.scss";

#sidebar {
  min-width: 50px;
  height: 100%;
  background-color: #243447;

  button {
    display: block;
    width: calc(100% - 10px);
    color: #1DA1F2;
    border: 1px solid #1DA1F2;
    background-color: transparent;
    padding: 10px 12px;
    margin: 5px;
  }
}
</style>
