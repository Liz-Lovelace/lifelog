import React from 'react';

const intervalStyle = {
  display: 'flex',
};

const intervalTimeStyle = {
  width: '6em',
  marginRight: '0.5em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
};

const intervalContainerBaseStyle = {
  width: '24px',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: '1px 0',
};

const intervalBarBaseStyle = {
  width: '60%',
  height: '100%',
  backgroundColor: 'var(--green)',
};

export default function Interval({ interval }) {
  let minutes = interval.duration / 60;
  let isShort = minutes < 25;
  let isLong = minutes > 5 * 60;
  let intervalBarStyle = { ...intervalBarBaseStyle };
  let intervalContainerStyle = { ...intervalContainerBaseStyle };

  if (isShort) {
    intervalBarStyle.width = '25%';
    intervalContainerStyle.height = '1.5em';
  } else if (isLong) {
    intervalBarStyle.width = '100%';
    intervalContainerStyle.height = `${5 * 60}px`;
  } else {
    intervalContainerStyle.height = `${minutes}px`;
  }

  return (
    <div style={intervalStyle}>
      <span style={intervalTimeStyle}>
        {Math.round(interval.duration / 60)} min
      </span>
      <div style={intervalContainerStyle}>
        <div style={intervalBarStyle} />
      </div>
    </div>
  );
}
