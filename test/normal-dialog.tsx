import React, { useEffect, useRef } from 'react'
import { Dispatch } from 'react'
import { useTooltipRef } from '../src'

export default function NormalDialog({ open, setOpen }: { open: boolean; setOpen: Dispatch<boolean> }) {
	const ref = useTooltipRef('Hover in Dialog')

	if (open)
		return (
			<div className='relative z-40'>
				<div className='fixed inset-0 bg-black/25' />

				<div
					className='fixed inset-0 flex items-center justify-center overflow-y-auto'
					onClick={() => {
						setOpen(false)
					}}>
					<div
						onClick={event => {
							event.stopPropagation()
						}}
						className='flex h-[300px] w-[500px] items-center justify-center rounded-3xl bg-white p-10'>
						<button ref={ref} className='rounded bg-sky-400 px-4 py-2 font-semibold text-white shadow'>
							Hover me
						</button>
					</div>
				</div>
			</div>
		)
}
