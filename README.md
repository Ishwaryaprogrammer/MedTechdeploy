# MEDTECH

## Introduction

This project provides SOS alerts, medication reminders, and virtual meeting links to help users stay connected with loved ones. It also offers personalized diet and health recommendations to enhance overall well-being.

### Table of Contents

1. [Key Features](#key-features)

2. [Technologies Used](#technologies-used)

3. [Workflow of the Project](#workflow-of-the-project)

4. [Project Structure](#project-structure)

5. [Prerequisites](#prerequisites)
   - [Software Requirements](#software-requirements)
   - [Accounts Setup](#accounts-setup)
   - [Installing Dependencies](#installing-dependencies)

6. [SSL and IP](#ssl-and-ip)

7. [Running the Project](#running-the-project)

8. [Screenshots](#screenshots)

9. [Future Scope](#future-scope)

10. [Contact Information](#contact-information)

---

### Key Features

1. **SOS Emergency Alerts**:
   - A voice-activated SOS feature that enables users to send emergency alerts to pre-defined contacts with just a voice command. This ensures that help is always a voice away in critical situations.

2. **Medication Reminders**:
   - Never forget your medications! The system sends timely SMS reminders with details about dosage, time, and frequency. Users can easily add, edit, or remove medicines, ensuring they stay on track with their health routines.

3. **Meet Link Generator**:
   - Create secure meet links with a simple click. Whether you're connecting with friends, family, or healthcare professionals, the system generates unique links for seamless virtual meetings.

4. **Personalized Health Recommendations**:
   - A recommendation engine that provides tailored suggestions for diet, nutrition, workouts, and more. The system uses machine learning models to analyze user data and offer personalized health advice to improve well-being.

5. **User Management**:
   - An easy-to-use account registration and login system that ensures a personalized experience. Users can access their health data, track medications, and manage recommendations through their accounts.

6. **Intuitive Dashboard**:
   - A user-friendly dashboard that gives an overview of health data, upcoming medication reminders, and the status of active SOS requests. The interface is designed for easy navigation and quick access to key features.
     
---

### Technologies Used

- **Backend**: Node.js, Express.js, Python
- **Database**: MongoDB
- **Authentication**: Bcrypt.js, Express-session
- **Scheduling**: Node-schedule, Twilio
- **Frontend**: HTML, CSS, JavaScript
- **APIs**: Twilio for SMS, Google APIs for meeting links
- **SSL**: Custom SSL Certificates (cert.pem, key.pem)
- **Others**: dotenv for environment variables, fs, readline-sync for utility operations

---

### Workflow of the Project

1. **User Registration & Login**:
   - The user begins by creating an account, providing basic details such as name, email, and password.
   - After successful registration, the user can log in to access their personalized dashboard.

2. **Medication Management**:
   - The user adds medicines through the **Medication Management** module by providing the medicine name, dosage, and the time for intake.
   - This information is stored in a MongoDB database.
   - The **Twilio API** is integrated to send SMS reminders at specified times, notifying users about upcoming doses.

3. **SOS Emergency Alerts**:
   - Users can trigger an **SOS emergency alert** by using a voice command (integrating with voice recognition).
   - The application immediately sends notifications to pre-defined contacts or emergency numbers, ensuring timely help in critical moments.

4. **Meet Link Generation**:
   - Users can create secure meet links using the **Meet Link Generator** feature.
   - The generated links can be shared with family, friends, or healthcare providers for virtual consultations or emergencies.

5. **Health Recommendations**:
   - The system uses machine learning models to analyze data and provide personalized recommendations in the following areas:
     - Diet & Nutrition
     - Fitness (Workouts)
     - Symptoms & Precautions
   - Users receive customized advice to enhance their overall health and wellness.

6. **Dashboard Overview**:
   - The user dashboard displays an overview of upcoming medications, active SOS requests, and health recommendations.
   - It notifies users about pending medications, reminders, and health tips.
   - The dashboard is designed to help users stay organized and on track with their health goals.

7. **Data Storage & Management**:
   - All user data is securely stored in a MongoDB database.
   - **Mongoose** is used to interact with the database, making it easy to retrieve and modify user data such as medicines, health records, and user preferences.

8. **Emergency Response Handling**:
   - When an **SOS alert** is triggered, the backend processes the user’s request and sends emergency alerts via SMS or notifications to pre-configured contacts.
   - This ensures immediate action, providing safety and peace of mind, especially in critical health situations.

9. **Sending SMS Reminders via Twilio**:
   - The **Twilio API** is integrated into the backend to send SMS reminders about medication and upcoming meetings.
   - This ensures timely communication, helping users effectively manage their health routines.

---

## Project Structure

```bash
C:.
|   .env
|   .gitignore
|   createMeetLink.js
|   credentials.json
|   google-auth.js
|   makecall.js
|   manifest.json
|   package-lock.json
|   package.json
|   sendSMS.js
|   server.js
|   service-worker.js
|   testtwillo.js
|   token.json
|   
+---image
|   about-img.svg
|   blog-1.jpg
|   blog-2.jpg
|   blog-3.jpg
|   ...
|   
+---models
|   Medicine.js
|   User.js
|   
+---node_modules
|   
+---public
|       Dashboard.css
|       Dashboard.html
|       dashboard.js
|       index.html
|       medindex.html
|       medscript.js
|       medstyles.css
|       script.js
|       sosapp.js
|       sosindex.html
|       style.css
|       virtualindex.html
|   
+---Recommendation
|   description.csv
|   diets.csv
|   main.py
|   medications.csv
|   precautions_df.csv
|   recom.ipynb
|   svc.pkl
|   Symptom-severity.csv
|   symptoms.py
|   symtoms_df.csv
|   Training.csv
|   workout_df.csv
|   |
|   \---templates
|           icon-medtech.png
|           index.html
|           style.css
|   
+---ssl
|   cert.pem
|   key.pem
```

## Prerequisites

Before you can start using or contributing to the Smart Health Assistant project, you will need to set up a few things. This section covers the **software requirements** and **account setup**.

---

### Software Requirements

#### 1. **Node.js and npm**
Node.js is required to run the server and handle the backend functionality of the application.

- **Node.js** is a JavaScript runtime used for the server-side logic.
- **npm** (Node Package Manager) is used to manage the dependencies for the project.

**Steps to Install Node.js and npm**:
1. Go to the [Node.js official website](https://nodejs.org/en/download/).
2. Download the **LTS version** for your operating system (Windows, macOS, or Linux).
3. Run the installer and follow the on-screen instructions to install both **Node.js** and **npm**.
4. Once the installation is complete, verify the installation by running the following commands in your terminal or command prompt:
   ```bash
   node -v
   npm -v
   ```

---

#### 2. **MongoDB**
MongoDB is the NoSQL database used to store data such as user profiles, medicines, recommendations, and more.

**Steps to Install MongoDB**:
1. Go to the [MongoDB official download page](https://www.mongodb.com/try/download/community).
2. Choose the correct version for your operating system and download the installer.
3. Run the installer and follow the installation steps.
4. After installation, start the MongoDB service by running the following command in your terminal:
   ```bash
   mongod
   ```

You can also use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud-based MongoDB instance.

---

#### 3. **Python**
Python is used for running some of the machine learning models in the recommendation system.

**Steps to Install Python**:
1. Visit the [Python official website](https://www.python.org/downloads/).
2. Download the latest version of Python (preferably Python 3.x).
3. Run the installer and ensure that the option **Add Python to PATH** is checked before clicking **Install Now**.
4. After installation, verify the installation by running:
   ```bash
   python --version
   ```

---

#### 4. **Visual Studio Code (VS Code)**
VS Code is the recommended code editor for this project.

**Steps to Install VS Code**:
1. Go to the [VS Code download page](https://code.visualstudio.com/Download).
2. Choose the version for your operating system (Windows, macOS, or Linux).
3. Run the installer and follow the setup instructions.

---

#### 5. **Twilio Account**
Twilio is used for sending SMS reminders and handling emergency SOS alerts.

**Steps to Set Up a Twilio Account**:
1. Visit the [Twilio website](https://www.twilio.com/).
2. Sign up or log in to your Twilio account.
3. Obtain your **Account SID** and **Auth Token**.
4. Purchase a Twilio phone number.
5. Save the **Account SID**, **Auth Token**, and **Twilio Phone Number** in a secure place.

---

#### 6. **Google Cloud Console (for Google Meet Link Generation)**
Google Cloud services are used to generate meet links.

**Steps to Set Up Google API Credentials**:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Enable the **Google Meet API**.
4. Create **OAuth 2.0 credentials** and download the `credentials.json` file.
5. Store the `credentials.json` file in your project folder.

---

### Accounts Setup

#### 1. **Setting Up Twilio**:
1. Create a `.env` file in the root directory and add the following:
   ```bash
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

#### 2. **Setting Up Google API**:
1. Download the `credentials.json` from Google Cloud and place it in the project root directory.

---

### Installing Dependencies

**Install Node.js dependencies**:
   ```bash
   npm install
   ```
---

### Node.js Installations (using npm)

In your terminal (inside the project directory), run the following command to install the required Node.js dependencies:

```bash
npm install express mongoose bcryptjs express-session body-parser twilio node-schedule dotenv https fs readline-sync
```

This will install the following dependencies:

- **express**: A web framework for Node.js to handle routing and server-side logic.
- **mongoose**: An ODM (Object Data Modeling) library for MongoDB, used to interact with the MongoDB database.
- **bcryptjs**: A library for hashing passwords securely.
- **express-session**: Middleware for handling user sessions.
- **body-parser**: Middleware to parse incoming request bodies.
- **twilio**: The Twilio SDK to interact with Twilio's SMS and other communication services.
- **node-schedule**: A job scheduler for Node.js to run tasks at specific intervals.
- **dotenv**: A module for loading environment variables from a `.env` file.
- **https**: Built-in module to create secure HTTPS servers.
- **fs**: Built-in module to handle file system operations.
- **readline-sync**: A simple library for synchronously reading user input from the command line.

---

### Python Installations (using pip)

For the Python part of your project, you’ll need to install the following dependencies:

In your terminal (ensure Python and pip are installed):

#### 1. Install pip on Windows

If pip is not installed, follow these steps:

- **Check if pip is already installed**:
    - Open Command Prompt (press `Win + R`, type `cmd`, and press Enter).
    - Type the following command to check if pip is already installed:

    ```bash
    pip --version
    ```

    If pip is installed, you'll see the version number (e.g., `pip 21.0.1`).

- **Install pip (if it's missing)**:
    - Ensure Python is installed: Check if Python is installed by typing:

    ```bash
    python --version
    ```

    If Python is installed, it will show the version number.
    - Download `get-pip.py` from the official pip installation page.
    - Save the file as `get-pip.py` to a directory on your computer.
    - Open Command Prompt and navigate to the directory where `get-pip.py` is saved.
    - Run the following command to install pip:

    ```bash
    python get-pip.py
    ```

    After installation, verify it by typing:

    ```bash
    pip --version
    ```

#### 2. Install Python Dependencies

Now, install the required Python libraries by running:

```bash
pip install flask pandas numpy pickle5 twilio schedule
```

These dependencies are needed for the following functionality:

- **flask**: A lightweight web framework for building the recommendation system and handling HTTP requests.
- **pandas**: A data manipulation and analysis library, useful for processing data related to recommendations and user information.
- **numpy**: A package for scientific computing, useful for working with large datasets and mathematical operations.
- **pickle5**: A library for serializing and deserializing Python objects, typically used for saving and loading machine learning models.
- **twilio**: The Twilio SDK to send SMS reminders and other notifications.
- **schedule**: A Python library to run tasks at specific intervals (similar to node-schedule).

--- 
##  SSL and IP

### **Steps to Create SSL Certificate and Key**

1. **Install OpenSSL**:  
   If you don't have OpenSSL installed, download it from [here](https://www.openssl.org/).

2. **Generate Your SSL Certificate and Key**:  
   Open your terminal or command prompt and run the following commands:

   - **Create the private key (`key.pem`)**:

   ```bash
   openssl genpkey -algorithm RSA -out key.pem -pkeyopt rsa_keygen_bits:2048
   ```

   - **Create the certificate signing request (CSR)**:

   ```bash
   openssl req -new -key key.pem -out csr.pem
   ```

   - **Create the certificate (`cert.pem`)**:

   ```bash
   openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem
   ```

   You will now have two files:
   - `key.pem` (private key)
   - `cert.pem` (SSL certificate)

---

### **How to Find Your IP Address**

- **For Windows**:
   1. Open the Command Prompt and type:
   
   ```bash
   ipconfig
   ```
   
   2. Look for the **IPv4 Address** under your active connection (e.g., `192.168.1.x`).

- **For macOS/Linux**:
   1. Open the Terminal and type:
   
   ```bash
   ifconfig
   ```
   
   2. Look for the **inet** entry (e.g., `192.168.x.x`).

- **For Public IP Address**:
   Visit [WhatIsMyIP.com](https://www.whatismyip.com/) to find your public IP address.

---

### **Steps to Replace SSL Certificates and Update IP Address**

1. **Replace SSL Certificates (`cert.pem` and `key.pem`)**:
   - Replace the old `cert.pem` and `key.pem` files with your newly generated SSL certificate files in the project directory.

2. **Update the IP Address in `server.js`**:
   - In `server.js`, find this line:
   
   ```javascript
   server.listen(3000, '198.162.0.102', () => {
   ```
   
   - Replace `'198.162.0.102'` with your actual IP address (e.g., `'192.168.1.x'`).
   - Save and restart the server with:

   ```bash
   node server.js
   ```

3. **Update the IP Address in `main.py`**:
   - In `main.py`, find this line:
   
   ```python
   app.run(host='127.0.0.1', port=5000, ssl_context=('cert.pem', 'key.pem'))
   ```
   
   - Replace `'127.0.0.1'` with your IP address (e.g., `'192.168.1.x'`).
   - Save and run the server with:

   ```bash
   python main.py
   ```

4. **Update the IP Address in `dashboard.html`**:
   - In `dashboard.html`, find URLs like:

   ```html
   <a href="https://198.162.0.102:3000">Visit Dashboard</a>
   ```

   - Replace `'198.162.0.102:3000'` with your IP address.
   - Save the changes.

---

### Running the Project

1. Open the project folder in **VS Code**.
2. Open a new terminal window in VS Code.
3. Start the server by running:
   ```bash
   node server.js
   ```
4.This will start the server, and the application will automatically open with the modified address like https:192.168.0.102:5000 in browser. You can also access the same link the mobile with same internet connection.

---
### Screenshots

![Screenshot 2024-12-24 185347](https://github.com/user-attachments/assets/00b90417-3cf9-42b8-8efa-141444d534ea)
![Screenshot 2024-12-24 185438](https://github.com/user-attachments/assets/691bf139-3943-4709-ac1d-b728a80aa048)
![Screenshot 2024-12-24 185505](https://github.com/user-attachments/assets/8948dc0e-47f2-4ffb-a697-ac0d7001b811)
![Screenshot 2024-12-24 185505](https://github.com/user-attachments/assets/a9696242-fed8-46b0-8d45-2072770d8eb8)
![Screenshot 2024-12-24 185647](https://github.com/user-attachments/assets/e1bc345a-d08b-4f3c-890c-4f768587dee1)
![Screenshot 2024-12-24 185711](https://github.com/user-attachments/assets/6a9cfbd6-5d48-48db-8bd4-3791c6aa5f93)
![Screenshot 2024-12-24 185733](https://github.com/user-attachments/assets/0007e6be-be44-43f3-b62f-6991d1996b1a)
![Screenshot 2024-12-24 185750](https://github.com/user-attachments/assets/3d52d977-fcb2-407d-8cec-571abb44a37b)
![Screenshot 2024-12-24 190900](https://github.com/user-attachments/assets/e8a8fb2a-6c5c-48ed-8fa9-19d2fce950f1)
![Screenshot 2024-12-24 185314](https://github.com/user-attachments/assets/bdc74057-0b3b-4b37-ad71-15379a0e8d6d)
![image](https://github.com/user-attachments/assets/d3026661-cb62-43b1-989b-32e8af9d8fb8)
![image](https://github.com/user-attachments/assets/5ec460fd-91f3-4ab8-90dd-2fa5ffbd1c52)
![Screenshot 2024-12-24 190242](https://github.com/user-attachments/assets/903cb312-4974-4af5-b0d2-e073540bd3ed)
![Screenshot 2024-12-24 190512](https://github.com/user-attachments/assets/a1e842d5-792f-4bf2-8b69-df059827aad6)
![Screenshot 2024-12-24 185347](https://github.com/user-attachments/assets/1db6053a-8353-4726-ac1b-e3d91e5bd4ca)
![image](https://github.com/user-attachments/assets/6f6fd9c9-b52e-4a70-9fdf-cacd564472f1)
![Screenshot 2024-12-24 185933](https://github.com/user-attachments/assets/04d5b9cf-9605-4a6f-b752-01e84bfade8c)
![Screenshot 2024-12-24 190042](https://github.com/user-attachments/assets/3e904c8a-8973-49a7-b09f-b3dffff68f8d)
![Screenshot 2024-12-24 190531](https://github.com/user-attachments/assets/7e440c8b-e308-42c0-abb4-baf8bc93c01d)

---
### Future Scope
The project has the potential for future enhancements and additional features. Some possible improvements include:

**Integration with Wearable Devices:** Integrate with health tracking devices to automate medication reminders based on the user's physical conditions.
**Multi-language Support:** Add support for multiple languages to cater to a wider audience.

---

### Contact Information

For any questions or support related to this project, feel free to contact us:

Email: ishwaryasuresh2004@gmail.com

GitHub: https://github.com/Ishwaryaprogrammer

LinkedIn: linkedin.com/in/ishwarya-suresh-096a9a246

Feel free to open an issue or reach out if you encounter any bugs or want to contribute to the project!

---


