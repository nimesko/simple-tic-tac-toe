import React, {
	KeyboardEvent,
	MouseEvent,
	ReactNode,
	useEffect,
	useRef,
} from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

export interface DialogProps {
	children: ReactNode
	isVisible: boolean
	title: string
	onClose: () => void
}

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const Wrapper = styled.dialog`
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: ${(props) => props.theme.color.backgroundDialog};
	max-width: 760px;
	&:focus {
		outline: none;
	}
`

const Content = styled.div`
	width: 100%;
`

const CloseButton = styled.button`
	position: absolute;
	top: 1rem;
	right: 1rem;
	width: 2.75rem;
	height: 2.75rem;
	padding: 0;
	background: none;
	border: 1px solid ${(props) => props.theme.color.borderColorButton};
	border-radius: 4px;
	color: ${(props) => props.theme.color.colorText};
	font-size: 1.5rem;
	line-height: 1;
	cursor: pointer;
	&:focus-visible {
		outline: 3px solid ${(props) => props.theme.color.borderColorInputFocus};
		outline-offset: 2px;
	}
`

interface OpenDialogProps {
	children: ReactNode
	title: string
	onClose: () => void
}

const OpenDialog = ({ children, title, onClose }: OpenDialogProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)

	// Moves the focus into the dialog, and gives it back to the previous element when closing
	useEffect(() => {
		const previous = document.activeElement as HTMLElement
		const dialog = dialogRef.current as HTMLDialogElement
		const content = contentRef.current as HTMLDivElement
		const first = content.querySelector<HTMLElement>(FOCUSABLE)

		;(first ?? dialog).focus()

		return () => previous.focus()
	}, [])

	// Keeps the keyboard focus inside the dialog
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== 'Tab') {
			return
		}
		const dialog = dialogRef.current as HTMLDialogElement
		const focusable = Array.from(
			dialog.querySelectorAll<HTMLElement>(FOCUSABLE),
		)
		const first = focusable[0]
		const last = focusable[focusable.length - 1]
		const isOnFirst = document.activeElement === first
		const isOnDialog = document.activeElement === dialog

		if (event.shiftKey && (isOnFirst || isOnDialog)) {
			event.preventDefault()
			last.focus()
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault()
			first.focus()
		}
	}

	const handleOnClickClose = (event: MouseEvent) => {
		event.stopPropagation()
		onClose()
	}

	return (
		<Wrapper
			ref={dialogRef}
			open
			aria-modal="true"
			aria-label={title}
			tabIndex={-1}
			onClick={onClose}
			onKeyDown={handleKeyDown}
		>
			<Content ref={contentRef}>{children}</Content>
			<CloseButton
				type="button"
				aria-label={`Close ${title}`}
				onClick={handleOnClickClose}
			>
				<span aria-hidden="true">&times;</span>
			</CloseButton>
		</Wrapper>
	)
}

const Dialog = ({ onClose, children, isVisible, title }: DialogProps) => {
	useEffect(() => {
		const onKeyUp = (event: globalThis.KeyboardEvent) => {
			const value = event.key.trim()
			if (/escape/i.test(value)) {
				onClose()
			}
		}
		document.addEventListener('keyup', onKeyUp)
		return () => document.removeEventListener('keyup', onKeyUp)
	}, [])

	if (!isVisible) {
		return null
	}

	const modalRoot = document.getElementById('modal-root') as HTMLDivElement

	return createPortal(
		<OpenDialog title={title} onClose={onClose}>
			{children}
		</OpenDialog>,
		modalRoot,
	)
}

Dialog.defaultProps = {
	isVisible: false,
}

export default Dialog
