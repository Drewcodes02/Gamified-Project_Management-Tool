document.addEventListener('DOMContentLoaded', function() {
    fetchDashboardData();
    fetchGamificationPoints();
    setupTodoFormSubmission();
});

function fetchDashboardData() {
    fetch('/dashboard/data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dashboard data fetched successfully:', data);
        updateDashboardWidgets(data);
        populateTodosAndDeadlines(data.data.tasksForTodoAndDeadlines);
        renderTaskProgressChart(data.data.dashboard.taskProgressData);
        renderTaskStatusPieChart(data.data.dashboard.taskStatusData);
    })
    .catch(error => {
        console.error('Error fetching dashboard data:', error.message, error.stack);
    });
}

function fetchGamificationPoints() {
    fetch('/gamification/points')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Gamification points fetched successfully:', data);
        if (data && data.points !== undefined) {
            document.getElementById('total-points').textContent = data.points;
        }
    })
    .catch(error => {
        console.error('Error fetching gamification points:', error.message, error.stack);
    });
}

function updateDashboardWidgets(data) {
    if (!data || !data.data) {
        console.error('Invalid data structure for dashboard widgets:', data);
        return;
    }
    document.getElementById('tasks-completed').textContent = data.data.tasksCompleted;
    // The total points widget will now be updated by fetchGamificationPoints function
    const taskProgressBar = document.getElementById('task-progress-bar');
    if (taskProgressBar) {
        taskProgressBar.style.width = data.data.taskProgress + '%';
        taskProgressBar.setAttribute('aria-valuenow', data.data.taskProgress);
        taskProgressBar.textContent = data.data.taskProgress + '%';
    } else {
        console.error('Task progress bar element not found');
    }
    document.getElementById('messages-count').textContent = data.data.messagesCount;
}

function renderTaskProgressChart(taskProgressData) {
    const ctx = document.getElementById('taskProgressChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: taskProgressData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderTaskStatusPieChart(taskStatusData) {
    const ctx = document.getElementById('taskStatusPieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: taskStatusData
    });
}

function populateTodosAndDeadlines(tasks) {
    const todoList = document.getElementById('todoList');
    const deadlinesList = document.getElementById('deadlinesList');
    todoList.innerHTML = '';
    deadlinesList.innerHTML = '';
    tasks.forEach((task, index) => {
        if (task.status === 'inProgress') {
            const todoItem = document.createElement('li');
            todoItem.classList.add('list-group-item');
            todoItem.textContent = task.title;
            todoItem.id = `task-${task._id}`;
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.classList.add('btn', 'btn-success', 'btn-sm', 'float-right');
            completeButton.onclick = () => completeTask(task._id);
            todoItem.appendChild(completeButton);
            todoList.appendChild(todoItem);
        }
        const deadlineRow = document.createElement('tr');
        deadlineRow.innerHTML = `<th scope="row">${index + 1}</th><td>${task.title}</td><td>${new Date(task.dueDate).toLocaleDateString()}</td>`;
        deadlinesList.appendChild(deadlineRow);
    });
}

function setupTodoFormSubmission() {
    const addTodoForm = document.getElementById('addTodoForm');
    addTodoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskName = e.target.elements.taskName.value;
        if (!taskName) {
            alert('Please enter a task name.');
            return;
        }
        fetch('/api/tasks/addTodo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: taskName, description: 'Added from dashboard', dueDate: new Date() }),
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.task) {
                // Dynamically update the todo list
                const newTodoItem = document.createElement('li');
                newTodoItem.classList.add('list-group-item');
                newTodoItem.textContent = data.task.title;
                document.getElementById('todoList').appendChild(newTodoItem);
            } else {
                console.error('Failed to add task');
            }
        })
        .catch(error => {
            console.error('Error adding task:', error.message, error.stack);
        });
    });
}

function completeTask(taskId) {
    fetch(`/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include JWT for authentication
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log(data.message);
            document.getElementById(`task-${taskId}`).remove();
            // Optionally, refresh gamification points and leaderboard here
        }
    })
    .catch(error => {
        console.error('Error marking task as complete:', error.message, error.stack);
    });
}