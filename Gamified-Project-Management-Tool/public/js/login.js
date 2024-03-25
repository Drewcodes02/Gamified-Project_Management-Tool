document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById("login-form");

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
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed due to server response: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Login successful:', data);
                localStorage.setItem('token', data.token);
                window.location.href = '/dashboard'; // INPUT_REQUIRED {Ensure this is the correct URL for your dashboard page}
            })
            .catch(error => {
                console.error('Error logging in:', error);
                alert('Login failed. Please check console for more details.');
            });
        });
    }
});