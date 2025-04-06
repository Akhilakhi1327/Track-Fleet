document.getElementById("signupForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const messageDiv = document.getElementById("message");

  if (password != confirmPassword) {
    alert("Password not matched");
    return;
  }

  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {};
  if (registeredUsers[email]) {
    messageDiv.style.color = "red";
    messageDiv.textContent = "Email is already registered. Please log in.";
    return;
  }

  registeredUsers[email] = password;
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  

  messageDiv.style.color = "green";
  messageDiv.textContent = "Sign up successful! Redirecting to login page...";
  
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
});
