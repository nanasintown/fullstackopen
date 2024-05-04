import { useMessageValue } from '../NotificationContext';

const Notification = () => {
  const message = useMessageValue();

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 2,
    marginBottom: 7,
    display: message.display,
  };

  return <div style={style}>{message.msg}</div>;
};

export default Notification;
