document.addEventListener('DOMContentLoaded', function() {
    const createTaskForm = document.getElementById('createTaskForm');
    if (createTaskForm) {
        createTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            fetch('/tasks', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Ensure this matches the token key used in localStorage
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create task');
                }
                return response.json();
            })
            .then(data => {
                console.log('Task created:', data);
                alert('Task created successfully!');
                window.location.reload(); // Reload the page to update the task list
            })
            .catch(error => {
                console.error('Error creating task:', error);
                alert('Error creating task: ' + error.message);
            });
        });
    }

    // Task completion form submission
    const completeTaskForms = document.querySelectorAll('.completeTaskForm');
    completeTaskForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const taskId = this.dataset.taskId;
            fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                body: JSON.stringify({ status: 'completed' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Ensure this matches the token key used in localStorage
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to complete task');
                }
                return response.json();
            })
            .then(data => {
                console.log('Task completed:', data);
                alert('Task completed successfully!');
                window.location.reload(); // Reload the page to update the task list
            })
            .catch(error => {
                console.error('Error completing task:', error);
                alert('Error completing task: ' + error.message);
            });
        });
    });
    document.addEventListener('DOMContentLoaded', function() {

    const tasksList = document.getElementById('tasksList');
    
    // Fetch tasks on page load
    fetchTasks();
    
    // Event delegation for dynamically loaded buttons
    document.addEventListener('click', function(e) {
        if (e.target && e.target.matches("button.updateTask")) {
            const taskId = e.target.getAttribute('data-task-id');
            openUpdateModal(taskId);
        } else if (e.target && e.target.matches("button.deleteTask")) {
            const taskId = e.target.getAttribute('data-task-id');
            deleteTask(taskId); // Ensure this function is properly defined and accessible
        }
    });

    function fetchTasks() {
        if (tasksList) {
            fetch('/tasks', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                return response.json();
            })
            .then(tasks => displayTasks(tasks))
            .catch(error => {
                console.error('Error fetching tasks:', error);
                tasksList.innerHTML = '<p>Error fetching tasks. Please try again later.</p>';
            });
        }
    }

    function displayTasks(tasks) {
        if (tasks.length > 0) {
            const tasksHtml = tasks.map(task => `
                <div class="task">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Assigned to: ${task.assignedTo.join(', ')}</p>
                    <p>Due date: ${new Date(task.dueDate).toLocaleDateString()}</p>
                    <p>Progress: ${task.progress}%</p>
                    <p>Status: ${task.status}</p>
                    <button class="btn btn-primary updateTask" data-task-id="${task._id}">Update</button>
                    <button class="btn btn-danger deleteTask" data-task-id="${task._id}">Delete</button>
                </div>
            `).join('');
            tasksList.innerHTML = tasksHtml;
        } else {
            tasksList.innerHTML = '<p>No tasks found. Please create a new task.</p>';
        }
    }

    window.updateTask = function(taskId) {
        // Functionality to open the update modal and populate it with task data
        // Fetch task data
        fetch(`/tasks/${taskId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch task');
            }
            return response.json();
        })
        .then(task => {
            // Populate modal fields with task data
            document.getElementById('updateTaskTitle').value = task.title;
            document.getElementById('updateTaskDescription').value = task.description;
            document.getElementById('updateTaskAssignedTo').value = task.assignedTo.join(', ');
            document.getElementById('updateTaskStartDate').value = task.startDate ? task.startDate.slice(0, 10) : ''; // Format date for input
            document.getElementById('updateTaskDueDate').value = task.dueDate.slice(0, 10); // Format date for input
            document.getElementById('updateTaskProgress').value = task.progress;
            document.getElementById('updateTaskStatus').value = task.status;
            // Show the update modal
            var updateModal = new bootstrap.Modal(document.getElementById('updateTaskModal'));
            updateModal.show();
        })
        .catch(error => {
            console.error('Error fetching task:', error);
            alert('Error fetching task: ' + error.message);
        });
    };

    window.deleteTask = function(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return; // Add confirmation before deletion
        
        fetch(`/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            return response.json();
        })
        .then(data => {
            console.log('Task deleted:', data);
            alert('Task deleted successfully!');
            window.location.reload(); // Reload to update the task list
        })
        .catch(error => {
            console.error('Error deleting task:', error);
            alert('Error deleting task: ' + error.message);
        });
    }

    // Modify WebSocket functionality for real-time chat to dynamically determine the WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const chatSocket = new WebSocket(protocol + window.location.host + '/chat'); // Dynamically adjust to the current host and protocol
    chatSocket.onmessage = function(event) {
        try {
            const messageData = JSON.parse(event.data);
            if (messageData.type === 'chatMessage') {
                displayChatMessage(messageData);
            }
        } catch (error) {
            console.error('Error parsing message data:', error);
        }
    };

    function sendMessage(message) {
        if (!selectedUser) {
            alert('Please select a user to send a message.');
            return;
        }
        const messageData = { message: message, recipient: selectedUser }; // recipient is the username of the selected user
        chatSocket.send(JSON.stringify(messageData));
    }

    function displayChatMessage(messageData) {
        const chatContainer = document.getElementById('chatContainer');
        if (chatContainer) {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${messageData.sender}: ${messageData.message}`;
            chatContainer.appendChild(messageElement);
        }
    }

    let selectedUser = null;

    document.getElementById('userList').addEventListener('click', function(e) {
        if (e.target && e.target.matches("li.list-group-item")) {
            selectedUser = e.target.textContent;
            document.getElementById('chatContainer').innerHTML = ''; // Clear previous chat messages
            // Fetch and display the chat history with the selected user
            fetch(`/chat/history/${selectedUser}`)
              .then(response => response.json())
              .then(messages => {
                  messages.forEach(displayChatMessage);
              })
              .catch(error => {
                  console.error('Error fetching chat history:', error);
              });
        }
    });

    document.getElementById('sendMessageBtn').addEventListener('click', function() {
        const messageInput = document.getElementById('messageInput');
        if (messageInput.value.trim() !== '') {
            sendMessage(messageInput.value);
            messageInput.value = ''; // Clear the input after sending
        }
    });

    // Fetch analytics data from the server and render charts using Chart.js
    function renderAnalyticsCharts() {
        fetch('/analytics/userPerformance')
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('userPerformanceChart').getContext('2d');
                const chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.usernames,
                        datasets: [{
                            label: 'Tasks Completed',
                            data: data.tasksCompleted,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching user performance:', error);
            });
    }
});
});