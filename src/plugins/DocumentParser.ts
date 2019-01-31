import { Document } from '@/types'

export default class DocumentParser {
  private docSource: any

  constructor (docSource = {}) {
    this.docSource = docSource
  }

  get uno () {
    return this.docSource.uno
  }

  get headline () {
    return Array.isArray(this.docSource.title) ? this.docSource.title.join(' - ') : this.docSource.title
  }

  get published () {
    return this.docSource.published
  }

  get lang () {
    return this.docSource.lang
  }

  get product () {
    return this.docSource.product
  }

  get urgency () {
    return this.docSource.urgency
  }

  get news () {
    return this.docSource.news
  }

  get slugs () {
    return this.docSource.slug
  }

  get medias () {
    const uno = this.uno
    const bagItem = this.docSource.bagItem || []
    const entityFaces = this.docSource.entity_faces || []
    let faceYOffsetPercent: number
    if (entityFaces) {
      const offsetY = entityFaces[0].faces[0].offsetY
      const heightPreview = bagItem[0].medias.find(media => media.role === 'HighDef').height
      faceYOffsetPercent = offsetY / heightPreview
    }
    return bagItem.map(media => {
      return {
        sizes: media.medias.sort((a, b) => a.width - b.width),
        creator: media.creator,
        provider: media.provider,
        caption: media.caption,
        source: media.source,
        uno: media.uno,
        faceYOffsetPercent
      }
    })
  }

  get iptc () {
    return this.docSource.iptc
  }

  get source () {
    return this.docSource.source
  }

  get creator () {
    return this.docSource.creator
  }

  get provider () {
    return this.docSource.provider
  }

  get city () {
    return this.docSource.city
  }

  get country () {
    return this.docSource.country
  }

  toObject () {
    return {
      uno: this.uno,
      headline: this.headline,
      published: this.published,
      lang: this.lang,
      product: this.product,
      urgency: this.urgency,
      news: this.news,
      slugs: this.slugs,
      medias: this.medias,
      iptc: this.iptc,
      source: this.source,
      creator: this.creator,
      provider: this.provider,
      city: this.city,
      country: this.country,
      parsed: true
    }
  }
}
