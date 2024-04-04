document.addEventListener('DOMContentLoaded', function() {
    // Task creation form submission
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

    // Fetch and display tasks
    const tasksList = document.getElementById('tasksList');
    
    // Fetch tasks on page load
    fetchTasks();
    
    // Event delegation for dynamically loaded buttons
    document.addEventListener('click', function(e) {
        if (e.target && e.target.matches("button.updateTask")) {
            const taskId = e.target.getAttribute('data-task-id');
            openUpdateModal(taskId); // Call openUpdateModal function with taskId
        } else if (e.target && e.target.matches("button.deleteTask")) {
            const taskId = e.target.getAttribute('data-task-id');
            window.deleteTask(taskId); // Call deleteTask function with taskId
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
    }

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
});

});