import styled from 'styled-components'

export default styled.div.withConfig({
	shouldForwardProp: (props) => !['size', 'disabled'].includes(props),
})<{ size: number; disabled: boolean }>`
	display: grid;
	grid-template-columns: repeat(${({ size }) => size}, 1fr);
	grid-template-rows: repeat(${({ size }) => size}, 1fr);
	height: 100%;
	width: 100%;
	grid-gap: 1px;
	pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`
