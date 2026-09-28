

const appointmentForm = document.getElementById("appointmentForm");

const nameInput = document.getElementById("name");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const purposeInput = document.getElementById("purpose");

const appointmentList = document.getElementById("appointmentList");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const upcomingBtn = document.getElementById("upcomingBtn");
const submitBtn = document.getElementById("submitBtn");





let appointments = JSON.parse(
    localStorage.getItem("appointments")
) || [];



let editingId = null;



let showUpcomingOnly = false;




function saveAppointments() {

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );

}



function renderAppointments() {


    appointmentList.innerHTML = "";

  
    
    const searchText = searchInput.value.toLowerCase().trim();


    
    let filteredAppointments = appointments.filter(function (appointment) {

        const matchesSearch =
            appointment.name.toLowerCase().includes(searchText) ||
            appointment.purpose.toLowerCase().includes(searchText);

        const matchesUpcoming =
            !showUpcomingOnly || isUpcoming(appointment);

        return matchesSearch && matchesUpcoming;

    });


    
    
    if (filteredAppointments.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    
    
    filteredAppointments.forEach(function (appointment) {

        const row = document.createElement("tr");

        const statusClass =
            appointment.status === "Cancelled"
                ? "status-cancelled"
                : "status-upcoming";


        row.innerHTML = `
            <td>${appointment.name}</td>

            <td>${formatDate(appointment.date)}</td>

            <td>${formatTime(appointment.time)}</td>

            <td>${appointment.purpose}</td>

            <td>
                <span class="status ${statusClass}">
                    ${appointment.status}
                </span>
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editAppointment('${appointment.id}')"
                >
                    Edit
                </button>

                <button
                    class="cancel-btn"
                    onclick="cancelAppointment('${appointment.id}')"
                >
                    Cancel
                </button>

            </td>
        `;


        appointmentList.appendChild(row);

    });

}





appointmentForm.addEventListener("submit", function (event) {

    event.preventDefault();


    
    
    const name = nameInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;
    const purpose = purposeInput.value;


   
    
    if (name === "") {

        alert("Please enter your name.");
        nameInput.focus();
        return;

    }


    if (date === "") {

        alert("Please select a date.");
        dateInput.focus();
        return;

    }


    if (time === "") {

        alert("Please select a time.");
        timeInput.focus();
        return;

    }


    if (purpose === "") {

        alert("Please select a purpose.");
        purposeInput.focus();
        return;

    }


 
    
    if (editingId !== null) {

        updateAppointment(
            name,
            date,
            time,
            purpose
        );

        return;

    }


   
    
    const appointment = {

        id: Date.now().toString(),

        name: name,

        date: date,

        time: time,

        purpose: purpose,

        status: "Upcoming"

    };


    
    appointments.push(appointment);


    
    saveAppointments();


    
    renderAppointments();


 
    
    appointmentForm.reset();


    alert("Appointment added successfully.");

});





function editAppointment(id) {

    const appointment = appointments.find(function (item) {

        return item.id === id;

    });


    if (!appointment) {

        return;

    }


  
    
    nameInput.value = appointment.name;

    dateInput.value = appointment.date;

    timeInput.value = appointment.time;

    purposeInput.value = appointment.purpose;



    editingId = id;


    
    
    submitBtn.textContent = "Update Appointment";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}





function updateAppointment(
    name,
    date,
    time,
    purpose
) {

    const appointment = appointments.find(function (item) {

        return item.id === editingId;

    });


    if (!appointment) {

        return;

    }


    appointment.name = name;

    appointment.date = date;

    appointment.time = time;

    appointment.purpose = purpose;


  
    
    saveAppointments();



    renderAppointments();


  

    appointmentForm.reset();


    
    editingId = null;


  
    submitBtn.textContent = "Add Appointment";


    alert("Appointment updated successfully.");

}



function cancelAppointment(id) {

    const appointment = appointments.find(function (item) {

        return item.id === id;

    });


    if (!appointment) {

        return;

    }



    if (appointment.status === "Cancelled") {

        alert("This appointment is already cancelled.");

        return;

    }


    const confirmCancel = confirm(
        "Are you sure you want to cancel this appointment?"
    );


    if (!confirmCancel) {

        return;

    }


    appointment.status = "Cancelled";


    saveAppointments();


    
    renderAppointments();


    alert("Appointment cancelled.");

}




searchInput.addEventListener("input", function () {

    renderAppointments();

});




upcomingBtn.addEventListener("click", function () {

    showUpcomingOnly = !showUpcomingOnly;


    if (showUpcomingOnly) {

        upcomingBtn.textContent = "Show All";

    } else {

        upcomingBtn.textContent = "Upcoming Only";

    }


    renderAppointments();

});




function isUpcoming(appointment) {

    if (appointment.status === "Cancelled") {

        return false;

    }


    const appointmentDateTime = new Date(
        `${appointment.date}T${appointment.time}`
    );


    const currentDateTime = new Date();


    return appointmentDateTime >= currentDateTime;

}



function formatDate(date) {

    const dateObject = new Date(date + "T00:00:00");


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}



function formatTime(time) {

    const [hours, minutes] = time.split(":");


    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}




renderAppointments();

