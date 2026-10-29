import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'

import App from './app'
import reportWebVitals from './report-web-vitals'
import { DarkTheme, GlobalStyle } from '@theme/theme'

const rootElement = document.getElementById('root')

if (rootElement) {
	const root = createRoot(rootElement)
	root.render(
		<StrictMode>
			<ThemeProvider theme={DarkTheme}>
				<App />
				<GlobalStyle />
			</ThemeProvider>
		</StrictMode>,
	)

	// If you want to start measuring performance in your app, pass a function
	// to log results (for example: reportWebVitals(console.log))
	// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
	reportWebVitals()
} else {
	document.body.innerText = 'Unable to render application, missing root element'
}
