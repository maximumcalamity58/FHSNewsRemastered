// Create a class for the calendar
class Calendar {
    constructor() {
        // Initialize the current date
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
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

        // Calculate the starting day of the previous month to display
        let prevMonthDay = prevMonthLastDate - firstDay + 1;

        let nextMonthDate = 1;  // Initialize next month's date counter
        let date = 1;  // Initialize this month's date counter
        for (let i = 0; i < 6; i++) {
            tr = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.className = 'day-number';  // Add a class to style the number

                if (i === 0 && j < firstDay) {
                    // Show the days of the previous month
                    span.textContent = prevMonthDay;
                    td.appendChild(span);
                    td.className = 'prev-month';  // Add a class to style the previous month's days
                    prevMonthDay++;
                } else if (date <= lastDate) {
                    span.textContent = date;
                    td.appendChild(span);
                    date++;
                } else {
                    // Show the days of the next month
                    span.textContent = nextMonthDate;
                    td.appendChild(span);
                    td.className = 'next-month';  // Add a class to style the next month's days
                    nextMonthDate++;
                }

                if (j === 0 || j === 6) {  // Weekend (0 = Sunday, 6 = Saturday)
                    td.classList.add('weekend');  // Add a class to style the weekends
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

// Show the current month's calendar on page load
document.addEventListener("DOMContentLoaded", () => {
    const calendar = new Calendar();
    calendar.generateCalendar();

    // Update and regenerate calendar when buttons are clicked
    document.querySelectorAll('.calendar_head_btn').forEach(btn => {
        btn.addEventListener("click", function() {
            calendar.updateMonth(parseInt(this.value));
            calendar.generateCalendar();
        });
    });
});
