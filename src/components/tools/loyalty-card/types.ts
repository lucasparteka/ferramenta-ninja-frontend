export type StampStyle = 'circle' | 'square'

export type StampCount = 5 | 6 | 8 | 10

export type FrontData = {
  businessName: string
  optionalLine1: string
  optionalLine2: string
  primaryColor: string
  backgroundColor: string
  logoFile: File | null
  logoPreview: string | null
}

export type BackData = {
  stampCount: StampCount
  stampStyle: StampStyle
  primaryColor: string
  backgroundColor: string
}

export type Template = {
  id: string
  name: string
  category: string
  defaultFront: Pick<FrontData, 'primaryColor' | 'backgroundColor'>
  defaultBack: Pick<BackData, 'primaryColor' | 'backgroundColor'>
}

export type CanvasHandle = {
  getDataURL: () => string
}
