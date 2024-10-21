export type Character = 'Midudev' | 'Altman' | 'PHP' | 'Lady_Gaga' | 'Colby'

export interface GameProps {
  imgStringId: string
  positionAnswers: { x: number; y: number }
  miduHelpTxt: string
  surrenderTxt: string
}

export interface savePreviousFrame {
  x: number
  y: number
  zoom: number
}

export type MarkerPosition = { x: number; y: number }
