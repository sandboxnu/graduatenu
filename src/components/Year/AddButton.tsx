import * as React from 'react'

interface AddButtonProps {
	onClick?: () => void
}

export const AddButton: React.SFC<AddButtonProps> = props => {
	return (
		<button onClick={props.onClick} style={buttonStyle}>
			<p style={{ textAlign: 'center', fontSize: 16, position: 'relative', top: -16 }}>+</p>
		</button>
	)
}

const buttonStyle = {
	borderRadius: '50%',
	width: 25,
	height: 25,
	justifyContent: 'center',
	alignItems: 'center',
	alignContent: 'center'
}
