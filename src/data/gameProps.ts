import { useTranslations } from 'src/i18n/utils'
import type { GameProps, Character, PageLanguages } from 'src/types'

export function gameProps(lang: PageLanguages, character: Character) {
  const t = useTranslations(lang)

  const gamePropsInfo: Record<Character, GameProps> = {
    Midudev: {
      imgStringId: 'ow5wyljx6yxkrxacow1b',
      positionAnswers: { x: 687.1609014001452, y: 751.9959950962743 },
      miduHelpTxt: t('game.miduHelpTxt.midu'),
      surrenderTxt: t('game.surrenderTxt.midu'),
    },
    Altman: {
      imgStringId: 'ow5wyljx6yxkrxacow1b',
      positionAnswers: { x: 123, y: 456 },
      miduHelpTxt: t('game.miduHelpTxt.altman'),
      surrenderTxt: t('game.surrenderTxt.altman'),
    },
    PHP: {
      imgStringId: 'ow5wyljx6yxkrxacow1b',
      positionAnswers: { x: 123, y: 456 },
      miduHelpTxt: t('game.miduHelpTxt.php'),
      surrenderTxt: t('game.surrenderTxt.php'),
    },
    Lady_Gaga: {
      imgStringId: 'ow5wyljx6yxkrxacow1b',
      positionAnswers: { x: 123, y: 456 },
      miduHelpTxt: t('game.miduHelpTxt.gaga'),
      surrenderTxt: t('game.surrenderTxt.gaga'),
    },
    Colby: {
      imgStringId: 'ow5wyljx6yxkrxacow1b',
      positionAnswers: { x: 123, y: 456 },
      miduHelpTxt: t('game.miduHelpTxt.colby'),
      surrenderTxt: t('game.surrenderTxt.colby'),
    },
  }

  return gamePropsInfo[character as Character]
}
