import { defaultTo, map, maybe, replace, switcher } from 'rambdax'
import { pascalCase } from 'string-fn'

import { changeColorAnt } from './ants/changeColor'
import { readJsonAnt } from './ants/readJson'
import { saveToPackageJsonAnt } from './ants/saveToPackageJson'
import { writeJsonAnt } from './ants/writeJson'
import { generateThemeDataBee } from './bees/generateThemeData'

const AMERICAN_BACK = '#1a2b3c'
const HUNGER_BACK = '#1a2b3c'
const SOUTH_BACK = '#1a2b3c'

const listStandard = {
  // in change of themes
  // in the circle of unsaved changes
  // in extensions preview
  'foreground'                       : '#e7e7e7',
  // ?
  'list.dropBackground'              : '#bae637',
  // when select theme, this is active theme background
  'list.focusBackground'             : '#744da9',
  'list.highlightForeground'         : '#4d0e0b',
  'list.inactiveFocusBackground'     : '#885f66',
  // when file is selected and then it turns inactive,
  // as code window became active
  'list.inactiveSelectionBackground' : '#03469433',
  'list.inactiveSelectionForeground' : '#e7e7e7',
  // in the previous comment, this is when code window is not yet active
  'list.activeSelectionBackground'   : '#d1343822',
  'list.activeSelectionForeground'   : '#e7e7e7',
  // visible in autocomplete, in suggest, change of theme
  'list.hoverBackground'             : '#999966',
  'list.hoverForeground'             : '#440b0b',
}
const suggestionsColors = {
  // in autocomplete box, the active line background
  'editorSuggestWidget.selectedBackground'  : '#2c3d52',
  'editorSuggestWidget.background'          : '#0a0026',
  'editorHoverWidget.background'            : '#282c34',
  // when search with ctrl+f, this is widget chrome color
  'editorWidget.background'                 : 'MAIN_COLOR',
  // in autocomplete - the color of matched chars
  // i.e. if I write `co`, then suggest will be `consts`
  // and the `co` will be in this color
  'editorSuggestWidget.highlightForeground' : '#d1c2e0',
  // in the above example, this is the color of the rest
  // also most common foreground color in autocomplete and suggestion
  'editorSuggestWidget.foreground'          : '#e7e7e7',
  'editorSuggestWidget.border'              : '#d78d9f',
  'editorHoverWidget.border'                : '#d78d9f',
  'editorWidget.border'                     : '#d78d9f',
}

const sidebarColors = {
  'sideBar.background'              : 'MAIN_COLOR',
  'sideBar.foreground'              : '#e7e7e7',
  'sideBar.border'                  : '#8382ae',
  'sideBarSectionHeader.background' : '#aebabe',
  'sideBarSectionHeader.foreground' : '#2a3343',
  'sideBarTitle.foreground'         : '#cacacc',
}
const selectionsColors = {
  'editor.selectionBackground'          : '#5c677366',
  'editor.selectionHighlightBackground' : '#a1ba4e66',
  'editor.inactiveSelectionBackground'  : '#aaab9c66',
}

export const baseColors = {
  ...suggestionsColors,
  ...sidebarColors,
  ...selectionsColors,
  'gitDecoration.addedResourceForeground'     : '#53245b',
  'git.color.modified'                        : '#fac761',
  'list.errorForeground'                      : '#859da9',
  'gitDecoration.modifiedResourceForeground'  : '#f6cbc7',
  'gitDecoration.untrackedResourceForeground' : '#c2aa4d',
  'activityBar.background'                    : '#53245b',
  'badge.background'                          : '#aaa',
  'badge.foreground'                          : '#fafafa',
  'diffEditor.insertedTextBackground'         : '#9c824a55',
  'diffEditor.removedTextBackground'          : '#64B5F655',
  'editor.findMatchBackground'                : '#b65a3d66',
  'editor.findMatchHighlightBackground'       : '#71aac355',
  'editor.findRangeHighlightBackground'       : '#3f706344',
  'editor.lineHighlightBackground'            : 'BACK_COLOR',
  'editor.lineHighlightBorder'                : '#5e6062aa',
  // next two
  // When search by word is active or when double click on a word
  'editor.wordHighlightBackground'            : '#35495f',
  'editor.wordHighlightStrongBackground'      : '#410a0b',
  'editorBracketMatch.background'             : '#41445e',
  'editorBracketMatch.border'                 : '#978373',
  'editorCursor.foreground'                   : '#f9f6f1',
  'editorGroupHeader.tabsBackground'          : 'MAIN_COLOR',
  'editorLineNumber.foreground'               : '#DD85007a',
  'editorLink.activeForeground'               : '#7a2',
  'errorForeground'                           : '#B1365Bf3',
  'focusBorder'                               : '#525e54',
  'scrollbarSlider.background'                : '#455a64',
  'scrollbarSlider.hoverBackground'           : '#C4BE9D',
  'selection.background'                      : '#db82d6',
  'statusBar.background'                      : 'MAIN_COLOR',
  'statusBar.foreground'                      : '#fafafa',
  'tab.activeBackground'                      : 'BACK_COLOR',
  'tab.activeBorder'                          : '#35495f',
  'tab.activeForeground'                      : '#f2aa44',
  'tab.border'                                : 'MAIN_COLOR',
  'tab.inactiveBackground'                    : 'MAIN_COLOR',
  'tab.inactiveForeground'                    : '#b48ead',
  'tab.unfocusedActiveBackground'             : 'MAIN_COLOR',
  'tab.unfocusedActiveBorder'                 : 'MAIN_COLOR',
  'editorGutter.background'                   : 'MAIN_COLOR',
  'scrollbar.shadow'                          : '#cf6f4b',
  'tab.unfocusedActiveForeground'             : '#aa769b',
  'widget.shadow'                             : '#8382aebb',
}

