document.addEventListener('DOMContentLoaded', function() {
    console.log("sup");

    // Get the modal
    var modal = document.getElementById("clubModal");

    // Get the button that opens the modal
    var btn = document.querySelector(".club_container");

    // Get the <span> element that closes the modal
    var span = document.querySelector(".close");

    // When the user clicks on the button, open the modal
    if (btn) {
        btn.onclick = function() {
            modal.style.display = "block";
        }
    }

    // When the user clicks on <span> (x), close the modal
    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }

    // Fetch the clubs.data and process it
    fetch('../data/clubs.json')
        .then(response => response.json())
        .then(clubs => {
            // Sort clubs alphabetically by name
            clubs.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

            // Get the parent container where clubs will be appended
            const row = document.querySelector('.row');

            // Loop through sorted clubs and create HTML elements for each club
            clubs.forEach(club => {
                const clubContainer = document.createElement('div');
                clubContainer.className = 'container club_container';

                // Check if the thumbnail property exists and is not empty
                if (club.thumbnail) {
                    const img = document.createElement('img');
                    img.className = 'club_thumbnail';
                    img.src = club.thumbnail;
                    clubContainer.appendChild(img);
                }

                const headline = document.createElement('p');
                headline.className = 'club_headline';
                headline.textContent = club.name || "Unnamed Club";

                const subtitle = document.createElement('em');
                subtitle.className = 'club_subtitle';
                subtitle.innerHTML = `<p>${club.sponsors}</p>`;

                const content = document.createElement('p');
                content.className = 'club_content';

                // Check if the description is longer than 150 characters
                if (club.description && club.description.length > 150) {
                    // Truncate the description and add an ellipsis
                    content.textContent = club.description.substring(0, 150) + "...";
                    // Add a class to apply the fade-out effect
                    content.classList.add('fade-out');
                } else {
                    content.textContent = club.description;
                }

                // Append elements to the club container
                clubContainer.appendChild(headline);
                clubContainer.appendChild(subtitle);
                clubContainer.appendChild(content);

                // Append club container to the row
                row.appendChild(clubContainer);

                // Create a modal for each club
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h2>${club.name || "Unnamed Club"}</h2>
                        <em>${club.sponsors}</em>
                        <p>${club.description}</p>
                        <p><strong>Meeting Info:</strong> ${club.meeting_info || "TBD"}</p>
                    </div>
                `;
                document.body.appendChild(modal);

                // When the user clicks on the button, open the modal
                clubContainer.onclick = function() {
                    modal.style.display = "block";
                }

                // When the user clicks on <span> (x), close the modal
                const span = modal.querySelector('.close');
                span.onclick = function() {
                    modal.style.display = "none";
                }
            });

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                });
            }
        })
        .catch(error => console.error('Error loading clubs:', error));
});
