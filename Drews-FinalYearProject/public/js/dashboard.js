document.addEventListener('DOMContentLoaded', function() {
    fetchDashboardData();
    fetchGamificationPoints();
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