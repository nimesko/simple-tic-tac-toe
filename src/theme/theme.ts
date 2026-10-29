import { ColorPalete, Theme } from '@models/theme'
import { createGlobalStyle } from 'styled-components'

const DefaultTheme = {}

const DarkThemeColorPalete: ColorPalete = {
	background: '#000',
	backgroundButton: '#fff',
	backgroundButtonHover: '#1a1a1a',
	backgroundEndGame: '#000000de',
	backgroundLoading: '#fff',
	backgroundLoadingProgress: '#1a1a1a',
	backgroundDialog: '#000000f2',
	borderColorGrid: '#fff',
	borderColorTable: '#adadad',
	borderColorButton: '#fff',
	borderColorInput: '#666666',
	borderColorInputFocus: '#fff',
	colorIconGrid: '#fff',
	colorText: '#fff',
	colorTextHover: '#808080',
	colorButtonText: '#000',
	colorButtonTextHover: '#f3f3f3',
}

const LightThemeColorPalete: ColorPalete = {
	background: '#fff',
	backgroundButton: '#000',
	backgroundButtonHover: '#e6e6e6',
	backgroundEndGame: '#ffffffde',
	backgroundLoading: '#000',
	backgroundLoadingProgress: '#e6e6e6',
	backgroundDialog: '#fffffff2',
	borderColorGrid: '#000',
	borderColorTable: '#515151',
	borderColorButton: '#000',
	borderColorInput: '#808080',
	borderColorInputFocus: '#000',
	colorIconGrid: '#000',
	colorText: '#000',
	colorTextHover: '#757575',
	colorButtonText: '#fff',
	colorButtonTextHover: '#0d0d0d',
}

export const DarkTheme: Theme = {
	name: 'dark',
	color: DarkThemeColorPalete,
	...DefaultTheme,
}

export const LightTheme: Theme = {
	name: 'light',
	color: LightThemeColorPalete,
	...DefaultTheme,
}

export const Sizes = {
	xs: '420px',
	sm: '640px',
}

export const MediaQueries = {
	xs: `(min-width: ${Sizes.xs})`,
	sm: `(min-width: ${Sizes.sm})`,
}

export const GlobalStyle = createGlobalStyle`
    body {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        overflow: auto;
        -webkit-tap-highlight-color: transparent;
        -webkit-font-smoothing: antialiased;
        font-family: 'Open Sans','Helvetica Neue',sans-serif;
        background-color: ${(props) => props.theme.color.background};
        color: ${(props) => props.theme.color.colorText}
    }
    *, *:after, *:before {
      box-sizing: border-box;
    }
    #root {
      height: 100%;
    }
    @media (prefers-reduced-motion: reduce) {
      *, *:after, *:before {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
`
