import React, { useRef } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

import SingleTooltip, { useTooltip } from '../src/index'

function App() {
	const ref = useRef<HTMLButtonElement>(null)
	const ref2 = useRef<HTMLButtonElement>(null)
	const ref3 = useRef<HTMLButtonElement>(null)
	const ref4 = useRef<HTMLButtonElement>(null)
	const ref5 = useRef<HTMLButtonElement>(null)

	useTooltip(ref, 'Hello!')
	useTooltip(ref2, 'Hello! Here is left-top')
	useTooltip(ref3, 'Hello! Here is right-top')
	useTooltip(ref4, 'Hello! Here is left-bottom')
	useTooltip(ref5, 'Hello! Here is right-bottom')

	return (
		<>
			<SingleTooltip />

			<div className='flex h-[100vh] flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white'>
				<h1 className='text-2xl font-medium'>Single Tooltip</h1>

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
		</>
	)
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />)
