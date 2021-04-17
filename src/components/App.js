import React, { useState, useEffect } from 'react';
import Note from './Note';
import Notification from './Notifcation';
import '../style.css'


import noteService from '../services/notes'

const App = (props) => {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState();
	const [showAll, setShowAll] = useState(true)
	const [errorMessage, setErrorMessage] = useState(null)

	useEffect(() => {
		noteService
			.getAll()
			.then(initialNotes => {
				setNotes(initialNotes)
			})
	}, [])

	const addNote = e => {
		e.preventDefault();
		const noteObject = {
			content: newNote,
			date: new Date().toISOString(),
			important: Math.random() < 0.5,
		}

		noteService
			.create(noteObject)
			.then(returnedNote => {
				setNotes(notes.concat(returnedNote))
				setNewNote('')
			})
	}

	const toggleImportanceOf = id => {
		const note = notes.find(n => n.id === id);
		const updatedNote = { ...note, important: !note.important };

		noteService
			.update(id, updatedNote)
			.then(returnedNote => {
				setNotes(notes.map(note => note.id !== id ? note : returnedNote));
			})
			.catch(error => {
				setErrorMessage(
					`Note '${note.content}' was already removed from server`
				)
				setNotes(notes.filter(n => n.id !== id))
			})
	}

	const handleNoteChange = e => {
		setNewNote(e.target.value);
	}

	const notesToShow = showAll
		? notes
		: notes.filter(note => note.important);

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} dismiss={() => setErrorMessage(null)}/>
			<div>
				<button onClick={() => setShowAll(!showAll)}>
					show {showAll ? 'important' : 'all'}
				</button>
			</div>
			<ul>
				{notesToShow.map(note =>
					<Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
				)}
			</ul>
			<form onSubmit={addNote}>
				<input
					type="text"
					value={newNote}
					onChange={handleNoteChange} />
				<button type="submit">save</button>
			</form>
		</div>
	)
}

export default App;