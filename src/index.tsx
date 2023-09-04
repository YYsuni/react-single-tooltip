import './style.css'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getScrollParent, isMobile } from './utils'

const mobile = isMobile()

const initConfig = () => ({
	setStyle: (_: React.CSSProperties) => {
		reportError('SingleTooltip has not been initialized yet!')
	},
	setTextStyle: (_: React.CSSProperties) => {},
	setPointerStyle: (_: React.CSSProperties) => {},
	setText: (_: string) => {},
	hover: false,
	current: null as HTMLElement | SVGSVGElement | null,
	scrollableParents: new Map<HTMLElement | Window, number>(),
	init: false
})

const control = initConfig()

interface Props {
	backgroundColor?: string
	zIndex?: number
	borderRadius?: number
	offset?: number | string
}

function SingleTooltip({ backgroundColor = 'rgba(0, 0, 0, 0.8)', zIndex = 99, borderRadius = 12, offset = 4 }: Props) {
	const [text, setText] = useState('')
	const textRef = useRef<HTMLDivElement>(null)

	const [style, _setStyle] = useState<React.CSSProperties>({ display: 'none' })
	const [style_amend, setStyle_amend] = useState<React.CSSProperties>({ display: 'none' })

	const [textStyle, setTextStyle] = useState<React.CSSProperties>({})
	const [pointerStyle, setPointerStyle] = useState<React.CSSProperties>({})

	useEffect(() => {
		if (control.init) reportError('SingleTooltip can only be initialized once!')

		const setStyle = (s: React.CSSProperties) => {
			_setStyle(s)
			setStyle_amend(s)
		}
		control.setStyle = setStyle
		control.setTextStyle = setTextStyle
		control.setPointerStyle = setPointerStyle
		control.setText = setText
		control.init = true

		return () => {
			Object.assign(control, initConfig())
		}
	}, [])

	useLayoutEffect(() => {
		if (style.display !== 'none' && control.current) {
			const { x, y, right, width } = textRef.current!.getBoundingClientRect()

			const SAFE_WIDTH = width - 2 * borderRadius
			const SAFE_OFFSET_X = SAFE_WIDTH / 2 - 10

			const overflowWidth = right - window.innerWidth
			if (x >= 0 && overflowWidth <= 0 && y > 0) return

			const {
				y: sourceY,
				x: sourceX,
				height: sourceHeight,
				width: sourceWidth
			} = control.current.getBoundingClientRect()

			let newStyle: React.CSSProperties | null = null
			let newTextStyle: React.CSSProperties | null = null
			let newPointerStyle: React.CSSProperties | null = null

			if (y < 0) {
				newStyle = {
					flexDirection: 'column-reverse',
					top: sourceY + sourceHeight,
					left: sourceX + sourceWidth / 2
				}
				newPointerStyle = { transform: 'rotate(180deg)' }
			}

			if (x < 0) {
				if (-x > SAFE_OFFSET_X) {
					newStyle = {
						flexDirection: 'row-reverse',
						alignItems: 'center',
						transform: 'translate(0,-50%)',
						top: sourceY + sourceHeight / 2,
						left: sourceX + sourceWidth
					}
					newPointerStyle = { transform: 'rotate(90deg)', margin: '0 6.5px' }
				} else {
					newTextStyle = { left: -x }
				}
			} else if (overflowWidth > 0) {
				if (overflowWidth > SAFE_OFFSET_X) {
					newStyle = {
						alignItems: 'center',
						transform: 'translate(0,-50%)',
						top: sourceY + sourceHeight / 2,
						right: window.innerWidth - sourceX
					}
					newPointerStyle = { transform: 'rotate(-90deg)', margin: '0 6.5px' }
				} else {
					newTextStyle = { right: overflowWidth }
				}
			}

			if (newStyle) setStyle_amend(newStyle)
			if (newTextStyle) setTextStyle(newTextStyle)
			if (newPointerStyle) setPointerStyle(newPointerStyle)
		}
	}, [style])

	return (
		<div className='single-tooltip' style={{ ...style_amend, zIndex, position: 'fixed', padding: offset }}>
			<div ref={textRef} style={{ ...textStyle, backgroundColor, borderRadius }} className='single-tooltip--text'>
				{text}
			</div>
			<svg
				className='single-tooltip--pointer'
				width='20'
				height='7'
				viewBox='0 0 20 7'
				style={pointerStyle}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<path
					fill={backgroundColor}
					d='M5.7021 4.56168C7.41751 5.93401 8.27522 6.62017 9.24878 6.80633C9.7451 6.90123 10.2549 6.90123 10.7512 6.80633C11.7248 6.62017 12.5825 5.93401 14.2979 4.56168L20 0H0L5.7021 4.56168Z'
				/>
			</svg>
		</div>
	)
}

