class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.init();
    }

    // Initialize event listeners
    init() {
        document.querySelectorAll('.calendar_head_btn').forEach(btn => {
            btn.addEventListener("click", () => {
                this.updateMonth(parseInt(btn.value));
                this.generateCalendar();
            });
        });
        this.generateCalendar();
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
    async showEvents(date) {
        console.log("Show events for:", date);  // Debugging line

        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Format: 'YYYY-MM'
        const filePath = `/py/calendar-data/19-fishers-high-school/${yearMonth}.json`;

        console.log("Fetching from filePath:", filePath);  // Debugging line

        let eventData = [];
        try {
            const response = await fetch(filePath);
            console.log("Response headers:", response.headers);  // Debugging line
            console.log("Response status:", response.status);    // Debugging line
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            console.log("Data received:", data);  // Debugging line
            eventData = data[date.getDate()] || [];
        } catch (error) {
            console.error('Error fetching calendar data:', error);
        }

        // Format events for display in the modal
        const formattedEvents = eventData.map(event => {
            let locationString = event.location ? `Location: ${event.location}<br>` : '';
            let timeString = event.time ? `Time: ${event.time}<br>` : 'All Day<br>';

            let eventClass;
            if (!event.time && !event.location) {
                eventClass = 'green-background';
            }
            if (event.title.toLowerCase() === 'red day') {
                eventClass = 'red-background';
            }
            if (event.title.toLowerCase() === 'silver day') {
                eventClass = 'silver-background';
            }
            if (event.title.toLowerCase().includes('elearning')) {
                eventClass = 'blue-background';
            }
            if (event.title.toLowerCase().includes('teacher day')) {
                eventClass = 'yellow-background';
            }
            if (event.title.toLowerCase().includes('psat')) {
                eventClass = 'purple-background';
            }

            return `
                <div class="event-box ${eventClass}">
                    <strong>${event.title}</strong><br>
                    ${timeString}
                    ${locationString}
                </div>
            `;
        }).join('');



        const displayData = formattedEvents || "No Events";
        console.log(formattedEvents)

        // Update the modal content
        document.getElementById("eventContent").innerHTML = `
            <div class="modal-title-container">
                <strong>Events for ${date.toDateString()}</strong>
                <div class="red-bar"></div>
            </div>
            <div class="modal-scroll-content">
                ${displayData}
            </div>
        `;




        // Show the modal
        document.getElementById("eventModal").classList.remove("hidden");
    }

    async fetchMonthEvents() {
        const yearMonth = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}`;
        const filePath = `/py/calendar-data/19-fishers-high-school/${yearMonth}.json`;
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();

            // Identify special events
            for (const day in data) {
                const events = data[day];
                events.isAllDay = events.some(event => !event.time && !event.location);
                events.isRedDay = events.some(e => e.title.toLowerCase() === 'red day');
                events.isSilverDay = events.some(e => e.title.toLowerCase() === 'silver day');
                events.isElearning = events.some(e => e.title.toLowerCase().includes('elearning'));
                events.isTeacherDay = events.some(e => e.title.toLowerCase().includes('teacher day'));
                events.isPSAT = events.some(e => e.title.toLowerCase() === 'psat');
            }

            return data;
        } catch (error) {
            console.error('Error fetching calendar data:', error);
            return {};
        }
    }


    // Function to generate and display the calendar
    generateCalendar() {
        this.fetchMonthEvents().then(monthEvents => {
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

                    const eventData = monthEvents[String(thisDate)];
                    if (eventData && eventData.isAllDay) {
                        td.classList.add('green-day');
                    }
                    if (eventData && eventData.isRedDay) {
                        td.classList.add('red-day');
                    }
                    if (eventData && eventData.isSilverDay) {
                        td.classList.add('silver-day');
                    }
                    if (eventData && eventData.isElearning) {
                        td.classList.add('blue-day');
                    }
                    if (eventData && eventData.isTeacherDay) {
                        td.classList.add('yellow-day');
                    }
                    if (eventData && eventData.isPSAT) {
                        td.classList.add('purple-day');
                    }

                    // Create a Date object with the current year, month, and date
                    const tempDate = new Date(thisYear, thisMonth, thisDate);

                    // Generate the dateString for event listeners
                    td.addEventListener('click', () => this.showEvents(tempDate));

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
        })
    }
}

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

// Attach a click event to the modal background and load calendar
document.addEventListener("DOMContentLoaded", () => {
    const calendar = new Calendar();

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