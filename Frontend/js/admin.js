

// const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {};

document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageDiv = document.getElementById("message");

  console.log(email);

  if (email==="admin@gmail.com") {
    if (password === "1234") {
      messageDiv.style.color = "green";
      messageDiv.textContent = "Login successful!";
      localStorage.setItem("loggedIn", "true");
      setTimeout(() => {
        window.location.href = "../Admin-Home.html";
      }, 1000);
    } else {
      messageDiv.style.color = "red";
      messageDiv.textContent = "Invalid password. Please try again.";
    }
  } 
  else {
    messageDiv.style.color = "red";
    messageDiv.textContent = "Email not registered. Please sign up.";
  }
});

// document.getElementById("forgotPasswordLink").addEventListener("click", function () {
//   window.location.href = "forgot_password.html";
// });
