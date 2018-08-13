export default doc => {
  return {
    uno: doc.uno,
    headline: Array.isArray(doc.title) ? doc.title.join(' - ') : doc.title,
    published: doc.published,
    lang: doc.lang,
    product: doc.product,
    urgency: doc.urgency,
    news: doc.news,
    slugs: doc.slug,
    medias: doc.bagItem ? doc.bagItem.map(media => {
      return {
        sizes: media.medias.sort((a, b) => a.width - b.width),
        creator: media.creator,
        provider: media.provider,
        caption: media.caption,
        source: media.source,
        uno: media.uno
      }
    }) : [],
    viewed: false
  }
}
