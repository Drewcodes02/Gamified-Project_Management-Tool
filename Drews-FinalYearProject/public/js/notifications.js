const socket = io();

document.addEventListener('DOMContentLoaded', function() {
  const userId = document.body.getAttribute('data-user-id'); // Dynamically fetch the current user's ID from the body attribute

  socket.on('connect', () => {
    socket.emit('joinNotificationRoom', userId);
    console.log('Connected to Socket.IO, joined notification room for user:', userId);
  });

  socket.on('notification', (notification) => {
    displayNotification(notification);
    console.log('New notification received:', notification.message);
  });

  function displayNotification(notification) {
    const notificationsContainer = document.getElementById('notificationsContainer');
    if (notificationsContainer) {
      const notificationElement = document.createElement('div');
      notificationElement.classList.add('notification');
      notificationElement.innerHTML = `
        <p>${notification.message}</p>
        <a href="${notification.link}">View</a>
      `;
      notificationsContainer.appendChild(notificationElement);
    }
  }

  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
    alert('A connection error occurred. Please check the console for more details.');
  });
});