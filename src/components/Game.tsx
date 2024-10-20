import type { Character } from 'src/types'
import { Cloudinary } from '@cloudinary/url-gen'

const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME

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
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dxgurhzge',
    },
  })
  const myImage = cld.image(imgStringId)

  return (
    <div>
      <img src={myImage.toURL()} alt='' />
    </div>
  )
}

export default Game
