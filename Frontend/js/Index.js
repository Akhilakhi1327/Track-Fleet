async function searchShipment() {
  const trackId = document.getElementById("trackIdInput").value.trim();

  if (!trackId) {
    alert("Please enter a Track ID");
    return;
  }
  
  try {
    const response = await fetch(
      `http://localhost:3000/getDetails?track_id=${trackId}`
    ); // Ensure this matches your backend port
    console.log(response);
    const shipment = await response.json();

    if (!shipment || shipment.error) {
      alert("Shipment not found!");
      return;
    }
    const username = localStorage.getItem("username");
    // let quotedUsername = `"${username}"`;
    const orderData = {
      order_time: shipment.track_id,
      order_place: shipment.shipper_name,
      delivery_time: shipment.receiver_name,
      username: username
    };
  
    fetch("http://localhost:3000/u_orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => console.log("Order Added:", data))
    .catch(error => console.error("Error:", error));

    // Render the shipment in the table
    const tableBody = document.getElementById("shipmentTableBody");
    tableBody.innerHTML = `
            <tr>
                <td>${shipment.track_id}</td>
                <td>${shipment.shipper_name}</td>
                <td>${shipment.receiver_name}</td>
                <td>${
                  new Date(shipment.pickup_date).toISOString().split("T")[0]
                }</td>
                <td>
                <button class="btn btn-outline-primary btn-sm">Details</button>
                </td>
            </tr>

        `;
  } catch (error) {
    console.error("Error fetching shipment:", error);
    alert("Error fetching shipment");
  }
}

document
  .getElementById("shipmentForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page refresh
    searchShipment(); // Call search function
  });

document.addEventListener("DOMContentLoaded", function () {
  const login = document.getElementById("login-link");
  const signup = document.getElementById("signup-link");
  const userInfo = document.getElementById("logo-link");
  const logoutBtn = document.getElementById("logo-link");

  function checkLoginStatus() {
    if (localStorage.getItem("loggedIn") === "true") {
        signup.classList.add("d-none");
        login.classList.add("d-none");
      userInfo.classList.remove("d-none");
    } else {
        signup.classList.remove("d-none");
        login.classList.remove("d-none");
    //   authButtons.classList.remove("d-none");
      userInfo.classList.add("d-none");
    }
  }
  
  logoutBtn.addEventListener("click", function () {
    const confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("username");
        checkLoginStatus();
    }
});


  checkLoginStatus();
});

// <div class="container mt-5">
//     <!-- Login & Sign Up Buttons -->
//     <div class="auth-buttons">
//         <button id="loginBtn" class="btn btn-primary">Login</button>
//         <button id="signupBtn" class="btn btn-success">Sign Up</button>
//     </div>

//     <!-- User Logo & Logout -->
//     <div class="user-info d-none mt-3">
//         <img src="user-logo.png" alt="User Logo" class="rounded-circle border border-dark" width="50" height="50">
//         <button id="logoutBtn" class="btn btn-danger ms-2">Logout</button>
//     </div>
// </div>
