import type { Character } from 'src/types'
import { Cloudinary } from '@cloudinary/url-gen'
import { useRef, useState } from 'preact/hooks'
import cloudinaryLogo from '../assets/imgs/cloudinaryLogo.webp'
import miduWink from '../assets/imgs/miduWink.webp'
import centerCanvas from '../assets/imgs/centerCanvas.webp'
import '@/styles/game.css'

type Props = {
  character: Character
  imgStringId: string
  positionAnswers: { x: number; y: number }
  miduHelpTxt: string
  surrenderTxt: string
}

const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME

const Game = ({
  character,
  imgStringId,
  positionAnswers,
  miduHelpTxt,
  surrenderTxt,
}: Props) => {
  const initialGameLives = 3
  const initialCloudinaryHelps = 1
  const initialMiduHelps = 1
  const [gameLives, setGameLives] = useState(initialGameLives)
  const [cloudinaryHelps, setCloudinaryHelps] = useState(initialCloudinaryHelps)
  const [miduHelps, setMiduHelps] = useState(initialMiduHelps)
  const [miduHelpMsg, setMiduHelpMsg] = useState(
    `Activa la miduAyuda para obtener una pista de donde está ${character}.`
  )
  const [fetchingMsg, setFetchingMsg] = useState('')
  const [surrenderState, setSurrenderState] = useState(false)

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dxgurhzge',
    },
  })
  const myImage = cld.image(imgStringId)

  const [imageUrl, setImageUrl] = useState(myImage.toURL())
  const canvasRef = useRef(null)
  const [savePreviuousFrame, setSavePreviuousFrame] = useState(null)
  const markerPositionRef = useRef(null)
  const rectRef = useRef(null)

  const cloudinaryHint = () => {}
  const handleMiduHint = () => {}
  const handleCenter = () => {}
  const handleTestFindIt = () => {}
  const handleSurrender = () => {}
  const handleShowCharacter = () => {}

  return (
    <div id='app'>
      <div className='relative'>
        <canvas id='myCanvas' ref={canvasRef}></canvas>
        <div className='absolute w-full flex justify-between items-center top-0 left-0 px-2 italic transform -translate-y-full text-[13px]'>
          <p>
            Para marcar una respuesta,{' '}
            <span className='font-semibold'>centra la imágen</span> y marca en
            el lugar aproximado con el botón derecho.
          </p>
          <p className='text-blue-400 font-bold text-[13px] relaxed tracking-wider'>
            {fetchingMsg}
          </p>
        </div>
      </div>
      <div
        id='gameContainer'
        className='relative w-full h-full flex flex-col items-start justify-center gap-y-4 pr-8'
      >
        <div className='w-full pr-8 absolute top-0 mt-4'>
          <p className='text-sm text-center border border-dotted p-4'>
            {miduHelpMsg}
          </p>
        </div>

        <button
          className='flex gap-x-2 items-center justify-center'
          onClick={cloudinaryHint}
        >
          <img src={cloudinaryLogo.src} className='w-7' alt='cloudinaryLogo' />
          <p className='text-lg'>
            La Cloudinary ayuda{' '}
            <span className='text-xs font-bold'>
              ({cloudinaryHelps}/{initialCloudinaryHelps})
            </span>
          </p>
        </button>

        <button
          className='flex gap-x-2 items-center justify-center'
          onClick={handleMiduHint}
        >
          <img src={miduWink.src} className='size-7' alt='miduWink' />
          <p className='text-lg'>
            La miduAyuda{' '}
            <span className='text-xs font-bold'>
              ({miduHelps}/{initialMiduHelps})
            </span>
          </p>
        </button>

        <hr className='w-full border-dashed border border-white/40' />

        <button
          className='flex gap-x-2 items-center justify-center'
          onClick={handleCenter}
        >
          <img src={centerCanvas.src} className='size-7' alt='centerCanvas' />
          <p className='text-lg'>Centrar la imágen</p>
        </button>

        <button className='w-full py-2 bg-lime-800' onClick={handleTestFindIt}>
          <p className='text-lg'>
            Realizar intento{' '}
            <span className='text-base'>{`(${gameLives}/${initialGameLives})`}</span>
          </p>
        </button>

        <hr className='w-full border-dashed border border-white/40' />

        <label htmlFor='surrender' className='flex text-base gap-x-2 -mb-4'>
          <input id='surrender' type='checkbox' onChange={handleSurrender} />
          {surrenderTxt}
        </label>

        <button
          className={`w-full py-2 bg-orange-800 text-lg ${
            surrenderState ? '' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={handleShowCharacter}
        >
          Resolver
        </button>

        <div className='absolute bottom-0 mb-4 text-sm italic space-y-2 pr-8'>
          <p>
            - ¡La <span className='font-bold'>Cloudinary ayuda</span> te permite
            mejorar la resolución de una trozo de imágen en alta resolución!
            ¡¡Pero tendrás que observar rápido!! ¡Porque a los 10 segundos la
            imágen vuelve a la calidad original!
          </p>
          <p>
            - La <span className='font-bold'>miduAyuda</span> te da una pequeña
            pista de donde se encuentra Midu.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Game
