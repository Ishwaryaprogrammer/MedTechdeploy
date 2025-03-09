

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
}// Open modal
document.getElementById('add-medicine-btn').addEventListener('click', () => {
  document.getElementById('modal').classList.remove('hidden');
});

// Close modal
document.getElementById('close-modal-btn').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

// Close modal on clicking outside modal content
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.add('hidden');
  }
});


document.getElementById('frequency').addEventListener('change', (e) => {
  if (e.target.value === 'Custom') {
    document.getElementById('custom-days').classList.remove('hidden');
  } else {
    document.getElementById('custom-days').classList.add('hidden');
  }
});

document.querySelectorAll('.days-selector button').forEach((button) => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
  });
});

document.getElementById('dietLink').addEventListener('click', function(e) {
  e.preventDefault(); 
  document.getElementById('runBtn').click(); 
});

document.getElementById('medicine-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const medicine = {};

  // Collect form data
  formData.forEach((value, key) => {
    if (key === 'when') {
      medicine[key] = medicine[key] || [];
      medicine[key].push(value); // Collect all selected values
    } else {
      medicine[key] = value;
    }
  });

  console.log(medicine);

  // Save the medicine data
  await fetch('/api/medicines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicine),
  });

  e.target.reset(); // Reset the form
  document.getElementById('modal').classList.add('hidden'); // Hide the modal
  fetchMedicines(); // Refresh the medicine list
});


async function fetchMedicines() {
  const res = await fetch('/api/medicines');
  const medicines = await res.json();

  const list = document.getElementById('medicine-list');
  list.innerHTML = ''; // Clear previous list

  medicines.forEach((medicine) => {
    const whenToTake = medicine.when?.join(', ') || 'N/A'; // Join array values with a comma
    const displayText = `${medicine.name} - ${medicine.dose} (${medicine.type}) (${whenToTake}) - ${medicine.frequency}`;

    const div = document.createElement('div');
    div.className = 'medicine-item';
    div.innerHTML = `
      <div>
        <p>${displayText}</p>
      </div>
      <button onclick="deleteMedicine('${medicine._id}')">Delete</button>
    `;

    list.appendChild(div);
  });
}



async function deleteMedicine(id) {
  await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
  fetchMedicines();
}

fetchMedicines();
