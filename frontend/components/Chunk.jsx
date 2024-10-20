import React from 'react';
import moment from 'moment';

let chunkStyle = {
  display: 'flex',
  borderTop: '1px solid #eee',
  padding: '0 1em',
}

let chunkTimeStyle = {
  width: '3em',
  textAlign: 'right',
  marginRight: '0.5em',
  display: 'flex',
  alignItems: 'center',
}

let chunkTitleStyle = {
  fontSize: '2em',
}

let eventNoteStyle = {
  borderRadius: '0.5em',
  backgroundColor: '#00f2',
  padding: '0.2em 0.7em',
  margin: '0.4em 0',
  width: 'fit-content',
}

export default function Chunk({ chunk }) {
  return (
    <div style={chunkStyle}>
      {chunk.type === 'divider' && <span style={chunkTitleStyle}>{chunk.title}</span>}

      {chunk.type === 'container' && <span style={chunkTimeStyle}>
        {moment.unix(chunk.start).format('HH:mm')} 
      </span>}

      {chunk.type === 'container' && <div>
        {chunk.events.map((event) => (
          <p style={eventNoteStyle} key={event.uuid}> {event.note} </p>
        ))}
      </div>}
    </div>
  );
}
