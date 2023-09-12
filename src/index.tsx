import './style.css'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getScrollParent, isMobile } from './utils'

const mobile = isMobile()
const SPACING = -0.3

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
	padding?: string | number
	fontSize?: string | number
	maxWidth?: string | number
	color?: string
	zIndex?: number
	borderRadius?: number
	offset?: number | string
	trangleWidth?: number
	trangleHeight?: number
}

function SingleTooltip({
	backgroundColor = 'rgba(0, 0, 0, 0.8)',
	zIndex = 99,
	borderRadius = 12,
	offset = 4,
	padding = 12,
	fontSize = 14,
	color = 'white',
	maxWidth,
	trangleWidth = 16,
	trangleHeight = 6
}: Props) {
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
				newPointerStyle = { transform: 'rotate(180deg)', marginBottom: SPACING }
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
					newPointerStyle = {
						transform: 'rotate(90deg)',
						margin: `0 ${(trangleHeight - trangleWidth) / 2}px`,
						marginRight: (trangleHeight - trangleWidth) / 2 + SPACING
					}
				} else {
					newTextStyle = { left: -x }
				}
			} else if (overflowWidth > 0) {
				if (overflowWidth > SAFE_OFFSET_X) {
					newStyle = {
						flexDirection: 'row',
						alignItems: 'center',
						transform: 'translate(0,-50%)',
						top: sourceY + sourceHeight / 2,
						right: window.innerWidth - sourceX
					}
					newPointerStyle = {
						transform: 'rotate(-90deg)',
						margin: `0 ${(trangleHeight - trangleWidth) / 2}px`,
						marginLeft: (trangleHeight - trangleWidth) / 2 + SPACING
					}
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
			<div
				ref={textRef}
				style={{ ...textStyle, backgroundColor, borderRadius, padding, fontSize, color, maxWidth }}
				className='single-tooltip--text'>
				{text}
			</div>
			<svg
				className='single-tooltip--pointer'
				width={trangleWidth}
				height={trangleHeight}
				viewBox={`0 0 ${trangleWidth} ${trangleHeight}`}
				style={pointerStyle}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<path
					d={`M0 0C${((trangleWidth / 2) * 6.5) / 6} ${(trangleHeight * 6.5) / 6},${((trangleWidth / 2) * 5.5) / 6} ${
						(trangleHeight * 6.5) / 6
					},${trangleWidth} 0Z`}
					fill={backgroundColor}
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
		control.setStyle({ bottom: window.innerHeight - y, left: width / 2 + x })
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

interface TooltipRef<T> {
	(element: T | null): void
	current: T | null
}

function useTooltipRef<T extends HTMLElement | SVGSVGElement>(text: string, show = true) {
	const ref = useRef<T>(null)
	const setRef = useCallback(
		new Proxy(
			(element: HTMLElement | SVGSVGElement | null) => {
				if (element === ref.current) return

				if (ref.current) {
					const oldElement = ref.current as T & { _st_clear?: () => void }
					if (typeof oldElement._st_clear === 'function') {
						oldElement._st_clear()
						delete oldElement._st_clear
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

						control.setStyle({ bottom: window.innerHeight - y, left: width / 2 + x })
						control.setPointerStyle({ marginTop: SPACING })
					}

					// ToDo: Activate tooltip if cursor hovers over the element now.

					const clickHandler = () => {
						if (control.current === null || control.current !== element) {
							mouseenterHandler()

							setTimeout(() =>
								window.addEventListener(
									'click',
									event => {
										let targetPath = event.target as HTMLElement
										do {
											if (targetPath === element) return
										} while ((targetPath = targetPath.parentElement!) && targetPath !== document.body)

										if (control.current === element) mouseleaveHandler()
									},
									{
										once: true,
										// To prevent it from not closing when another element stops the event bubble.
										capture: true
									}
								)
							)
						} else if (element === control.current) {
							mouseleaveHandler()
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
			{
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
			}
		),
		[text, show]
	)

	return setRef as TooltipRef<T>
}

export { SingleTooltip, useTooltipRef, SingleTooltip as default }
