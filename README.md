# Collaborative Drawing Platform

## Overview

Welcome to the Collaborative Drawing Platform! This project is a real-time, interactive drawing application built using the MERN stack (MongoDB, Express, React, Node.js). It allows multiple users to draw on a shared canvas simultaneously, providing a seamless collaborative experience.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Real-Time Collaboration:** Multiple users can draw on the same canvas in real-time.
- **User Authentication:** Secure user authentication using JWT (JSON Web Tokens).
- **Persistent Storage:** Drawings are saved in MongoDB, allowing users to retrieve and continue their work later.
- **Undo/Redo Functionality:** Users can undo and redo their actions.
- **Different Tools and Colors:** Choose from various drawing tools and colors.
- **Responsive Design:** Works seamlessly on desktops, tablets, and mobile devices.
- **Room Creation:** Users can create and join specific rooms for focused collaboration.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v12.x or higher)
- npm (v6.x or higher)
- MongoDB (local instance or a cloud instance like MongoDB Atlas)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/collaborative-drawing-platform.git
   cd collaborative-drawing-platform
   ```
2. **Install server dependencies:**

   ```bash
        cd server
        npm install
   ```
3. **Install client dependencies:**

   ```bash
        cd ../client
        npm install
   ```
4. **Set up environment variables:**

   Create a .env file in the server directory with the following content:
    ```
        MONGO_URI=your-mongodb-uri
        JWT_SECRET=your-secret-key
    ```

5. **Run the application:**

    Open two terminal windows and run the following commands in each:

    ***Server:***
   ```bash
        cd server
        npm start
   ```
    ***Client:***
   ```bash
        cd client
        npm start
   ```

## Usage

- **Sign Up / Log In:** Create an account or log in to start drawing.
- **Create/Join Room:** Users can create a new room or join an existing room to collaborate with specific groups.
- **Drawing Tools:** Use the toolbar to select different drawing tools and colors.
- **Real-Time Collaboration:** Invite others to join your session and draw together.
- **Save/Load Drawings:** Save your drawings to the database and load them later to continue working.
- **Undo/Redo:** Use the undo/redo buttons to revert or reapply your actions.

## Technologies Used

- **Frontend:**
  - React
  - CSS 
  - Socket.io-client

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Socket.io

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
