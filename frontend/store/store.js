import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

let apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:4444' : 'https://lifelog.liz-lovelace.com';

const initialState = {
  history: [],
  loadingHistory: false,
};

export const fetchHistory = () => async (dispatch) => {
  dispatch({ type: 'FETCH_HISTORY_START' });
  try {
    const response = await fetch(`${apiUrl}/history`, {
      credentials: 'include',
    });
    const data = await response.json();
    dispatch({ type: 'FETCH_HISTORY_SUCCESS', payload: data.history });
  } catch (error) {
    console.error('Error fetching history:', error);
    dispatch({ type: 'FETCH_HISTORY_ERROR', payload: error.message });
  }
};

export const createEvent = (note) => async (dispatch) => {
  console.log(note);
  const response = await fetch(`${apiUrl}/event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ note }),
    credentials: 'include',
  });
  const data = await response.json();
  if (data.error) {
    console.error('Error creating event:', data.error);
  } else {
    dispatch({ type: 'ADD_EVENT', payload: data.event });
  }
};

export const login = async (password) => {
  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
      credentials: 'include',
    });
    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: 'Login failed' };
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: 'Network error' };
  }
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_HISTORY_START':
      return { ...state, loadingHistory: true };
    case 'FETCH_HISTORY_SUCCESS':
      return { ...state, history: action.payload, loadingHistory: false };
    case 'FETCH_HISTORY_ERROR':
      return { ...state, loadingHistory: false };
    case 'ADD_EVENT':
      return { ...state, history: [action.payload, ...state.history] };
    default:
      return state;
  }
}

// Create the store
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
