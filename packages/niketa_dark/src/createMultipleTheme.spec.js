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
/*
  SUGGESTIONS:
  #2c3050
  #303454
  #000720
  #011627
  #050523
  #080c11
  #0a0026
  #0a0026
  #0d1016
  #1b2d41
  #1e1d1c
  #212733
  #232834
  #24283b
  #252525
  #261b2c
  #263246
  #282828
  #2A3343
  #2C2B2A
  #2c3d52
  #5c6773

  New suggestions
  #D66A81
  #D55975
  #57B6CD
  #5B89DB
  #9285CC
  #DF91CA
  #78B98A
  #CD926D

  #216479
  #792138
  #EB8E47
  #EB4755
  #66D5AC

	#5ac95a
	#7e995b
	#f64747
	#8ac6d1
  #0099ad
  #0e9bd1
  #249ef5
  #35ba66
  #39bebf
  #3dc7b9
  #527ecc
  #58c7e0
  #6071cc
  #68a14e
  #6ba9ff
  #7AD3F3
  #884484
  #7eb19f
  #90e1c6
  #95c4da
  #95e6cb
  #9b5fe0
  #E05B9D
  #E06C75
  #FAC863
  #a6cc70
  #b4df51
  #b871d0
  #c5930e
  #ca5050
  #cbccc6
  #cca152
  #cd7856
  #cd7856
  #ce4458
  #d47186
  #d8b7fd
  #d8cb32
  #daa520
  #dc835b
  #e15d97
  #e17096
  #e6b450
  #ed8274
  #f07178
  #f29668
  #f5e447
  #f92aad
  #fac761
  #fed888
  #ff605a
  #ffa759

  selection "#ca5010",
*/

const untestedSettings = {
  'breadcrumb.foreground'                 : '#C5C5C9',
  'breadcrumb.background'                 : '#282829',
  'breadcrumb.focusForeground'            : '#64AEF7',
  'breadcrumb.activeSelectionForeground'  : '#C5C5C9',
  'breadcrumbPicker.background'           : '#3E3E41',
  'symbolIcon.arrayForeground'            : '#57B6CD',
  'symbolIcon.booleanForeground'          : '#DF91CA',
  'symbolIcon.classForeground'            : '#D8C67E',
  'symbolIcon.colorForeground'            : '#C5C5C9',
  'symbolIcon.constantForeground'         : '#57B6CD',
  'symbolIcon.constructorForeground'      : '#9285CC',
  'symbolIcon.enumeratorForeground'       : '#C5C5C9',
  'symbolIcon.enumeratorMemberForeground' : '#C5C5C9',
  'symbolIcon.eventForeground'            : '#C5C5C9',
  'symbolIcon.fieldForeground'            : '#C5C5C9',
  'symbolIcon.fileForeground'             : '#C5C5C9',
  'symbolIcon.folderForeground'           : '#C5C5C9',
  'symbolIcon.functionForeground'         : '#78B98A',
  'symbolIcon.interfaceForeground'        : '#C5C5C9',
  'symbolIcon.keyForeground'              : '#C5C5C9',
  'symbolIcon.keywordForeground'          : '#C5C5C9',
  'symbolIcon.methodForeground'           : '#78B98A',
  'symbolIcon.moduleForeground'           : '#57B6CD',
  'symbolIcon.namespaceForeground'        : '#C5C5C9',
  'symbolIcon.nullForeground'             : '#DF91CA',
  'symbolIcon.numberForeground'           : '#5B89DB',
  'symbolIcon.objectForeground'           : '#C5C5C9',
  'symbolIcon.operatorForeground'         : '#D66A81',
  'symbolIcon.packageForeground'          : '#C5C5C9',
  'symbolIcon.propertyForeground'         : '#C5C5C9',
  'symbolIcon.referenceForeground'        : '#C5C5C9',
  'symbolIcon.snippetForeground'          : '#C5C5C9',
  'symbolIcon.stringForeground'           : '#CD926D',
  'symbolIcon.structForeground'           : '#C5C5C9',
  'symbolIcon.textForeground'             : '#C5C5C9',
  'symbolIcon.typeParameterForeground'    : '#C5C5C9',
  'symbolIcon.unitForeground'             : '#DF91CA',
  'symbolIcon.variableForeground'         : '#57B6CD',
  'list.highlightForeground'              : '#E9BF3A',
  'listFilterWidget.background'           : '#3E3E41',
  'listFilterWidget.outline'              : '#E7BB5A',
  'listFilterWidget.noMatchesOutline'     : '#3E3E41',
  'list.filterMatchBackground'            : '#E7BB5A4D',
  'list.filterMatchBorder'                : '#E7BB5A',
  'list.dropBackground'                   : '#006AFF66',
}
/*
    Above are untested changes taken from
    https://github.com/TimGr/valley-vscode/blob/master/themes/valley_dark.json
  */

