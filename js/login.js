

const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {};

document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageDiv = document.getElementById("message");

  console.log(email);
  if(email==="admin@gmail.com"){
    // console.log("em");
    if (password === "admin") {
      // console.log("pas");
      messageDiv.style.color = "green";
      messageDiv.textContent = "Login successful!";
      // localStorage.setItem("loggedIn", "true");
      setTimeout(() => {
        window.location.href = "../Admin-Home.html";
      }, 1000);
    }
  }
  else if(email==="agent@gmail.com"){
    // console.log("em");
    if (password === "agent") {
      // console.log("pas");
      messageDiv.style.color = "green";
      messageDiv.textContent = "Login successful!";
      // localStorage.setItem("loggedIn", "true");
      setTimeout(() => {
        window.location.href = "../delivary.html";
      }, 1000);
    }
  }

  else if (registeredUsers[email]) {
    
    if (registeredUsers[email] === password) {
      messageDiv.style.color = "green";
      messageDiv.textContent = "Login successful!";
      localStorage.setItem("loggedIn", "true");
      const username = email.split("@")[0]; // Extracts "uname"
      console.log(username);
      localStorage.setItem("username", JSON.stringify(username));
      setTimeout(() => {
        window.location.href = "../html/Index.html";
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
