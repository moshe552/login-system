# Login System

## Description

This project is a simple login system with a basic frontend, using EJS for webpage templates. It supports user sign-up, login, secure password handling, and session management. The system demonstrates essential user authentication features, including a "Forgot Password" function that sends users an email with a reset link.

## Installation

To set up the project for development and testing on your local machine, follow these steps:

```bash
git clone https://github.com/moshe552/designers_website.git
cd designers_website
pnpm install
```

## Usage
To start the application, run:

```bash
pnpm start
```
This command uses `nodemon` for automatic server restarts on file changes. Open `http://localhost:3000` in a web browser to access the login system.

## Built With

- **Express**: Web framework for building the backend and server setup.
- **MySQL2**: Handles database operations, including storing user and session information.
- **EJS**: Generates HTML using JavaScript for the frontend interface.
- **bcrypt**: Secures user passwords through hashing.
- **Nodemailer**: Enables email sending for the "Forgot Password" functionality.
- **express-rate-limit**: Limits request rates to prevent abuse.
- **express-validator**: Validates and sanitizes user input.

## Testing

## Run tests with the following commands:

```bash
pnpm test # Run all tests
pnpm run test:ci # Run tests with force exit for CI environments
pnpm run test:openHandles # Detect open handles that may prevent Jest from exiting
```

Jest is used for testing to ensure the system functions as expected.



