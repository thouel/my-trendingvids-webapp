'use client';

import { NotificationContext } from './Contexts';
import { createPortal } from 'react-dom';
import Notification from 'app/components/Notification';
const { useState, useReducer } = require('react');

const initialState = [];

export const ACTIONS = {
  Add: 'ADD',
  Remove: 'REMOVE',
  RemoveAll: 'REMOVE_ALL',
};

export const TYPES = {
  Success: 'success',
  Info: 'info',
  Warning: 'warning',
  Error: 'error',
};

export const notificationReducer = (state, action) => {
  const newId = +new Date();
  console.log('reducer', { newId, state, action });
  try {
    switch (action.type) {
      case ACTIONS.Add:
        // Filter the state to make sure we do not add multiple times
        // the same Notification.
        // Dispatch function may be called multiple times by React
        if (
          state.filter(
            (t) =>
              t.id === newId && t.content.type === action.payload.content.type,
          ).length > 0
        )
          return state;

        return [
          ...state,
          {
            id: newId,
            content: action.payload.content,
            type: action.type,
          },
        ];
      case ACTIONS.Remove:
        return state.filter((t) => t.id !== action.payload.id);
      case ACTIONS.RemoveAll:
        return initialState;
      default:
        return state;
    }
  } finally {
    console.log('end of reducer', { state, action });
  }
};

export const NotificationProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    initialState,
  );
  const notificationData = {
    notification,
    notificationDispatch,
  };
  return (
    <NotificationContext.Provider value={notificationData}>
      {props.children}
      <Notification notification={notification} />
      {/* {typeof window !== 'undefined'
        ? createPortal(
            document.body,
          )
        : ''} */}
    </NotificationContext.Provider>
  );
};
