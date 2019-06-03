<template>
  <aside v-if="medias.length > 0">
    <h2>{{ $t('document.related-medias') }}</h2>
    <ul>
      <li
        v-for="media in medias"
        :key="media.uno">
        <router-link :to="`/doc/${media.uno}`">
          <img :src="media.src" />
        </router-link>({{ doc.published | fromNow($root.$now) }})
      </li>
    </ul>
  </aside>
</template>

<script>
import afpNews from '@/plugins/api'
import Doc from '@/store/actions/Doc'

export default {
  name: 'RelatedMedias',
  props: {
    doc: {
      type: Object,
      default: () => ({}),
      required: false
    }
  },
  data () {
    return {
      documents: []
    }
  },
  computed: {
    medias () {
      return this.documents.reduce((acc, cur) => {
        cur.medias.forEach(media => {
          acc.push({
            uno: cur.uno,
            src: media.sizes.find(d => d.role === 'Preview').href,
            published: cur.published
          })
        })
        return acc
      }, [])
    }
  },
  async created () {
    try {
      const { documents } = await afpNews.search({
        query: `${this.doc.slugs.map(slug => `slug:"${slug}"`).join(' OR ')}`,
        langs: ['en'],
        products: ['photo'],
        size: 5
      })
      if (documents && Array.isArray(documents)) {
        this.documents = documents.map(doc => new Doc(doc).toObject())
      }
    } catch (e) {}
  }
}
</script>

<style lang="scss" scoped>
  @media print {
    ul {
      display: none;
    }
  }
  ul {
    padding-left: 0;
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 33%;
      margin-bottom: 8px;

      img {
        width: 100%;
      }
    }
  }
</style>
