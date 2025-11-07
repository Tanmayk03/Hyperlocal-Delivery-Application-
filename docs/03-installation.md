# Installation Guide

This guide walks you through setting up the Blinkit Full Stack Clone on your local machine.

---

## 🧰 Prerequisites

Before starting, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or cloud via MongoDB Atlas)
- [Git](https://git-scm.com/)
- A code editor like [VS Code](https://code.visualstudio.com/)
- Stripe account (for payment integration) – optional if testing only COD

---

## 🛠️ Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Tanmayk03/Blinkit-FullStack.git
cd Blinkit-FullStack
```
### 2. Install Dependencies
#### For the Client
Navigate to the `client` directory and install the frontend dependencies:
```bash
cd client
npm install
```
#### For the Server
Navigate to the `server` directory and install the backend dependencies:
```bash
cd server
npm install
```
### 3. Configure Environment Variables
Create a `.env` file in both the `client` and `server` directories with the following variables:
#### Client `.env`
```plaintext
REACT_APP_API_URL=http://localhost:5000/api
```
#### Server `.env`
```plaintext
PORT=5000
MONGO_URI=mongodb://localhost:27017/blinkit
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```
Replace `your_jwt_secret` and `your_stripe_secret_key` with your actual secrets. If you are using MongoDB Atlas, replace `mongodb://localhost:27017/blinkit` with your Atlas connection string.
### 4. Start the Server
Navigate to the `server` directory and start the backend server:
```bash
cd server
npm run dev
```
### 5. Start the Client
Open a new terminal, navigate to the `client` directory, and start the React application:
```bash
cd client
npm start
``` 
### 6. Access the Application
Open your web browser and go to `http://localhost:3000` to view the application. The backend API will be running on `http://localhost:5000`.
### 7. Testing Payment Integration (Optional)
If you want to test the Stripe payment integration, ensure you have set up your Stripe account and have the secret key in your server `.env` file. You can use test card numbers provided by Stripe for testing purposes.   
### 8. Additional Configuration (Optional)
- If you want to enable the "Forgot Password" feature, ensure you have configured the email service in the server's `.env` file.
- You can also customize the product categories and initial products in the database by modifying the seed data in the `server/models` directory.
---
## 🚀 Running Tests
To run tests, navigate to the `server` directory and execute:
```bash
npm test
```
This will run the backend tests. Frontend tests can be run using:
```bash
cd client
npm test
``` 
---
## 📝 Troubleshooting
- If you encounter issues with MongoDB connection, ensure that your MongoDB service is running and the connection string in the `.env` file is correct.
- For CORS issues, ensure that your backend is configured to allow requests from the frontend URL
- If you face issues with the Stripe integration, double-check your secret key and ensure you are using test mode for development.  
- If the application does not load, check the console for any errors and ensure that both the client and server are running without issues.
---
## 📚 Documentation
For more detailed information about the project structure, refer to the [Project Structure](docs/02-structure.md) documentation.
For an overview of the features and functionalities, refer to the [Introduction](docs/01-introduction.md) documentation.
---
## 🛠️ Contributing
If you want to contribute to this project, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your forked repository.
5. Create a pull request detailing your changes and why they should be merged.
