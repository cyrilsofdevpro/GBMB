document.addEventListener("DOMContentLoaded", () => {
  const staffForm = document.getElementById("staffForm");
  const staffListEl = document.getElementById("staff-list");

  // Load staff from localStorage and render them
  function loadStaff() {
    const staff = JSON.parse(localStorage.getItem("staff")) || [];
    staffListEl.innerHTML = "";

    staff.forEach((member) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${member.name}</td>
        <td>${member.position}</td>
        <td>${member.email}</td>
        <td>${member.phone}</td>
      `;
      staffListEl.appendChild(row);
    });

    // Optional: update total staff count
    const staffCount = document.getElementById("staff-count");
    if (staffCount) staffCount.textContent = staff.length;
  }

  // Handle form submission
  staffForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newStaff = {
      name: document.getElementById("staff_name").value.trim(),
      position: document.getElementById("staff_position").value.trim(),
      email: document.getElementById("staff_email").value.trim(),
      phone: document.getElementById("staff_phone").value.trim()
    };

    if (!newStaff.name || !newStaff.position || !newStaff.email || !newStaff.phone) {
      alert("Please fill all fields.");
      return;
    }

    let staff = JSON.parse(localStorage.getItem("staff")) || [];

    // ✅ Check for duplicate based on name + email
    const alreadyExists = staff.some(
      (s) => s.name.toLowerCase() === newStaff.name.toLowerCase() && s.email === newStaff.email
    );

    if (alreadyExists) {
      alert("This staff member already exists.");
      return;
    }

    staff.push(newStaff);
    localStorage.setItem("staff", JSON.stringify(staff));

    staffForm.reset();
    loadStaff();
  });

  loadStaff();
});