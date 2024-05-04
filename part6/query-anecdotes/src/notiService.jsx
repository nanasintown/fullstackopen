/* eslint-disable react/prop-types */
import { createContext, useReducer, useContext } from 'react';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'DISPLAY_MESSAGE': {
      const message = {
        msg: action.msg,
        display: '',
      };
      return message;
    }
    case 'CLEAR_MESSAGE': {
      const message = {
        msg: '',
        display: 'none',
      };
      return message;
    }
    default: {
      const message = {
        msg: '',
        display: 'none',
      };
      return message;
    }
  }
};

const initalState = {
  msg: '',
  display: 'none',
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [message, messageDispatch] = useReducer(
    notificationReducer,
    initalState
  );

  return (
    <NotificationContext.Provider value={[message, messageDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useMessageValue = () => {
  const displayAndDispatch = useContext(NotificationContext);
  return displayAndDispatch[0];
};

export const useMessageDispatch = () => {
  const displayAndDispatch = useContext(NotificationContext);
  return displayAndDispatch[1];
};

export default NotificationContext;