function getBaseColors(mode, actualBack){
  const chromeMainColor = switcher(mode)
    .is('american', '#445A63')
    .is('hunger', '#445A63')
    .default('#4d607b')

  const darker = changeColorAnt(
    chromeMainColor, 'DARK', 0.3
  )

  const currentBase = {
    ...baseColors,
    ...listStandard,
  }
  const withMainDarkColor = map(color => replace(
    'MAIN_COLOR_DARK', darker, color
  ))(currentBase)

  const withMainColor = map(color => replace(
    'MAIN_COLOR', chromeMainColor, color
  ))(withMainDarkColor)

  return map(color => replace(
    'BACK_COLOR', actualBack, color
  ))(withMainColor)
}

export const SETTINGS = {}

SETTINGS[ 0 ] = {
  mode    : 'american',
  label   : 'alien',
  COLOR_0 : '#FFAE57',
  COLOR_1 : '#D9D7CE',
  COLOR_2 : '#BAE67E',
  COLOR_3 : '#D55975',
  COLOR_4 : '#1cb3b8',
  COLOR_5 : '#bb8f7e',
}
SETTINGS[ 1 ] = {
  mode    : 'american',
  label   : 'dad',
  COLOR_0 : '#f6f6bb',
  COLOR_1 : '#57B6CD',
  COLOR_2 : '#cca152',
  COLOR_3 : '#57B6CD',
  COLOR_4 : '#a87ca1',
  COLOR_5 : '#a6cc70',
}

SETTINGS[ 2 ] = {
  mode    : 'american',
  label   : 'spy',
  COLOR_0 : '#F0F4C3',
  COLOR_1 : '#f98fab',
  COLOR_2 : '#50d0ff',
  COLOR_3 : '#a3be8c',
  COLOR_4 : '#bbdefb',
}

SETTINGS[ 3 ] = {
  mode    : 'hunger',
  label   : 'epiphany',
  COLOR_0 : '#df8543',
  COLOR_1 : '#0e9bd1',
  COLOR_2 : '#9abc69',
  COLOR_3 : '#80DEEA',
  COLOR_4 : '#fdd365',
}

SETTINGS[ 4 ] = {
  mode    : 'hunger',
  label   : 'force',
  COLOR_0 : '#6faab5',
  COLOR_1 : '#cfe071',
  COLOR_2 : '#f4f0e6',
  COLOR_3 : '#E07C64',
  COLOR_4 : '#dfe6e9',
  COLOR_5 : '#eccc68',
}

SETTINGS[ 5 ] = {
  mode    : 'hunger',
  label   : 'shake',
  COLOR_0 : '#e17096',
  COLOR_1 : '#95c4da',
  COLOR_2 : '#5699be',
  COLOR_3 : '#b8a0af',
  COLOR_4 : '#DF8E6D',
  COLOR_5 : '#f4dada',
}

SETTINGS[ 6 ] = {
  mode    : 'south',
  label   : 'authority',
  COLOR_0 : '#DA608E',
  COLOR_1 : '#ebac2a',
  COLOR_2 : '#DF91CA',
  COLOR_3 : '#88B1C6',
  COLOR_4 : '#F7DDB2',
  COLOR_5 : '#d4f8e8',
}
SETTINGS[ 7 ] = {
  mode    : 'south',
  label   : 'park',
  COLOR_0 : '#e17096',
  COLOR_1 : '#7AD3F3',
  COLOR_2 : '#7eb19f',
  COLOR_3 : '#cca152',
  COLOR_4 : '#dcedc1',
}
SETTINGS[ 8 ] = {
  mode    : 'south',
  label   : 'tegridy',
  COLOR_0 : '#9dc6a7',
  COLOR_1 : '#fd79a8',
  COLOR_2 : '#f8dc88',
  COLOR_3 : '#E06C75',
  COLOR_4 : '#cd8d7b',
  COLOR_5 : '#ffd1bd',
}

export function getChrome(mode, back){
  if (mode === 'american'){
    const actualBack = defaultTo(AMERICAN_BACK, back)
    const baseToApply = getBaseColors(mode, actualBack)

    return {
      ...baseToApply,
      'editor.background' : actualBack,
    }
  }
  if (mode === 'hunger'){
    const actualBack = defaultTo(HUNGER_BACK, back)
    const baseToApply = getBaseColors(mode, actualBack)

    return {
      ...baseToApply,
      'editor.background' : actualBack,
    }
  }

  const actualBack = defaultTo(SOUTH_BACK, back)
  const baseToApply = getBaseColors(mode, actualBack)

  return {
    ...baseToApply,
    'editor.background' : actualBack,
  }
}

test('happy', () => {
  const allThemes = []
  map(val => {
    const { mode, label, back, ...colors } = val
    const paletteMode = maybe(
      colors.COLOR_5,
      'six',
      colors.COLOR_4 ? 'five' : maybe(
        colors.COLOR_3, 'four', 'three'
      )
    )
    const chrome = getChrome(mode, back)
    const palette = readJsonAnt(`palettes/${ paletteMode }.json`)
    const themeData = generateThemeDataBee({
      palette,
      chrome,
      colors,
    })
    themeData.name = pascalCase(`${ mode }.${ label }`)

    writeJsonAnt(`themes/${ themeData.name }.json`, themeData)

    allThemes.push({
      label   : themeData.name,
      uiTheme : 'vs-dark',
      path    : `./themes/${ themeData.name }.json`,
    })
  })(SETTINGS)

  saveToPackageJsonAnt(allThemes)
})
