import React from 'react'

export default function EmptyBlock() {
	return (
		<div
			style={{
				...{
					backgroundColor: '#C0C0C0' // '#f41f32'
				},
				...blockStyle
			}}
		></div>
	)
}

const blockStyle = {
	width: 300,
	height: 50,
	border: '1px solid black'
}
