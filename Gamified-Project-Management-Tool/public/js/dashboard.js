document.addEventListener('DOMContentLoaded', function() {
    // Elements from the DOM
    const createTaskBtn = document.getElementById("createTaskBtn");
    const createTaskForm = document.getElementById("createTaskForm");
    const tasksList = document.getElementById("tasksList");
    const taskCreationModal = document.getElementById("taskCreationModal");
    const modalCloseBtn = document.querySelector("#taskCreationModal .close");
    const taskAssigneeSelect = document.getElementById("taskAssignee"); // Select element for assignees
    const messageInput = document.getElementById("messageInput"); // INPUT_REQUIRED {Ensure you have an input field for messages with this ID}
    const sendMessageButton = document.getElementById("sendMessage"); // INPUT_REQUIRED {Ensure you have a send message button with this ID}
    const chatBox = document.getElementById("chatBox"); // INPUT_REQUIRED {Ensure you have a div for displaying chat messages with this ID}

    // WebSocket initialization with socket.io
    const socket = io(); // Assuming socket.io is correctly set up on the server side

    // Joining a project-specific room
    const projectId = 'PROJECT_ID_HERE'; // INPUT_REQUIRED {Replace with dynamic project ID}
    socket.emit('joinProject', projectId);

    // Sending a message
    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value;
        socket.emit('projectMessage', { projectId, message });
        messageInput.value = ''; // Clear the input after sending
    });

    // Receiving a message
    socket.on('newMessage', (message) => {
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
    });

    function fetchTasksAndUpdateUI() {
        fetch('/api/tasks/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(tasks => {
            tasksList.innerHTML = ''; // Clear the list before appending updated tasks
            tasks.forEach(task => {
                const taskElement = document.createElement("div");
                taskElement.className = 'task-item';
                taskElement.innerHTML = `
                    <span>${task.title}</span>
                    <a href="/task?id=${task._id}" class="btn btn-primary">View Details</a>
                `;
                tasksList.appendChild(taskElement);
            });
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
    }

    // Fetch and populate assignees
    function fetchAndPopulateAssignees() {
        fetch('/api/users/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                const option = document.createElement("option");
                option.value = user._id;
                option.textContent = user.username;
                taskAssigneeSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching assignees:', error);
            alert('Failed to fetch assignees');
        });
    }

    // Call fetchAndPopulateAssignees and fetchTasksAndUpdateUI on page load
    fetchAndPopulateAssignees();
    fetchTasksAndUpdateUI();

    // Event listener for opening the task creation modal
    createTaskBtn.addEventListener("click", function() {
        taskCreationModal.style.display = 'block';
    });

    // Event listener for closing the task creation modal
    modalCloseBtn.addEventListener("click", function() {
        taskCreationModal.style.display = 'none';
    });

    // Handling clicks outside the modal to close it
    window.onclick = function(event) {
        if (event.target === taskCreationModal) {
            taskCreationModal.style.display = "none";
        }
    };

    // Event listener for form submission
    createTaskForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Prevent the default form submission
        const formData = new FormData(createTaskForm);
        const taskData = {};
        formData.forEach((value, key) => taskData[key] = value);

        // Adding a default status to taskData before submission
        taskData['status'] = 'pending';

        // Fetch API call to create a task
        fetch('/api/tasks/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Using the stored token
            },
            body: JSON.stringify(taskData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            return response.json();
        })
        .then(data => {
            console.log('Task created successfully:', data);
            alert('Task created successfully');
            socket.emit('taskCreated', { type: 'taskCreated', data: taskData }); // Updated to use socket.io
            fetchTasksAndUpdateUI(); // Refresh the task list
            taskCreationModal.style.display = 'none';
        })
        .catch(error => {
            console.error('Error creating task:', error);
            alert('Failed to create task');
        });
    });
});