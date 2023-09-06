import React, { useEffect, useState } from 'react'
import { useTooltipRef, SingleTooltip } from '../src/index'
import NormalDialog from './normal-dialog'

export default function App() {
	const [text, setText] = useState('This is the first message.')

	const [count, setCount] = useState(0)
	useEffect(() => {
		const timer = setInterval(() => setCount(state => ++state), 1000)

		return () => clearInterval(timer)
	}, [])

	const ref = useTooltipRef('Hello!')
	const ref1 = useTooltipRef(text)
	const ref2 = useTooltipRef('Hello! Here is left-top')
	const ref3 = useTooltipRef('Hello! Here is right-top')
	const ref4 = useTooltipRef('Hello! Here is left-bottom')
	const ref5 = useTooltipRef('Hello! Here is right-bottom')

	const [open, setOpen] = useState(false)

	return (
		<>
			<SingleTooltip />

			<div className='flex h-[100vh] flex-col items-center justify-center gap-2 bg-gradient-to-b from-sky-50 to-white'>
				{count}

				<button
					onClick={() => setOpen(true)}
					className='rounded bg-slate-500 px-4 py-2 font-semibold text-white shadow'>
					Open Dialog
				</button>
				<button
					ref={ref1}
					onClick={() => setText('This is the second message.')}
					className='rounded bg-slate-500 px-4 py-2 font-semibold text-white shadow'>
					Toggle
				</button>

				<div className='mt-3 h-[400px] w-full max-w-[600px] snap-both overflow-auto rounded-lg border bg-white shadow-inner'>
					<div className='flex h-full w-[800px] items-center justify-center'>
						<button ref={ref} className='snap-center rounded bg-sky-400 px-4 py-2 font-semibold text-white shadow'>
							Hover me
						</button>
					</div>
				</div>

				<button
					ref={ref2}
					className='absolute left-4 top-4 rounded bg-sky-400 px-4 py-2 font-semibold text-white shadow'>
					Hover me
				</button>
				<button
					ref={ref3}
					className='absolute right-4 top-4 rounded bg-sky-400 px-4 py-2 font-semibold text-white shadow'>
					Hover me
				</button>
				<button
					ref={ref4}
					className='absolute bottom-4 left-4 rounded bg-sky-400 px-4 py-2 font-semibold text-white shadow'>
					Hover me
				</button>
				<button
					ref={ref5}
					className='absolute bottom-4 right-4 rounded bg-sky-400 px-4 py-2 font-semibold text-white shadow'>
					Hover me
				</button>
			</div>

			<NormalDialog open={open} setOpen={setOpen} />
		</>
	)
}
