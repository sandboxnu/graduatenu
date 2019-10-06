import * as React from 'react'

interface ThreeDotsProps {
	onClick: () => void
}

export const ThreeDots: React.SFC<ThreeDotsProps> = props => {
	return (
		<div
			onClick={props.onClick}
			style={{
				display: 'flex',
				justifyContent: 'space-around',
				flexDirection: 'row',
				alignItems: 'center',
				width: 25,
				height: 25
			}}
		>
			<div style={{ backgroundColor: 'black', borderRadius: '50%', width: 5, height: 5 }}></div>
			<div style={{ backgroundColor: 'black', borderRadius: '50%', width: 5, height: 5 }}></div>
			<div style={{ backgroundColor: 'black', borderRadius: '50%', width: 5, height: 5 }}></div>
		</div>
	)
}
