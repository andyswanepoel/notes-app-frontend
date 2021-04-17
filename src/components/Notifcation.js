import React from 'react';

const Notification = ({ message, dismiss }) => {
	if (message === null) {
		return null
	}

	return (
		<div className="error">
			{message}
			<button className="dismiss" onClick={dismiss}>&times;</button>
		</div>
	)
}

export default Notification;