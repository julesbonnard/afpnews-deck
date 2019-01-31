export interface Token {
  authType: string
}

export interface MediaSize {
  width: number,
  height: number,
  href: string
}

export interface Media {
  uno: string,
  sizes: Array<MediaSize>,
  creator: string,
  provider: string,
  caption: string,
  source: string
}

export interface Document {
  uno: string,
  parsed?: boolean,
  country: string,
  city: string,
  provider: string,
  creator: string,
  source: string,
  iptc: Array<string>,
  slugs: Array<string>,
  news: Array<string>,
  urgency: number,
  product: string,
  lang: string,
  published: string,
  headline: string,
  medias: Array<Media>
}

export interface Documents {
  [key: string]: Document
}

export interface ColumnParams {
}

export interface Column {
  readonly id: string,
  documentsIds: Array<string>,
  error: boolean,
  params: ColumnParams
}

export interface State {
  columns: Array<Column>,
  credentials: {
    client: string,
    clientId: string,
    clientSecret: string
  },
  documents: object,
  viewed: Array<string>,
  authType: string,
  connectivity: {
    isConnected: boolean
  },
  wantTour: boolean,
  displayInstallApp: boolean,
  locale: string
}
