const taskForm = document.getElementById("createTaskForm");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("registerForm");
const socketUrl = (window.location.protocol.includes("https") ? "wss://" : "ws://") + window.location.host;
const socket = new WebSocket(socketUrl);

// Handle form submission for task creation
if (taskForm) {
    taskForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const formData = new FormData(taskForm);
        const taskData = {};
        formData.forEach((value, key) => taskData[key] = value);
        
        fetch('/api/tasks/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(taskData)
        }).then(response => response.json())
          .then(data => {
            console.log('Task created:', data);
            socket.send(JSON.stringify({ type: 'taskCreated', data: taskData }));
            alert('Task created successfully');
            window.location.reload();
          }).catch(error => {
              console.error('Error creating task:', error);
              alert('Failed to create task');
          });
    });
}

// Handle WebSocket messages for real-time updates
socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case 'taskCreated':
            console.log('New task created:', message.data);
            // Add the logic to update the UI with the new task
            break;
        default:
            console.error('Unhandled message type:', message.type);
    }
};

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const loginData = {};
        formData.forEach((value, key) => loginData[key] = value);
        
        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        }).then(response => response.json())
          .then(data => {
            console.log('Login successful:', data);
            localStorage.setItem('token', data.token);
            window.location.href = '/';
          }).catch(error => {
              console.error('Error logging in:', error);
              alert('Login failed');
          });
    });
}

// Handle registration form submission
if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const userData = {};
        formData.forEach((value, key) => userData[key] = value);
        
        fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        }).then(response => response.json())
          .then(data => {
            console.log('Registration successful:', data);
            alert('Registration successful. You can now login!');
            window.location.href = '/login';
          }).catch(error => {
              console.error('Error during registration:', error);
              alert('Registration failed. Please try again.');
          });
    });
}

socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};

socket.onopen = function() {
    console.log('WebSocket connection established');
};

socket.onclose = function() {
    console.log('WebSocket connection closed');
};