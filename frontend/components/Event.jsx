import React from 'react';
import moment from 'moment';

const eventStyle = {
  display: 'flex',
  position: 'absolute',
  transform: 'translateX(140px) translateY(-50%)',
};

const eventTimeBaseStyle = {
  color: 'var(--grey)',
  textAlign: 'right',
  marginRight: '0.5em',
  display: 'flex',
  alignItems: 'center',
};

const eventNoteBaseStyle = {
};

export default function Event({ event }) {
  let eventTimeStyle = { ...eventTimeBaseStyle };
  let eventNoteStyle = { ...eventNoteBaseStyle };

  if (event.eventType === 'day-marker') {
    eventTimeStyle.display = 'none';
    eventNoteStyle.color = 'var(--green)';
  }

  return (
    <div style={eventStyle}>
      <span style={eventTimeStyle}>
        {moment.unix(event.timestamp).format('HH:mm')}
      </span>
      <p style={eventNoteStyle}>{event.note}</p>
    </div>
  );
}