const listStandard = {
  'list.activeSelectionBackground'   : '#eae3cd',
  'list.activeSelectionForeground'   : '#812428',
  'list.dropBackground'              : '#999a9d',
  'list.focusBackground'             : '#885f66',
  'list.highlightForeground'         : '#89345d',
  // list.hoverBackground is visible in autocomplete
  'list.hoverBackground'             : '#aaa99a',
  'list.hoverForeground'             : '#0d1016',
  'list.inactiveSelectionBackground' : '#c7c5af',
  'list.inactiveSelectionForeground' : '#2d1016',
}

const sidebarColors = {
  'sideBar.background'              : 'MAIN_COLOR',
  'sideBar.foreground'              : '#e7e7e7',
  'sideBar.border'                  : '#8382ae',
  'sideBarSectionHeader.background' : '#aebabe',
  'sideBarSectionHeader.foreground' : '#2a3343',
  'sideBarTitle.foreground'         : '#cacacc',
}

const suggestionsColors = {
  'editorSuggestWidget.background'          : '#c3c1a9',
  'editorSuggestWidget.border'              : '#936776',
  'editorSuggestWidget.foreground'          : '#050523',
  'editorSuggestWidget.highlightForeground' : '#4d0e0b',
  'editorSuggestWidget.selectedBackground'  : '#f6f6f4',
  'editorHoverWidget.background'            : '#344250f2',
  'editorHoverWidget.border'                : '#30322ef2',
  'editorWidget.background'                 : '#fafafaf2',
  'editorWidget.border'                     : '#40c8aef2',
}

const selectionsColors = {
  'editor.selectionBackground'          : '#5c6773',
  'editor.selectionHighlightBackground' : '#aebabe',
  'editor.inactiveSelectionBackground'  : '#aaab9c',
}
const OPACITY = 'd1'
export const baseColors = {
  ...suggestionsColors,
  ...sidebarColors,
  ...selectionsColors,
  'git.color.modified'                        : `#b65a3d${ OPACITY }`,
  'list.errorForeground'                      : '#859da9',
  'gitDecoration.modifiedResourceForeground'  : `#c0c5c9${ OPACITY }`,
  'gitDecoration.untrackedResourceForeground' : `#f39990${ OPACITY }`,
  'activityBar.background'                    : '#54a',
  'badge.background'                          : '#aaa',
  'badge.foreground'                          : '#fafafa',
  'diffEditor.insertedTextBackground'         : '#9c824a55',
  'diffEditor.removedTextBackground'          : '#64B5F655',
  'editor.findMatchBackground'                : '#d0c7b5',
  'editor.findMatchHighlightBackground'       : '#71aac355',
  'editor.findRangeHighlightBackground'       : '#3f706366',
  'editor.lineHighlightBackground'            : 'BACK_COLOR',
  'editor.lineHighlightBorder'                : '#5e6062',
  'editor.wordHighlightBackground'            : '#bacfd6',
  'editor.wordHighlightStrongBackground'      : '#7c8489',
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
  'selection.background'                      : '#ebe6d9',
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
  COLOR_4 : '#10afb5',
  COLOR_5 : '#bb8f7e',
}
SETTINGS[ 1 ] = {
  mode    : 'american',
  label   : 'dad',
  COLOR_0 : '#f6f6bb',
  COLOR_1 : '#57B6CD',
  COLOR_2 : '#cca152',
  COLOR_3 : '#57B6CD',
  COLOR_4 : '#955f8c',
  COLOR_5 : '#a6cc70',
}

SETTINGS[ 2 ] = {
  mode    : 'american',
  label   : 'spy',
  COLOR_2 : '#29c7ac',
  COLOR_1 : '#f98fab',
  COLOR_0 : '#9cbbd0',
  COLOR_3 : '#a3be8c',
  COLOR_4 : '#cbccc6',
  COLOR_5 : '#00a8cc',
}

SETTINGS[ 3 ] = {
  mode    : 'hunger',
  label   : 'epiphany',
  COLOR_0 : '#cc645c',
  COLOR_1 : '#0e9bd1',
  COLOR_2 : '#9abc69',
  COLOR_3 : '#80DEEA',
  COLOR_4 : '#df8543',
  COLOR_5 : '#fdd365',
}

SETTINGS[ 4 ] = {
  mode    : 'hunger',
  label   : 'force',
  COLOR_0 : '#6faab5',
  COLOR_1 : '#cfe071',
  COLOR_2 : '#f4f0e6',
  COLOR_3 : '#E07C64',
  COLOR_4 : '#6faab5',
  COLOR_5 : '#FF9E80',
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
  COLOR_4 : '#cd5953',
  COLOR_5 : '#dcedc1',
}
SETTINGS[ 8 ] = {
  mode    : 'south',
  label   : 'tegridy',
  COLOR_0 : '#9dc6a7',
  COLOR_1 : '#6071cc',
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
