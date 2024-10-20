import type { Character } from 'src/types'

type Props = {
  character: Character
  imgStringId: string
  positionAnswers: { x: number; y: number }
  miduHelpTxt: string
  surrenderTxt: string
}

const Game = ({
  character,
  imgStringId,
  positionAnswers,
  miduHelpTxt,
  surrenderTxt,
}: Props) => {
  return (
    <div>
      <p>{character}</p>
      <p>{imgStringId}</p>
      <p>{positionAnswers.x}</p>
      <p>{positionAnswers.y}</p>
      <p>{miduHelpTxt}</p>
      <p>{surrenderTxt}</p>
    </div>
  )
}

export default Game
