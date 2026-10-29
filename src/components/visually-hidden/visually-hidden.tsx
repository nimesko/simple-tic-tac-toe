import styled from 'styled-components'

// Hides the content from the screen but keeps it available to assistive technologies
export default styled.span`
	position: absolute;
	width: 1px;
	height: 1px;
	margin: -1px;
	padding: 0;
	overflow: hidden;
	clip-path: inset(50%);
	white-space: nowrap;
	border: 0;
`
