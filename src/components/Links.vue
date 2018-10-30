<template>
  <nav>
    <div
      v-if="slugs.length > 0"
      class="slugs">
      <router-link
        v-for="slug in slugs"
        :key="slug"
        :to="`/slug/${slug}`">
        {{ slug }}
      </router-link>
    </div>
    <div
      v-if="iptc.length > 0"
      class="iptc">
      <h2>Catégories</h2>
      <router-link :to="`/iptc/${iptc.join(',')}`">
        Sur les mêmes catégories
      </router-link>
    </div>
    <div
      v-if="events.length > 0"
      class="events">
      <h2>Évènements</h2>
      <router-link :to="`/event/${events.join(',')}`">
        Sur le même évenement
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Links',
  props: {
    slugs: {
      type: Array,
      default: () => ([])
    },
    iptc: {
      type: Array,
      default: () => ([])
    },
    events: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>

<style lang="scss" scoped>
  .slugs {
    a {
      color: white;
      background-color: #6c757d;
      padding: .25em .4em;
      font-size: 75%;
      font-weight: 700;
      line-height: 1;
      text-align: center;
      white-space: nowrap;
      vertical-align: baseline;
      border-radius: .25rem;
      margin-right: 2px;
    }
  }
</style>
