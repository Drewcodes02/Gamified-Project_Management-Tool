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
                    // Assuming the JWT token is stored in localStorage under 'jwtToken'
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
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
                    // Assuming the JWT token is stored in localStorage under 'jwtToken'
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
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
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
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
});