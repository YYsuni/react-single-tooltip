import React, { useRef } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import SingleTooltip, { useTooltip } from './index'

type TYPE_FC = typeof SingleTooltip

export default {
	title: 'Single Tooltip',
	component: SingleTooltip,

	decorators: [
		Story => {
			const ref = useRef<HTMLButtonElement>(null)

			useTooltip(ref, 'Hello world!')

			return (
				<div
					className='flex h-full items-center justify-center overflow-auto p-8'
					style={{ backgroundImage: 'linear-gradient(140deg, rgb(165, 142, 251), rgb(233, 191, 248))' }}>
					<div className='max-w-[600px] rounded-xl bg-white/90 p-6 font-mono shadow backdrop-blur'>
						<SingleTooltip />
						<button ref={ref}>Hover me</button>
					</div>
				</div>
			)
		}
	]
} as Meta<TYPE_FC>

export const Primary: StoryObj<TYPE_FC> = {}
