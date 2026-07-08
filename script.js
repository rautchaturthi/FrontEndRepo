const form = document.getElementById("application-form");

const companyName = document.getElementById("company-name");
const role = document.getElementById("role");
const packageInput = document.getElementById("package");
const applicationDate = document.getElementById("application-date");
const status = document.getElementById("status");

const applicationsContainer =
    document.getElementById("applications-container");

const searchCompany =
    document.getElementById("search-company");

const filterStatus =
    document.getElementById("filter-status");

const totalApplications =
    document.getElementById("total-applications");

const oaCleared =
    document.getElementById("oa-cleared");

const interviews =
    document.getElementById("interviews");

const selected =
    document.getElementById("selected");

let applications =
    JSON.parse(localStorage.getItem("applications")) || [];

renderApplications();
updateDashboard();

/* =========================
   ADD APPLICATION
========================= */

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const application = {

        id: Date.now(),

        company: companyName.value.trim(),

        role: role.value.trim(),

        package: packageInput.value,

        date: applicationDate.value,

        status: status.value
    };

    applications.push(application);

    saveToLocalStorage();

    renderApplications();

    updateDashboard();

    form.reset();
});

/* =========================
   RENDER APPLICATIONS
========================= */

function renderApplications() {

    const searchValue =
        searchCompany.value.toLowerCase();

    const filterValue =
        filterStatus.value;

    const filteredApplications =
        applications.filter(function (app) {

            const companyMatch =
                app.company
                    .toLowerCase()
                    .includes(searchValue);

            const statusMatch =
                filterValue === "All"
                || app.status === filterValue;

            return companyMatch && statusMatch;
        });

    if (filteredApplications.length === 0) {

        applicationsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No Applications Found</h3>
                <p>
                    Start by adding your first application.
                </p>
            </div>
        `;

        return;
    }

    applicationsContainer.innerHTML = "";

    filteredApplications.forEach(function (app) {

        const card =
            document.createElement("div");

        card.classList.add("application-card");

        card.innerHTML = `

            <h3>${app.company}</h3>

            <p>
                <strong>Role:</strong>
                ${app.role}
            </p>

            <p>
                <strong>Package:</strong>
                ${app.package} LPA
            </p>

            <p>
                <strong>Status:</strong>
                ${app.status}
            </p>

            <p>
                <strong>Date:</strong>
                ${app.date}
            </p>

            <div class="card-buttons">

                <button
                    class="edit-btn"
                    data-id="${app.id}">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${app.id}">
                    Delete
                </button>

            </div>
        `;

        applicationsContainer.appendChild(card);
    });

    addDeleteListeners();
    addEditListeners();
}

/* =========================
   DELETE APPLICATION
========================= */

function addDeleteListeners() {

    const deleteButtons =
        document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const id =
                    Number(button.dataset.id);

                applications =
                    applications.filter(function (app) {

                        return app.id !== id;
                    });

                saveToLocalStorage();

                renderApplications();

                updateDashboard();
            }
        );
    });
}

/* =========================
   EDIT APPLICATION
========================= */

function addEditListeners() {

    const editButtons =
        document.querySelectorAll(".edit-btn");

    editButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const id =
                    Number(button.dataset.id);

                const application =
                    applications.find(function (app) {

                        return app.id === id;
                    });

                const newStatus =
                    prompt(
                        "Enter Status:\nApplied\nOA Cleared\nInterview\nSelected\nRejected",
                        application.status
                    );

                if (!newStatus) {
                    return;
                }
                const validStatuses = [
                        "Applied",
                        "OA Cleared",
                        "Interview",
                        "Selected",
                        "Rejected"
                ];

                if (!validStatuses.includes(newStatus)) {
                     alert("Invalid Status. Please enter a valid status.");
                        return;
                }
                application.status =
                    newStatus;

                saveToLocalStorage();

                renderApplications();

                updateDashboard();
            }
        );
    });
}

/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

    totalApplications.textContent =
        applications.length;

    let oaCount = 0;
    let interviewCount = 0;
    let selectedCount = 0;

    applications.forEach(function (app) {

        if (app.status === "OA Cleared") {
            oaCount++;
        }

        if (app.status === "Interview") {
            interviewCount++;
        }

        if (app.status === "Selected") {
            selectedCount++;
        }
    });

    oaCleared.textContent =
        oaCount;

    interviews.textContent =
        interviewCount;

    selected.textContent =
        selectedCount;
}

/* =========================
   LOCAL STORAGE
========================= */

function saveToLocalStorage() {

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );
}

/* =========================
   SEARCH
========================= */

searchCompany.addEventListener(
    "input",
    renderApplications
);

/* =========================
   FILTER
========================= */

filterStatus.addEventListener(
    "change",
    renderApplications
);