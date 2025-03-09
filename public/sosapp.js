// Check if the browser supports Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();

  // Set properties for continuous listening
  recognition.continuous = true; // Keep listening after a command
  recognition.interimResults = false; // Get results only after the speech ends

  // Start listening when the app is loaded
 
  recognition.start();

  


  // Event handler for recognized speech
  recognition.onresult = async (event) => {
    const lastResult = event.results[event.results.length - 1];
    const transcript = lastResult[0].transcript.toLowerCase();
    console.log("Heard:", transcript);

    if (transcript.includes("help me") || transcript.includes("kaphathunga")) {
      console.log("SOS Triggered!");

      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendSOS, handleLocationError);
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }
  };

  // Restart recognition for continuous listening
  recognition.onend = () => {
    console.log("Speech recognition ended, restarting...");
    recognition.start();
  };

  // Handle errors in speech recognition
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    if (event.error === "not-allowed") {
      alert("Microphone access denied. Please enable it in your browser settings.");
    }
  };
} else {
  alert("Speech recognition is not supported in this browser.");
}

// Check if the browser supports the MediaDevices API for microphone access
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("MediaDevices API is supported.");

  // Request microphone access
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      console.log("Microphone access granted.");
      // Stop the stream to release the microphone if not needed immediately
      stream.getTracks().forEach(track => track.stop());
    })
    .catch((error) => {
      console.error("Microphone access denied or an error occurred:", error);
      handleMicrophoneError(error);
    });
} else {
  console.error("MediaDevices API is not supported by this browser.");
  alert("Your browser does not support microphone access. Please try using a modern browser like Chrome or Firefox.");
}

// Function to handle microphone errors
function handleMicrophoneError(error) {
  if (error.name === "NotAllowedError") {
    alert("Microphone access denied. Please enable it in your browser settings.");
  } else if (error.name === "NotFoundError") {
    alert("No microphone found. Please connect a microphone and try again.");
  } else if (error.name === "NotReadableError") {
    alert("Microphone is being used by another application. Please close it and try again.");
  } else {
    alert("An error occurred while accessing the microphone: " + error.message);
  }
}

// Function to handle location errors
function handleLocationError(error) {
  console.error("Error getting location:", error);
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("Location access denied. Please enable it in your browser settings.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("Location request timed out. Please try again.");
      break;
    default:
      alert("An unknown error occurred while accessing location.");
  }
}


// Function to send SOS message
async function sendSOS(position) {
  const { latitude, longitude } = position.coords;
  const userLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;


  const apiKey = '077181d24d0c436a9c5576b36d6f0d10'; // Replace with your Google Maps API key
  const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${apiKey}`;
  

  let address = 'Address not found';

  try {
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    console.log("OpenCage API Response:", data);

    if (data.results && data.results.length > 0) {
      address = data.results[0].formatted; // Using the 'formatted' field for address
    } else {
      console.error("No address found for the provided coordinates.");
      alert("No address found for the provided coordinates.");
    }

    const message = `Help me! I'm in trouble. Please come immediately to the location: ${address}.`;

    // Send the SOS message
    const sosResponse = await fetch('/send-sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, location: userLocation }),
    });

    const sosData = await sosResponse.json();
    console.log("SOS sent successfully:", sosData);
    alert("SOS sent successfully!");
    
  } catch (error) {
    console.error("Error sending SOS:", error);
    alert("Failed to send SOS. Please try again.");
  }
}





// Start microphone check when the page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing microphone and speech recognition...");
});


