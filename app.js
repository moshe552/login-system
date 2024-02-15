require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const register = require("./routes/register");
const login = require("./routes/login");
const logout = require("./routes/logout");
const resetPassword = require("./routes/reset-password");
const passwordResetRequest = require("./routes/password-reset-request");
const { validatePassword } = require("./utils/validatePassword");
const setupMiddleware = require("./middlewares"); 

// Create an express app
const app = express();

// Apply all middleware to the app
setupMiddleware(app);

// Set the view engine to ejs
app.set("view engine", "ejs");


// Define a route
app.get("/", routes.index);
app.get("/register", register.load);
app.get("/login", login.load);
app.get("/logout", logout.logout);
app.post("/register/new_register", register.newRegister);
app.post("/login", login.loginUser);
app.get("/password-reset-request", passwordResetRequest.load);
app.post("/password-reset-request", passwordResetRequest.sendResetLInkToEmail);
app.get("/reset-password", resetPassword.load);
app.post("/reset-password",validatePassword ,resetPassword.resetPassword);

// Start the server
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
