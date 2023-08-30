import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getScrollParent, isMobile } from './utils'
import { ReactComponent as PointerSVG } from './svgs/pointer.svg'

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

export default function SingleTooltip() {
	const [text, setText] = useState('')
	const textRef = useRef<HTMLDivElement>(null)

	const [style, _setStyle] = useState<React.CSSProperties>({ display: 'none' })
	const [style_amend, setStyle_amend] = useState<React.CSSProperties>({ display: 'none' })

	const [textStyle, setTextStyle] = useState<React.CSSProperties>()
	const [pointerStyle, setPointerStyle] = useState<React.CSSProperties>()

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
		if (style.display !== 'none') {
			const { x, y, right, width } = textRef.current!.getBoundingClientRect()

			const SAFE_WIDTH = width - 2 * 12
			const SAFE_OFFSET_X = SAFE_WIDTH / 2 - 10

			const overflowWidth = right - window.innerWidth
			if (x >= 0 && overflowWidth <= 0 && y > 0) return

			const {
				y: sourceY,
				x: sourceX,
				height: sourceHeight,
				width: sourceWidth
			} = control.current!.getBoundingClientRect()

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
					newPointerStyle = { transform: 'rotate(90deg)', marginRight: -7 }
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
					newPointerStyle = { transform: 'rotate(-90deg)', marginLeft: -7 }
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
		<div className='fixed z-[60] flex -translate-x-1/2' style={style_amend}>
			<div
				ref={textRef}
				style={textStyle || undefined}
				className='bg-text relative w-max max-w-[360px] whitespace-normal break-all rounded-xl p-3 text-xs font-semibold text-white max-sm:max-w-[200px]'>
				{text}
			</div>
			<PointerSVG className='mx-auto' style={pointerStyle || undefined} />
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
		control.setStyle({ display: 'block', bottom: window.innerHeight - y + 4, left: width / 2 + x })
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

export function useTooltip(ref: React.RefObject<HTMLElement | SVGSVGElement>, text: string, show = true) {
	useEffect(() => {
		if (ref.current && show) {
			const mouseenterHandler = () => {
				control.setTextStyle({})
				control.setPointerStyle({})
				control.setText(text)
				control.hover = true
				control.current = ref.current

				const { y, x, width } = ref.current!.getBoundingClientRect()

				control.setStyle({ display: 'block', bottom: window.innerHeight - y + 4, left: width / 2 + x })
			}

			const element = ref.current

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

			return () => {
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
		}
	}, [ref.current, show])
}
