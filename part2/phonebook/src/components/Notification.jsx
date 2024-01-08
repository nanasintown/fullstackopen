import { useEffect, useState } from 'react';

const Notification = ({ notification }) => {
  const { id, message, error } = notification;
  const notificationStyle = {
    color: error ? 'red' : 'green',
    backgroundColor: 'lightgrey',
    borderStyle: 'solid',
    borderColor: error ? 'red' : 'green',
    borderRadius: '.5rem',
    fontSize: '1.25rem',
    padding: '1rem',
    marginBottom: '1rem',
  };

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) setShow(true);
  }, [id, message]);

  useEffect(() => {
    const delay = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(delay);
  });

  return show ? <div style={notificationStyle}>{message}</div> : null;
};

export default Notification;
