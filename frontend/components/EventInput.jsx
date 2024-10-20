import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent } from '../store/store';

export default function EventInput() {
  const dispatch = useDispatch();
  const [newNote, setNewNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      dispatch(createEvent(newNote));
      setNewNote('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{display: 'flex', justifyContent: 'center', marginBottom: '1em'}}>
      <input
        type="text"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Enter a new note"
        style={{marginRight: '0.5em', padding: '0.5em'}}
      />
    </form>
  );
}
