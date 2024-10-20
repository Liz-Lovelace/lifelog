import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistory } from '../store/store';
import moment from 'moment';
import Chunk from './Chunk';
import LoginInput from './LoginInput';
import EventInput from './EventInput';

export default function App() {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.history);
  const loadingHistory = useSelector((state) => state.loadingHistory);
  let chunks = calculateChunks(history);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  return (
    <div>
      <LoginInput />
      <h1 style={{textAlign: 'center', margin: '1em'}}>LIFELOG</h1>
      <EventInput />
      {loadingHistory ? (
        <p>Loading history...</p>
      ) : (
        <ul>
          {chunks.map((chunk) => (
            <Chunk key={`chunk-${chunk.type}-${chunk.start}`} chunk={chunk} />
          ))}
        </ul>
      )}
    </div>
  );
}

function calculateChunks(history) {
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

  let chunkSize = 30 * 60;
  const chunks = [];
  let timeIndex = moment().unix();
  let lastChunkStart = timeIndex - (timeIndex % chunkSize);
  let timeout = 10000;
  let lastDay = '';
  while (sortedHistory.length > 0 && timeout > 0) {
    timeout -= 1;
    let currentDay = moment.unix(lastChunkStart).format('DD.MM.YYYY (dddd, MMMM D)');
    if (lastDay !== currentDay) {
      lastDay = currentDay;
      chunks.push({type: 'divider', title: lastDay, start: lastChunkStart});
    }
    let currentChunk = {type: 'container', events: [], start: lastChunkStart};
    while (sortedHistory.length > 0 && timeout > 0) {
      timeout -= 1
      if (sortedHistory[0].timestamp >= lastChunkStart) {
        currentChunk.events.push(sortedHistory.shift())
      } else {
        break;
      }
    }
    lastChunkStart -= chunkSize;
    chunks.push(currentChunk);
  }
  if (timeout <= 0) {
    throw 'calculateChunks timeout';
  }
  return chunks;
}
