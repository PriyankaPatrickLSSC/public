
const jobs = [
    {
        "card-title": "Leather Technologist",
        "image": "image/rectangle.png",
        "card-text": "Dedicated Leather Stitching Operator with [X years] of experience in precision stitching and assembly of leather goods.",
        "openPositions": 8,
        "link": "#"
        
    },
    {
        "card-title": "Leather Technician",
        "image": "image/rectangle.png",
        "card-text": "Dedicated Leather Stitching Operator with [X years] of experience in precision stitching and assembly of leather goods.",
        "openPositions": 5,
        "link": "#"
    },
    {
        "card-title": "Sales and Marketing Executive",
        "image": "image/rectangle.png",
        "card-text": "Dedicated Leather Stitching Operator with [X years] of experience in precision stitching and assembly of leather goods.",
        "openPositions": 2,
        "link": "#"
    },
    {
        "card-title": "Leather Designer",
        "image": "image/rectangle.png",
        "card-text": "Dedicated Leather Stitching Operator with [X years] of experience in precision stitching and assembly of leather goods.",
        "openPositions": 10,
        "link": "#"
    },
    {
        "card-title": "Quality Control Inspector",
        "image": "image/rectangle.png",
        "card-text": "Dedicated Leather Stitching Operator with [X years] of experience in precision stitching and assembly of leather goods.",
        "openPositions": 10,
        "link": "#"
    },

    {
        "card-title": "Production Supervisor",
        "image": "image/rectangle.png",
        "card-text": "Dedicated Leather Stitching Operator with [X years] of experience in precision stitching and assembly of leather goods.",
        "openPositions": 10,
        "link": "#"
    },
    

    {
        "card-title": "Leather Craftsperson",
        "image": "image/rectangle.png",
        "card-text": "Dedicated Leather Stitching Operator with [X years] of experience in precision stitching and assembly of leather goods.",
        "openPositions": 10,
        "link": "#"
    },

    {
        "card-title": "Leather Goods Sales Associate",
        "image": "image/rectangle.png",
        "card-text": "Dedicated Leather Stitching Operator with [X years] of experience in precision stitching and assembly of leather goods.",
        "openPositions": 10,
        "link": "#"
    },

    {
        "card-title": "Leather Dyeing and Finishing Specialist",
        "image": "image/rectangle.png",
        "card-text": "Dedicated Leather Stitching Operator with [X years] of experience in precision stitching and assembly of leather goods.",
        "openPositions": 10,
        "link": "#"
    },

    {
        "card-title": "Stitching Operator",
        "image": "image/rectangle.png",
        "card-text": "Dedicated Leather Stitching Operator with [X years] of experience in precision stitching and assembly of leather goods.",
        "openPositions": 5,
        "link": "#"
    },
  
];


function createJobCard(job) {
    // Create elements
    const col = document.createElement("div");
    col.classList.add("col");

    const card = document.createElement("div");
    card.classList.add("card");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "d-flex", "flex-column", "align-items-center");

    // Set inner HTML
    cardBody.innerHTML = `
        <img src="${job.image}" class="card-img-top img-fluid" style="max-width: 2%; margin-left: -390px; margin-top:3px; position: absolute;" alt="...">
        <div class="ms-3">
            <h5 class="card-title">${job["card-title"]}</h5>
            <p class="card-text">${job["card-text"]}</p>
        </div>
        <div class="d-flex flex-wrap mt-2">
            <div class="col-md-6">
                <div class="d-flex flex-column align-items-center mb-2">
                    <div class="image-container">
                        <img src="image/salary.png" class="img-fluid salary-image" alt="Salary Image">
                        <p class="small-image-title">Salary</p>
                    </div>
                    <div class="image-container">
                        <img src="image/employment.png" class="img-fluid employment-image" alt="Employment Image">
                        <p class="small-image-title">Employment</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="d-flex flex-column align-items-center">
                    <div class="image-container">
                        <img src="image/case.png" class="img-fluid case-image" alt="Case Image">
                        <p class="small-image-title">Case</p>
                    </div>
                    <div class="image-container">
                        <img src="image/applicant.png" class="img-fluid applicant-image" alt="Applicant Image">
                        <p class="small-image-title">Open Positions: ${job.openPositions}</p>
                    </div>
                </div>
            </div>
        </div>
        <button class="btn btn-custom-color mt-2" onclick="location.href='${job.link}'">Apply Now</button>
    `;

    // Append elements
    card.appendChild(cardBody);
    col.appendChild(card);

    return col;
}

// Function to filter jobs based on search input
function filterJobs() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filteredJobs = jobs.filter((job) => job["card-title"].toLowerCase().includes(searchInput));

    // Display only the filtered jobs
    initializeJobCards(filteredJobs);
}

// Function to initialize job cards with optional filtered jobs parameter
function initializeJobCards(filteredJobs = null) {
    const jobCardsContainer = document.getElementById("job-cards-container");

    // Check if the container exists
    if (jobCardsContainer) {
        // Clear existing content
        jobCardsContainer.innerHTML = "";

        // Create and append job cards based on filtered jobs or all jobs
        const jobsToDisplay = filteredJobs || jobs;

        // Ensure jobsToDisplay is an array
        if (Array.isArray(jobsToDisplay)) {
            jobsToDisplay.forEach((job) => {
                const jobCard = createJobCard(job);
                jobCardsContainer.appendChild(jobCard);
            });
        }
    }
}

// Call the initialize function when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializeJobCards);