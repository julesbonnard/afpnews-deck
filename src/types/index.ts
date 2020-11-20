import { Lang, Params, Product, Urgency, Status } from 'afpnews-api/dist/types'

export interface MediaSize {
  readonly width: number,
  readonly height: number,
  readonly href: string
}

export interface Media {
  readonly uno: string,
  readonly sizes: MediaSize[],
  readonly creator: string,
  readonly provider: string,
  readonly caption: string,
  readonly source: string
}

export interface Event {
  readonly id: string,
  readonly name: string
}

export interface Document {
  readonly uno: string,
  readonly country: string,
  readonly city: string,
  readonly embargoed?: Date,
  readonly provider: string,
  readonly creator: string,
  readonly source: string,
  readonly iptc: string[],
  readonly slugs: string[],
  readonly news: string[],
  readonly urgency: Urgency,
  readonly product: Product,
  readonly lang: Lang,
  readonly published: Date,
  readonly headline: string,
  readonly medias: Media[],
  readonly advisory: string,
  readonly status: Status,
  readonly summary: string[],
  readonly genre?: string,
  readonly event?: Event
}

export type Documents = Map<string, Document>

export interface Column {
  readonly id: string,
  type: string
  documentsIds: string[],
  params: Params
}

export type Locale = 'fr' | 'en'
