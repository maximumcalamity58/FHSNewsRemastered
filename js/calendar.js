// Create a class for the calendar
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.calendarData = {};

        // Fetch and initialize calendar data
        this.fetchCalendarData().then(() => {
            this.generateCalendar();
            this.init(); // Initialize event listeners after calendar is generated
        });
    }

    // Fetch calendar data from JSON
    async fetchCalendarData() {
        try {
            const response = await fetch('../json/calendar_data.json');
            if (!response.ok) {
                console.error('Network response was not ok', response);
                return;
            }
            const text = await response.text();
            try {
                this.calendarData = JSON.parse(text);
            } catch (err) {
                console.error('Error parsing JSON:', text);
            }
        } catch (error) {
            console.error('Error fetching calendar data:', error);
        }
    }

    // Initialize event listeners
    init() {
        document.querySelectorAll('.calendar_head_btn').forEach(btn => {
            btn.addEventListener("click", () => {
                this.updateMonth(parseInt(btn.value));
                this.generateCalendar();
            });
        });
    }

    // Function to update the month
    updateMonth(n) {
        this.currentMonth += n;

        // Overflow and underflow conditions
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
    }

    // Function to show events for clicked day
    showEvents(dateString) {
        console.log("Show events for:", dateString);  // Debugging line
        const eventData = this.calendarData[dateString];
        const events = eventData ? eventData.events.join(", ") : "No events";

        // Create formatted date string for display
        const displayDate = new Date(dateString);
        const displayDateString = `${displayDate.toLocaleString('default', { month: 'short' })} ${displayDate.getDate()}`;

        // Update the modal content
        document.getElementById("eventContent").innerHTML = `
            <strong>Events for ${displayDateString}</strong>
            <br>
            ${events}
        `;

        // Show the modal
        document.getElementById("eventModal").classList.remove("hidden");
    }

    // Function to generate and display the calendar
    generateCalendar() {
        const calendarBody = document.querySelector(".calendar_body");
        const calendarDate = document.querySelector("#calendar_date p");

        // Clear existing calendar
        calendarBody.innerHTML = "";

        // Display month and year
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        calendarDate.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;

        // Create the table and its body
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        // Generate the header row with weekdays
        let tr = document.createElement('tr');
        ["S", "M", "T", "W", "T", "F", "S"].forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            tr.appendChild(th);
        });
        tbody.appendChild(tr);

        // Generate calendar days
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const lastDate = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

        // Get the last day of the previous month
        const prevMonthLastDate = new Date(this.currentYear, this.currentMonth, 0).getDate();

        // Initialize date counters
        let date = 1;
        let nextMonthDate = 1;
        let prevMonthDay = prevMonthLastDate - firstDay + 1;

        for (let i = 0; i < 6; i++) {
            tr = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.className = 'day-number';

                let thisMonth = this.currentMonth;
                let thisYear = this.currentYear;
                let thisDate;

                if (i === 0 && j < firstDay) {
                    thisDate = prevMonthDay++;
                    thisMonth = this.currentMonth - 1;
                    if (thisMonth < 0) {
                        thisMonth = 11;
                        thisYear--;
                    }
                    td.className = 'prev-month';
                } else if (date > lastDate) {
                    thisDate = nextMonthDate++;
                    thisMonth = this.currentMonth + 1;
                    if (thisMonth > 11) {
                        thisMonth = 0;
                        thisYear++;
                    }
                    td.className = 'next-month';
                } else {
                    thisDate = date;
                    date++;
                }

                // Create a Date object with the current year, month, and date
                const tempDate = new Date(thisYear, thisMonth, thisDate);

                // Add 1 day
                tempDate.setDate(tempDate.getDate() + 1);

                // Generate the dateString for event listeners
                const dateString = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${String(tempDate.getDate()).padStart(2, '0')}`;
                td.addEventListener('click', () => this.showEvents(dateString));

                span.textContent = thisDate;
                td.appendChild(span);

                if (j === 0 || j === 6) {
                    td.classList.add('weekend');
                }

                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }


        // Append the tbody to the table, and the table to the calendar body
        table.appendChild(tbody);
        calendarBody.appendChild(table);
    }
}

// Initialize calendar
const calendar = new Calendar();

// Update and regenerate calendar when buttons are clicked
document.querySelectorAll('.calendar_head_btn').forEach(btn => {
    btn.addEventListener("click", function() {
        calendar.updateMonth(parseInt(this.value));
        calendar.generateCalendar();
    });
});

// Show the modal
function showModal() {
    document.getElementById("eventModal").classList.remove("hidden");
}

// Hide the modal
function hideModal() {
    document.getElementById("eventModal").classList.add("hidden");
}

// Attach a click event to the modal background
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("eventModal").addEventListener("click", function(event) {
        if (event.target === this) {
            hideModal();
        }
    });
});

// Close the modal when the close button is clicked
document.getElementById("eventModal").addEventListener("click", (event) => {
    // Check if the click is outside the content box
    if (event.target.id === "eventModal") {
        document.getElementById("eventModal").classList.add("hidden");
    }
});