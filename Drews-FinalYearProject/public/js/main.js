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

    // Fetch and display tasks
    const tasksList = document.getElementById('tasksList');
    if (tasksList) {
        fetch('/tasks', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Ensure this matches the token key used in localStorage
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        })
        .then(tasks => {
            if (tasks.length > 0) {
                const tasksHtml = tasks.map(task => `
                    <div class="task">
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <p>Assigned to: ${task.assignedTo.join(', ')}</p>
                        <p>Due date: ${new Date(task.dueDate).toLocaleDateString()}</p>
                        <p>Progress: ${task.progress}%</p>
                        <p>Status: ${task.status}</p>
                        <button class="btn btn-primary" onclick="updateTask('${task._id}')">Update</button>
                        <button class="btn btn-danger" onclick="deleteTask('${task._id}')">Delete</button>
                    </div>
                `).join('');
                tasksList.innerHTML = tasksHtml;
            } else {
                tasksList.innerHTML = '<p>No tasks found. Please create a new task.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            tasksList.innerHTML = '<p>Error fetching tasks. Please try again later.</p>';
        });
    }

    window.updateTask = function(taskId) {
        // Redirect to task update page
        window.location.href = `/tasks/edit/${taskId}`; // Updated to match the application's routing for task updates
    }

    window.deleteTask = function(taskId) {
        fetch(`/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Ensure this matches the token key used in localStorage
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
            window.location.reload();
        })
        .catch(error => {
            console.error('Error deleting task:', error);
            alert('Error deleting task: ' + error.message);
        });
    }
});