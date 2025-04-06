document.addEventListener("DOMContentLoaded", function () {
    // Check localStorage first, only fetch if no existing data
    const storedShipments = JSON.parse(localStorage.getItem("shipments"));
    if (storedShipments && storedShipments.length > 0) {
        renderShipments(storedShipments);
    } else {
        fetchShipments();
    }
});

// Fetch Shipments from API (only if no local data)
function fetchShipments() {
    fetch('http://localhost:3000/shipments')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("shipments", JSON.stringify(data));
            renderShipments(data);
        })
        .catch(error => console.error('Error fetching shipments:', error));
}


// document.addEventListener("DOMContentLoaded", function () {
//     fetchShipments();
// });

// // Fetch Shipments from API
// function fetchShipments() {
//     fetch('http://localhost:3000/shipments')
//         .then(response => response.json())
//         .then(data => {
//             localStorage.setItem("shipments", JSON.stringify(data));
//             renderShipments(data);
//         })
//         .catch(error => console.error('Error fetching shipments:', error));
// }

// Render Shipments in Table
function renderShipments(shipments) {
    const tableBody = document.getElementById("shipmentTableBody");
    tableBody.innerHTML = "";

    shipments.forEach(shipment => {
        const formattedDate = shipment.pickup_date ? new Date(shipment.pickup_date).toISOString().split("T")[0] : "-";
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><input type="checkbox" class="select-shipment" value="${shipment.track_id}"></td>
            <td><a href="#">${shipment.track_id}</a></td>
            <td>${shipment.shipper_name}</td>
            <td>-</td>
            <td>${shipment.shipper_name}</td>
            <td>${shipment.receiver_name}</td>
            <td>${formattedDate}</td>
            <td class="status">${shipment.status || "Pending"}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="updateStatus('${shipment.track_id}', 'Delivered')">Mark as Delivered</button>
                <button class="btn btn-danger btn-sm" onclick="deleteShipment('${shipment.track_id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update Shipment Status
function updateStatus(trackID, status) {
    fetch(`http://localhost:3000/shipments/${trackID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status })
    })
    .then(() => {
        let shipments = JSON.parse(localStorage.getItem("shipments")) || [];
        shipments = shipments.map(s => s.track_id === trackID ? { ...s, status } : s);
        localStorage.setItem("shipments", JSON.stringify(shipments));
        renderShipments(shipments);
    })
    .catch(error => console.error('Error updating status:', error));
}

// Delete Shipment
function deleteShipment(trackID) {
    if (confirm("Are you sure you want to delete this shipment?")) {
        fetch(`http://localhost:3000/shipments/${trackID}`, { method: 'DELETE' })
        .then(() => {
            let shipments = JSON.parse(localStorage.getItem("shipments")) || [];
            shipments = shipments.filter(s => s.track_id !== trackID);
            localStorage.setItem("shipments", JSON.stringify(shipments));
            renderShipments(shipments);
        })
        .catch(error => console.error('Error deleting shipment:', error));
    }
}

// Bulk Actions
function applyBulkAction() {
    const action = document.getElementById("bulkAction").value;
    const selectedShipments = Array.from(document.querySelectorAll(".select-shipment:checked")).map(cb => cb.value);

    if (selectedShipments.length === 0) {
        alert("Please select at least one shipment.");
        return;
    }

    selectedShipments.forEach(trackID => {
        if (action === "delete") {
            deleteShipment(trackID);
        } else if (action === "delivered") {
            updateStatus(trackID, "Delivered");
        }
    });
}

// Search Shipments
function filterShipments() {
    const searchQuery = document.getElementById("searchBox").value.toLowerCase();
    document.querySelectorAll("#shipmentTableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(searchQuery) ? "" : "none";
    });
}

// Select/Deselect All Checkboxes
function toggleAllCheckboxes(source) {
    document.querySelectorAll(".select-shipment").forEach(cb => cb.checked = source.checked);
}


