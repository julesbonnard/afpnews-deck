import { Lang, Params, Product, Urgency, Status } from 'afpnews-api/dist/types'

export interface MediaSize {
  readonly width: number,
  readonly height: number,
  readonly href: string
}

export interface Media {
  readonly uno: string,
  readonly sizes: Array<MediaSize>,
  readonly creator: string,
  readonly provider: string,
  readonly caption: string,
  readonly source: string
}

export interface Document {
  readonly uno: string,
  readonly country: string,
  readonly city: string,
  readonly embargoed: Date,
  readonly provider: string,
  readonly creator: string,
  readonly source: string,
  readonly iptc: Array<string>,
  readonly slugs: Array<string>,
  readonly news: Array<string>,
  readonly urgency: Urgency,
  readonly product: Product,
  readonly lang: Lang,
  readonly published: Date,
  readonly headline: string,
  readonly medias: Array<Media>,
  readonly advisory: string,
  readonly status: Status
}

export interface Documents {
  [key: string]: Document
}

export interface Column {
  readonly id: string,
  documentsIds: Array<string>,
  error: boolean,
  params: Params
}

export type Locale = 'fr' | 'en'
