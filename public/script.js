
let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
}

var swiper = new Swiper(".review-slider", {
    spaceBetween: 20,
    centeredSlides: true,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    loop: true,
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        640: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});



// Function to show error or success message using browser alert
function showAlert(message, isSuccess = false) {
  if (isSuccess) {
    alert("Success: " + message);  // Show success message in browser alert
  } else {
    alert("Error: " + message);    // Show error message in browser alert
  }
}

// Example usage with signup and login forms:

// Signup form submission handling
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const phonenumber = document.getElementById('phonenumber').value;
  const emergencycontact = document.getElementById('emergencycontact').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!username || !email || !password || !emergencycontact || !phonenumber) {
    showAlert('Please fill in all fields', false);
    return;
  }

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, phonenumber, emergencycontact, email, password }),
    });

    const data = await response.text();

    if (response.status === 201) {
      showAlert(data, true);
      document.getElementById('signupForm').reset();

      window.location.href = "#login"; // Redirect to login section
    } else {
      showAlert(data, false);
    }
  } catch (error) {
    console.error('Signup error:', error);
    showAlert('An error occurred during signup', false);
  }
});

// Login form submission handling
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showAlert('Please fill in all fields', false);
    return;
  }

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.text();

    if (response.status === 200) {
      showAlert(data, true);
      document.getElementById('signupForm').reset();

      window.location.href = "public/Dashboard.html";
    } else {
      showAlert(data, false);
    }
  } catch (error) {
    console.error('Login error:', error);
    showAlert('An error occurred during login', false);
  }
});


app.get('/userprofile', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).send("Unauthorized");
    }

    const user = await User.findById(req.session.userId).select('username email');
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).send("Server error");
  }
});