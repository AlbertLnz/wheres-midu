import { useTranslations } from 'src/i18n/utils'
import type { GameProps, Character, PageLanguages } from 'src/types'

export function gameProps(lang: PageLanguages, character: Character) {
  const t = useTranslations(lang)

  const gamePropsInfo: Record<Character, GameProps> = {
    Midudev: {
      imgStringId: 'p4ycfe6jpiddv269ercf',
      positionAnswers: { x: 1108.885342744734, y: 191.29497813100062 },
      miduHelpTxt: t('game.miduHelpTxt.midu'),
      surrenderTxt: t('game.surrenderTxt.midu'),
    },
    Altman: {
      imgStringId: 'x2k5fyp96c3il7tevhgb',
      positionAnswers: { x: 553.5874517882188, y: 904.2516668444634 },
      miduHelpTxt: t('game.miduHelpTxt.altman'),
      surrenderTxt: t('game.surrenderTxt.altman'),
    },
    PHP: {
      imgStringId: 'igsclbcucvcrlwurlnye',
      positionAnswers: { x: 535.5236048419966, y: 440.41467089822913 },
      miduHelpTxt: t('game.miduHelpTxt.php'),
      surrenderTxt: t('game.surrenderTxt.php'),
    },
    Lady_Gaga: {
      imgStringId: 'gadpdqbnltidlmmpqpf3',
      positionAnswers: { x: 82.84699897315167, y: 701.7238238745466 },
      miduHelpTxt: t('game.miduHelpTxt.gaga'),
      surrenderTxt: t('game.surrenderTxt.gaga'),
    },
    Colby: {
      imgStringId: 'ebhegso1cpnhbjxitxvh',
      positionAnswers: { x: 1036.2567134537428, y: 870.600790146545 },
      miduHelpTxt: t('game.miduHelpTxt.colby'),
      surrenderTxt: t('game.surrenderTxt.colby'),
    },
  }

  return gamePropsInfo[character as Character]
}
