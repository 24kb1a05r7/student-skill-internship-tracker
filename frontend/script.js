

const API = "http://localhost:3000/api";

let skills = [];
let internships = [];
let applications = [];

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = String(value);
    return div.innerHTML;
}

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.style.display =
            section.id === sectionId ? "block" : "none";
    });
}

async function loadData() {
    try {
        const [skillsResponse, internshipsResponse, applicationsResponse] =
            await Promise.all([
                fetch(`${API}/skills`),
                fetch(`${API}/internships`),
                fetch(`${API}/applications`)
            ]);

        if (!skillsResponse.ok ||
            !internshipsResponse.ok ||
            !applicationsResponse.ok) {
            throw new Error("Could not load project data");
        }

        skills = await skillsResponse.json();
        internships = await internshipsResponse.json();
        applications = await applicationsResponse.json();

        displaySkills();
        displayInternships();
        displayApplications();
        updateDashboard();

    } catch (error) {
        console.error(error);
        alert("Could not load data. Check that the backend and MySQL are running.");
    }
}

async function addSkill() {
    const input = document.getElementById("skillInput");
    const name = input.value.trim();

    if (!name) {
        alert("Please enter a skill.");
        return;
    }

    try {
        const response = await fetch(`${API}/skills`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });

        if (!response.ok) throw new Error("Could not save skill");

        input.value = "";
        await loadData();
    } catch (error) {
        alert("Unable to save skill. Check the backend.");
    }
}

function displaySkills() {
    const list = document.getElementById("skillList");
if (!list) return;
    list.innerHTML = "";

    skills.forEach(skill => {
        const li = document.createElement("li");
        li.textContent = skill.name;
        list.appendChild(li);
    });
}

async function addInternship() {
    const companyInput = document.getElementById("companyInput");
    const roleInput = document.getElementById("roleInput");

    const company = companyInput.value.trim();
    const role = roleInput.value.trim();

    if (!company || !role) {
        alert("Please enter company name and role.");
        return;
    }

    try {
        const response = await fetch(`${API}/internships`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company, role })
        });

        if (!response.ok) throw new Error("Could not save internship");

        companyInput.value = "";
        roleInput.value = "";
        await loadData();
    } catch (error) {
        alert("Unable to save internship. Check the backend.");
    }
}

function displayInternships() {
    const list = document.getElementById("internshipList");
    if (!list) return;
    list.innerHTML = "";

    if (internships.length === 0) {
        list.textContent = "No internships added yet.";
        return;
    }

    internships.forEach(internship => {
        const div = document.createElement("div");
        div.className = "internship-card";

        const heading = document.createElement("h3");
        heading.textContent = internship.COMPANY;

        const role = document.createElement("p");
        role.textContent = "Role: " + internship.role;

        const button = document.createElement("button");
        button.className = "apply-btn";
        button.textContent = "Apply";
        button.addEventListener("click", () => applyInternship(internship.id));

        div.append(heading, role, button);
        list.appendChild(div);
    });
}

async function applyInternship(internshipId) {
    try {
        const response = await fetch(`${API}/applications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ internship_id: internshipId })
        });

        if (!response.ok) throw new Error("Could not save application");

        await loadData();
        alert("Application saved successfully!");
    } catch (error) {
        alert("Unable to save application. Check the backend.");
    }
}

function displayApplications() {
    const list = document.getElementById("applicationList");
    if (!list) return;  
    list.innerHTML = "";

    if (applications.length === 0) {
        list.textContent = "No applications yet.";
        return;
    }

    applications.forEach(application => {
        const div = document.createElement("div");
        div.className = "internship-card";

        const heading = document.createElement("h3");
        heading.textContent = application.company;

        const role = document.createElement("p");
        role.textContent = "Applied for: " + application.role;

        const status = document.createElement("p");
        status.textContent = "Status: " + application.status;

        div.append(heading, role, status);
        list.appendChild(div);
    });
}

function updateDashboard() {
    const skillCount = document.getElementById("skillCount");
    const internshipCount = document.getElementById("internshipCount");
    const applicationCount = document.getElementById("applicationCount");

    if (skillCount) skillCount.textContent = skills.length;
    if (internshipCount) internshipCount.textContent = internships.length;
    if (applicationCount) applicationCount.textContent = applications.length;
}
showSection("dashboard");
loadData();