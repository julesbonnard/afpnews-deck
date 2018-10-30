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
    <!-- <div
      v-if="iptc.length > 0"
      class="iptc">
      <router-link :to="`/iptc/${iptc.join(',')}`">
        Mêmes catégories
      </router-link>
    </div> -->
    <!-- <div
      v-if="events.length > 0"
      class="events">
      <h2>Évènements</h2>
      <router-link :to="`/event/${events.join(',')}`">
        Sur le même évenement
      </router-link>
    </div> -->
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
      display: inline-block;
      color: white;
      background-color: #6c757d;
      padding: .25em .4em;
      font-size: 75%;
      font-weight: 700;
      text-align: center;
      border-radius: .25rem;
      margin-right: 2px;
      margin-bottom: 5px;
    }
  }
</style>
