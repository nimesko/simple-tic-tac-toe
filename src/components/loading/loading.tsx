import React from 'react'
import styled, { keyframes } from 'styled-components'

const LoadingAnimation = keyframes`
    0% {
        left: 0;
        width: 0%;
    }
    50% {
        left: 0;
        right: 0;
        width: 100%;
    }
    100% {
        right: 0;
        width: 0;
        left: 100%;
    }
`

const Wrapper = styled.div`
	position: relative;
	height: 4px;
	width: 100%;
	background-color: ${(props) => props.theme.color.backgroundLoading};
	border-radius: 4px;
`

const Progress = styled.div`
	position: absolute;
	height: 100%;
	top: 0;
	width: 0;
	background-color: ${(props) => props.theme.color.backgroundLoadingProgress};
	animation-duration: 3s;
	animation-name: ${LoadingAnimation};
	animation-fill-mode: both;
	animation-timing-function: ease-in-out;
	animation-iteration-count: infinite;
`

const Loading = () => {
	return (
		<Wrapper role="progressbar" aria-label="Loading">
			<Progress />
		</Wrapper>
	)
}

export default Loading