const mouseleaveHandler = () => {
	if (control.init && control.hover) {
		control.hover = false
		control.setStyle({ display: 'none' })
		control.current = null
	}
}

const scrollHandler = () => {
	if (control.hover && control.current) {
		const { y, x, width } = control.current.getBoundingClientRect()

		control.setTextStyle({})
		control.setPointerStyle({})
		control.setStyle({ display: 'block', bottom: window.innerHeight - y, left: width / 2 + x })
	}
}

function AddScrollListener(element: HTMLElement | Window) {
	if (control.scrollableParents.has(element)) {
		control.scrollableParents.set(element, control.scrollableParents.get(element)! + 1)
	} else {
		element.addEventListener('scroll', scrollHandler)
		control.scrollableParents.set(element, 0)
	}
}
function RemoveScrollListener(element: HTMLElement) {
	if (control.scrollableParents.has(element)) {
		const count = control.scrollableParents.get(element)!
		if (count > 1) {
			control.scrollableParents.set(element, count - 1)
		} else {
			element.removeEventListener('scroll', scrollHandler)
			control.scrollableParents.delete(element)
		}
	}
}
AddScrollListener(window)

function useTooltipRef<T extends HTMLElement | SVGSVGElement>(text: string, show = true) {
	const ref = useRef<T>(null)
	const setRef = useCallback(
		(element: HTMLElement | SVGSVGElement | null) => {
			if (ref.current) {
				// @ts-ignore
				if (typeof ref.current._st_clear === 'function') {
					// @ts-ignore
					ref.current._st_clear()
					// @ts-ignore
					delete ref.current._st_clear
				}
			}

			if (element && show) {
				const mouseenterHandler = () => {
					control.setTextStyle({})
					control.setPointerStyle({})
					control.setText(text)
					control.hover = true
					control.current = element

					const { y, x, width } = element!.getBoundingClientRect()

					control.setStyle({ display: 'block', bottom: window.innerHeight - y, left: width / 2 + x })
				}

				const clickHandler = () => {
					if (control.current === null || control.current !== element) {
						mouseenterHandler()

						setTimeout(() =>
							window.addEventListener('click', () => control.current === element && mouseleaveHandler(), { once: true })
						)
					}
				}

				if (mobile) {
					element.addEventListener('click', clickHandler)
				} else {
					element.addEventListener('mouseenter', mouseenterHandler)
					element.addEventListener('mouseleave', mouseleaveHandler)
				}

				const tooltipScrollParent = getScrollParent(element)

				if (tooltipScrollParent) {
					AddScrollListener(tooltipScrollParent)
				}

				const clear = () => {
					if (mobile) {
						element.removeEventListener('click', clickHandler)
					} else {
						element.removeEventListener('mouseenter', mouseenterHandler)
						element.removeEventListener('mouseleave', mouseleaveHandler)
					}

					if (tooltipScrollParent) {
						RemoveScrollListener(tooltipScrollParent)
					}

					if (control.current === element) mouseleaveHandler()
				}

				// @ts-ignore
				element._st_clear = clear
			}

			// @ts-ignore
			ref.current = element
		},
		[show]
	)

	return new Proxy(setRef, {
		get(target, prop, receiver) {
			if (prop === 'current') {
				return ref.current
			}

			return Reflect.get(target, prop, receiver)
		},
		set(target, prop, value, receiver) {
			if (prop === 'current') {
				// @ts-ignore
				ref.current = value
			}

			return Reflect.set(target, prop, value, receiver)
		}
	})
}

export { SingleTooltip, useTooltipRef, SingleTooltip as default }
