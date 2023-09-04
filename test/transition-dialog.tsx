import React, { useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Dispatch, Fragment } from 'react'
import { useTooltip } from '../src'

export default function TransitionDialog({ open, setOpen }: { open: boolean; setOpen: Dispatch<boolean> }) {
	const ref = useRef<HTMLButtonElement>(null)
	useTooltip(ref, 'Hover in Dialog')
	return (
		<Transition appear show={open} as={Fragment}>
			<Dialog
				onClose={() => {
					setOpen(false)
				}}
				className='relative z-40'>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-200'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-black/25' />
				</Transition.Child>

				<div className='fixed inset-0 flex items-center justify-center overflow-y-auto'>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-200'
						enterFrom='opacity-0 scale-95'
						enterTo='opacity-100 scale-100'
						leave='ease-in duration-100'
						leaveFrom='opacity-100 scale-100'
						leaveTo='opacity-0 scale-95'>
						<Dialog.Panel className='flex h-[300px] w-[500px] items-center justify-center rounded-3xl bg-white p-10'>
							<button ref={ref} className='rounded bg-sky-400 px-4 py-2 font-semibold text-white shadow'>
								Hover me
							</button>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	)
}
