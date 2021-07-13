import FontFaceObserver from 'fontfaceobserver'

const fonts = [
  new FontFaceObserver('Poppins', { weight: 400, style: 'normal', stretch: 'normal' }),
  new FontFaceObserver('Poppins', { weight: 600, style: 'normal', stretch: 'normal' })
]

export default (): Promise<void[]> => Promise.all(fonts.map(d => d.load()))
