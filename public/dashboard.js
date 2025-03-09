
// Fetch user profile data
document.addEventListener('DOMContentLoaded', fetchUserProfile);

async function fetchUserProfile() {
    try {
        const response = await fetch('/userprofile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            const userData = await response.json();
            document.getElementById('username').textContent = userData.username;
            document.getElementById('email').textContent = userData.email;
        } else {
            console.error('Failed to fetch user profile');
        }
    } catch (err) {
        console.error('Error fetching user profile:', err);
    }
}


document.getElementById('runBtn').addEventListener('click', () => {
    fetch('/run-python')
        .then(response => response.text())
        .then(data => {
            alert(data);  // Shows the result when the Python script finishes
        })
        .catch(error => {
            console.error('Error:', error);
        });
    var targetUrl = "https://192.168.0.102:5001"; // Replace with actual address
    window.location.href = targetUrl;
});

document.getElementById('logoutLink').addEventListener('click', function(e) {
    e.preventDefault();  // Prevent the default anchor behavior
    
    // Send a POST request to the /logout endpoint
    fetch('/logout', {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'Logout successful') {
        // Redirect after successful logout
        window.location.href = '/';  
      } else {
        alert("Error during logout");
      }
    })
    .catch(error => console.error('Error:', error));
});

  
  