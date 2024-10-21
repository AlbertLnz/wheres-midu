import { Cloudinary } from '@cloudinary/url-gen'
import { useEffect, useRef, useState } from 'preact/hooks'
import cloudinaryLogo from '../assets/imgs/cloudinaryLogo.webp'
import miduWink from '../assets/imgs/miduWink.webp'
import centerCanvas from '../assets/imgs/centerCanvas.webp'
import '@/styles/game.css'
import { urlToBlob } from 'src/utils/urlToBlob'
import {
  type savePreviousFrame,
  type MarkerPosition,
  type Character,
  type PageLanguages,
} from 'src/types.d'
import type React from 'preact/compat'
import { cloudinaryFormDataFnct } from '@/data/cloudinaryFormData'
import { useTranslations } from 'src/i18n/utils'

type Props = {
  lang: PageLanguages
  character: Character
  imgStringId: string
  positionAnswers: { x: number; y: number }
  miduHelpTxt: string
  surrenderTxt: string
}

const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME

const Game = ({
  lang,
  character,
  imgStringId,
  positionAnswers,
  miduHelpTxt,
  surrenderTxt,
}: Props) => {
  const t = useTranslations(lang)

  const initialGameLives = 3
  const initialCloudinaryHelps = 1
  const initialMiduHelps = 1
  const [gameLives, setGameLives] = useState(initialGameLives)
  const [cloudinaryHelps, setCloudinaryHelps] = useState(initialCloudinaryHelps)
  const [miduHelps, setMiduHelps] = useState(initialMiduHelps)
  const [miduHelpMsg, setMiduHelpMsg] = useState(
    `${t('game.miduHelpTxt')} ${character.replace('_', ' ')}.`
  )
  const [fetchingMsg, setFetchingMsg] = useState('')
  const [surrenderState, setSurrenderState] = useState(false)

  const cld = new Cloudinary({
    cloud: {
      cloudName: cloudName,
    },
  })
  const myImage = cld.image(imgStringId)

  const MAX_ZOOM = 5
  const MIN_ZOOM = 1
  const SCROLL_SENSITIVITY = 0.002
  const [imageUrl, setImageUrl] = useState(myImage.toURL())
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [savePreviousFrame, setSavePreviousFrame] =
    useState<savePreviousFrame | null>(null)
  const markerPositionRef = useRef<MarkerPosition | null>(null)
  const rectRef = useRef<DOMRect | null>(null)
  let cameraOffset = {
    x: 0,
    y: 0,
  }
  let cameraZoom = 1

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null) return
    const ctx = canvas.getContext('2d')

    let isDragging = false
    let dragStart = { x: 0, y: 0 }
    markerPositionRef.current = null

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      if (savePreviousFrame) {
        cameraOffset.x = savePreviousFrame.x
        cameraOffset.y = savePreviousFrame.y
        cameraZoom = savePreviousFrame.zoom
      } else {
        cameraOffset.x = canvas.width / 2
        cameraOffset.y = canvas.height / 2
      }
      if (!ctx) return
      draw(ctx, img)
    }

    function draw(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()

      ctx.translate(cameraOffset.x, cameraOffset.y)
      ctx.scale(cameraZoom, cameraZoom)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)

      ctx.restore()
      drawMarker()

      requestAnimationFrame(() => draw(ctx, img))
    }

    function drawMarker() {
      if (!canvas || !ctx) return
      if (
        markerPositionRef.current &&
        cameraZoom === 1 &&
        cameraOffset.x === canvas.width / 2 &&
        cameraOffset.y === canvas.height / 2
      ) {
        ctx.save()
        ctx.strokeStyle = 'green'
        ctx.lineWidth = 10
        ctx.beginPath()
        ctx.arc(
          markerPositionRef.current.x,
          markerPositionRef.current.y,
          25,
          0,
          Math.PI * 2
        )
        ctx.stroke()
        ctx.restore()
      }
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()

      const mouseX =
        (e.clientX - rect.left) / cameraZoom - cameraOffset.x / cameraZoom
      const mouseY =
        (e.clientY - rect.top) / cameraZoom - cameraOffset.y / cameraZoom

      const zoomAmount = e.deltaY * SCROLL_SENSITIVITY
      const newZoom = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, cameraZoom - zoomAmount)
      )

      cameraOffset.x -= mouseX * (newZoom - cameraZoom)
      cameraOffset.y -= mouseY * (newZoom - cameraZoom)

      cameraZoom = newZoom
    }

    const handlePointerUp = () => {
      isDragging = false
    }

    const handlePointerMove = (e: MouseEvent) => {
      if (isDragging) {
        cameraOffset.x = e.clientX - dragStart.x * cameraZoom
        cameraOffset.y = e.clientY - dragStart.y * cameraZoom
      }
    }

    const handleKeyDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true
        dragStart.x = (e.clientX - cameraOffset.x) / cameraZoom
        dragStart.y = (e.clientY - cameraOffset.y) / cameraZoom
        markerPositionRef.current = null
      }

      if (e.button === 2) {
        if (
          cameraZoom === 1 &&
          cameraOffset.x === canvas.width / 2 &&
          cameraOffset.y === canvas.height / 2
        ) {
          const rect = canvas.getBoundingClientRect()
          rectRef.current = rect

          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          const scaleX = canvas.width / rect.width
          const scaleY = canvas.height / rect.height

          markerPositionRef.current = {
            x: x * scaleX,
            y: y * scaleY,
          }
        }
      }
    }

    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })

    canvas.addEventListener('mouseup', handlePointerUp)
    canvas.addEventListener('mousemove', handlePointerMove)
    canvas.addEventListener('wheel', handleWheel)
    canvas.addEventListener('mousedown', handleKeyDown)

    return () => {
      canvas.removeEventListener('mouseup', handlePointerUp)
      canvas.removeEventListener('mousemove', handlePointerMove)
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('mousedown', handleKeyDown)
    }
  }, [imageUrl])

  const cloudinaryHint = async () => {
    if (cloudinaryHelps === 0) return

    setCloudinaryHelps(cloudinaryHelps - 1)
    setFetchingMsg('Mejorando la resolución, espere un momento...')

    if (canvasRef.current === null) return

    const imageUrl = canvasRef.current.toDataURL('image/webp', 0.8)
    const img = urlToBlob(imageUrl)

    const formData = await cloudinaryFormDataFnct()
    formData.append('file', img, 'image.webp')
    console.log(Object.fromEntries(formData.entries()))

    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        fetch(
          `https://res.cloudinary.com/${cloudName}/image/upload/c_scale,w_600/e_upscale/${data.public_id}.webp`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'image/webp',
            },
          }
        ).then((response) => {
          setFetchingMsg('')
          setImageUrl(response.url)

          setTimeout(() => {
            setImageUrl(myImage.toURL())
            setSavePreviousFrame({
              x: cameraOffset.x,
              y: cameraOffset.y,
              zoom: cameraZoom,
            })
          }, 10 * 1000)
        })
      })
      .catch((error) => {
        console.error('Error subiendo la imagen:', error)
      })
  }

  const handleMiduHint = () => {
    if (miduHelps > 0) {
      setMiduHelpMsg(miduHelpTxt)
      setMiduHelps(miduHelps - 1)
    }
  }

  const handleCenter = () => {
    if (!canvasRef.current) return
    cameraOffset.x = canvasRef.current.width / 2
    cameraOffset.y = canvasRef.current.height / 2
    cameraZoom = 1
  }

  const handleTestFindIt = () => {
    if (!markerPositionRef.current || !rectRef.current || gameLives < 0) {
      setFetchingMsg('Marca la posición!')
      setTimeout(() => {
        setFetchingMsg('')
      }, 2000)
      return
    }

    const tolerance = 15

    const imagePositionX = markerPositionRef.current.x - rectRef.current.left
    const imagePositionY = markerPositionRef.current.y - rectRef.current.top

    const isPositionXCorrect =
      Math.abs(imagePositionX - positionAnswers.x) <= tolerance
    const isPositionYCorrect =
      Math.abs(imagePositionY - positionAnswers.y) <= tolerance

    const isPositionCorrect = isPositionXCorrect && isPositionYCorrect

    if (isPositionCorrect) {
      setSurrenderState(true)
      handleShowCharacter()
    } else {
      setGameLives(gameLives - 1)
      setFetchingMsg('Incorrecto')
      setTimeout(() => {
        setFetchingMsg('')
      }, 2000)
    }
  }

  const handleSurrender = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const target = evt.target as HTMLInputElement
    setSurrenderState(target.checked)
  }

  const handleShowCharacter = () => {
    if (surrenderState) {
      setImageUrl(
        `https://res.cloudinary.com/${cloudName}/image/upload/c_crop,h_200,w_200,x_${Math.round(
          positionAnswers.x
        )},y_${Math.round(
          positionAnswers.y
        )}/c_scale,w_0.99/e_upscale/${imgStringId}?_a=DATAg1AAZAA0`
      )
    }
  }

  return (
    <div id='app'>
      <div className='relative'>
        <canvas id='myCanvas' ref={canvasRef}></canvas>
        <div className='absolute w-full flex justify-between items-center top-0 left-0 px-2 italic transform -translate-y-full text-[13px]'>
          <div class='flex items-center justify-center gap-x-2'>
            <a href={`/${lang}`} class='text-white/80 hover:text-white'>
              {t('game.backBtn')}{' '}
            </a>
            <p>
              {t('game.info.1')}{' '}
              <span className='font-semibold'>{t('game.info.2')}</span>{' '}
              {t('game.info.3')}
            </p>
          </div>
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
            {t('game.cloudinaryHelp.title')}{' '}
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
            {t('game.miduHelp.title')}{' '}
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
          <p className='text-lg'>{t('game.centerImg.title')}</p>
        </button>

        <button className='w-full py-2 bg-lime-800' onClick={handleTestFindIt}>
          <p className='text-lg'>
            {t('game.attemptBtn')}{' '}
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
          {t('game.surrenderBtn')}
        </button>

        <div className='absolute bottom-0 mb-4 text-sm italic space-y-2 pr-8'>
          <p>
            {t('game.helps.cloudinary1')}{' '}
            <span className='font-bold'>{t('game.helps.cloudinary2')}</span>{' '}
            {t('game.helps.cloudinary3')}
          </p>
          <p>
            {t('game.helps.midu1')}{' '}
            <span className='font-bold'>{t('game.helps.midu2')}</span>{' '}
            {t('game.helps.midu3')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Game
