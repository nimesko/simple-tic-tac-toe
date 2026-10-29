export type ColorPalete = {
	background: string
	backgroundButton: string
	backgroundButtonHover: string
	backgroundEndGame: string
	backgroundLoading: string
	backgroundLoadingProgress: string
	backgroundDialog: string

	borderColorGrid: string
	borderColorTable: string
	borderColorButton: string
	borderColorInput: string
	borderColorInputFocus: string

	colorIconGrid: string
	colorText: string
	colorTextHover: string
	colorButtonText: string
	colorButtonTextHover: string
}

export type Theme = {
	name: string
	color: ColorPalete
}
