<template>
  <modal>
    <h3 slot="header">About this app</h3>
    <article slot="body">
      <p>AFP News Deck is a reader for AFP feeds. It allows you to fetch and read stories, multimedia articles and photos directly in your browser.</p>
      <p>Made with love by AFP Dataviz team, on a original idea by the Medialab.</p>
    </article>
    <p slot="footer" />
  </modal>
</template>

<script>
import Modal from '@/components/Modal'

export default {
  name: 'CreditsModal',
  components: { Modal }
}
</script>
