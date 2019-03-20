import { Document } from '@/types'
import { AfpDocument } from 'afpnews-api/dist/types'

function validDate (str: string | undefined): Date | undefined {
  if (str === undefined) {
    return undefined
  }
  const date = new Date(str)
  return date instanceof Date && !(isNaN(date.valueOf())) ? date : undefined
}

export default class DocumentParser {
  private docSource: AfpDocument

  constructor (docSource: AfpDocument) {
    this.docSource = docSource
  }

  get headline () {
    const title: string | Array<string> = this.docSource.headline || this.docSource.title || this.docSource.news
    return Array.isArray(title) ? title.join(' - ') : title
  }

  get embargoed () {
    return validDate(this.docSource.embargoed)
  }

  get published () {
    const published = validDate(this.docSource.published)
    if (!published) {
      throw new Error(`Doc ${this.docSource.uno} doesn't contain a valid published date`)
    }
    return published
  }

  get medias () {
    const bagItem = this.docSource.bagItem
    if (!bagItem) return []
    const entityFaces = this.docSource.entity_faces
    let faceYOffsetPercent: number | undefined
    const highDef = bagItem[0].medias.find(media => media.role === 'HighDef')
    if (entityFaces && entityFaces[0] && highDef) {
      const offsetY = entityFaces[0].faces[0].offsetY
      faceYOffsetPercent = offsetY / highDef.height
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

  toObject (): Document {
    return {
      uno: this.docSource.uno,
      headline: this.headline,
      published: this.published,
      embargoed: this.embargoed,
      lang: this.docSource.lang,
      product: this.docSource.product,
      urgency: this.docSource.urgency,
      news: this.docSource.news,
      slugs: this.docSource.slug,
      medias: this.medias,
      iptc: this.docSource.iptc,
      source: this.docSource.source,
      creator: this.docSource.creator,
      provider: this.docSource.provider,
      city: this.docSource.city,
      country: this.docSource.country,
      advisory: this.docSource.advisory,
      status: this.docSource.status
    }
  }
}
