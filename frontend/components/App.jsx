import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistory } from '../store/store';
import moment from 'moment';
import Timeline from './Timeline';
import LoginInput from './LoginInput';
import EventInput from './EventInput';

export default function App() {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.history);
  const loadingHistory = useSelector((state) => state.loadingHistory);
  let timelineElements = [];
  if (history.length > 0) {
    timelineElements = composeTimeline(history);
  }

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  return (
    <>
      <LoginInput />
      <h1 style={{textAlign: 'center', margin: '1em'}}>LIFELOG</h1>
      <EventInput />
      {loadingHistory ? (
        <p>Loading history...</p>
      ) : (
        <Timeline timelineElements={timelineElements} />
      )}
    </>
  );
}

function composeTimeline(_history) {
  let history = addDayEvents(JSON.parse(JSON.stringify(_history)));
  let sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

  let timeline = [];
  for (let i = 0; i < sortedHistory.length; i++) {
    let currentEvent = sortedHistory[i];
    let nextEvent = sortedHistory[i + 1];

    if (!currentEvent.eventType) {
      currentEvent.eventType = 'default';
    }

    timeline.push({type: 'event', event: currentEvent});

    if (nextEvent) {
      timeline.push({type: 'interval', key: currentEvent.uuid, duration: currentEvent.timestamp - nextEvent.timestamp});
    }
  }

  return timeline;
}

function addDayEvents(history) {
  if (history.length === 0) return [];

  let days = new Set();
  history.forEach(e => days.add(moment.unix(e.timestamp).endOf('day').unix()));

  for (let dayTimestamp of days) {
    history.push({
      timestamp: dayTimestamp,
      note: moment.unix(dayTimestamp).format('DD.MM.YYYY (dddd, MMMM D)'),
      eventType: 'day-marker'
    });
  }

  let sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

  let firstNormalEvent = sortedHistory.find(e => e.eventType !== 'day-marker');
  sortedHistory.find(e => e.eventType === 'day-marker').timestamp = firstNormalEvent.timestamp + 1;

  return sortedHistory;
}