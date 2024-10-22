import React from 'react';
import Event from './Event';
import Interval from './Interval';

const timelineBaseStyle = {
  listStyle: 'none',
  padding: '3em',
};

export default function Timeline({ timelineElements }) {
  return (
    <div style={timelineBaseStyle}>
      {timelineElements.map((element) => (
        <div key={`element-${JSON.stringify(element)}`}>
          {element.type === 'event' ? (
            <Event event={element.event} />
          ) : (
            <Interval interval={element} />
          )}
        </div>
      ))}
    </div>
  );
}
