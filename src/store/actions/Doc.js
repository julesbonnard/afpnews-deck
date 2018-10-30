export default class Doc {
  constructor (docSource = {}) {
    this.doc = {
      viewed: false
    }

    this.uno = docSource
    this.headline = docSource
    this.published = docSource
    this.lang = docSource
    this.product = docSource
    this.urgency = docSource
    this.news = docSource
    this.slugs = docSource
    this.medias = docSource
    this.iptc = docSource
    this.source = docSource
    this.creator = docSource
    this.provider = docSource
  }

  set uno ({ uno = '' }) {
    this.doc.uno = uno
  }

  set headline ({ title = '' }) {
    this.doc.headline = Array.isArray(title) ? title.join(' - ') : title
  }

  set published ({ published = '' }) {
    this.doc.published = published
  }

  set lang ({ lang = '' }) {
    this.doc.lang = lang
  }

  set product ({ product = '' }) {
    this.doc.product = product
  }

  set urgency ({ urgency = 0 }) {
    this.doc.urgency = urgency
  }

  set news ({ news = [] }) {
    this.doc.news = news
  }

  set slugs ({ slug = [] }) {
    this.doc.slugs = slug
  }

  set medias ({
    uno,
    bagItem = []
    // ,
    // entity_faces
  }) {
    // let faceYOffsetPercent
    // if (entity_faces) {
    //   const offsetY = entity_faces[0].faces[0].offsetY
    //   const heightPreview = bagItem[0].medias.find(media => media.role === 'HighDef').height
    //   faceYOffsetPercent = offsetY / heightPreview
    // }
    this.doc.medias = bagItem.map(media => {
      return {
        sizes: media.medias.sort((a, b) => a.width - b.width),
        creator: media.creator,
        provider: media.provider,
        caption: media.caption,
        source: media.source,
        uno: media.uno
        // ,
        // faceYOffsetPercent
      }
    })
  }

  set iptc ({ iptc = [] }) {
    this.doc.iptc = iptc
  }

  set source ({ source = '' }) {
    this.doc.source = source
  }

  set creator ({ creator = '' }) {
    this.doc.creator = creator
  }

  set provider ({ provider = '' }) {
    this.doc.provider = provider
  }

  toObject () {
    return this.doc
  }
}
