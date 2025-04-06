const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {};

document.getElementById("forgotPasswordForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("newPassword").value;
    const messageDiv = document.getElementById("message");
    
    if (registeredUsers[email]) {
        registeredUsers[email] = newPassword;
    // console.log(updateUser);
    // console.log(newPassword);
    localStorage.removeItem("registeredUsers");
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    alert("Password changed successfully!");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  } else {
    messageDiv.style.color = "red";
    messageDiv.textContent = "Email not registered. Please sign up.";
  }
});

