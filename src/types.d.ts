export type Character = 'Midudev' | 'Altman' | 'PHP' | 'Lady_Gaga' | 'Colby'

export interface GameProps {
  imgStringId: string
  positionAnswers: { x: number; y: number }
  miduHelpTxt: string
  surrenderTxt: string
}
