export const DEFAULT_NOTIFICATION = { id: 0, message: null, error: false };

export const createNotification = (message, notification) => ({
  ...notification,
  id: notification.id + 1,
  message,
  error: false,
});

export const createErrorNotification = (errorMessage, notification, error) => {
  const { response, code } = error;
  let message = '';

  if (code === 'ERR_NETWORK') {
    message = `${errorMessage}, because cannot not connect to server. Please check your network connection and try again later.`;
  } else if (response.status === 400) {
    message = `${response.data.error}`;
  } else if (response.status === 404) {
    message = `${errorMessage}, user information not found. Please check that the user exists and try again later.`;
  } else {
    message = `${errorMessage}, please try again later.`;
  }

  return { ...notification, id: notification.id + 1, message, error: true };
};
