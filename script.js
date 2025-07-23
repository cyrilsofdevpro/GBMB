// Loans Page (loans.html)
document.addEventListener("DOMContentLoaded", () => {
  const approveBtns = document.querySelectorAll(".btn-approve");
  const rejectBtns = document.querySelectorAll(".btn-reject");
  const viewBtns = document.querySelectorAll(".btn-view");
  const searchInput = document.querySelector(".search-bar input");

  approveBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const status = row.querySelector(".status");
      status.textContent = "Approved";
      status.className = "status approved";
      alert("Loan Approved!");
      // Optional: Update status in Supabase here
    });
  });

  rejectBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const status = row.querySelector(".status");
      status.textContent = "Rejected";
      status.className = "status rejected";
      alert("Loan Rejected!");
      // Optional: Update status in Supabase here
    });
  });

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const loanId = btn.closest("tr").querySelector("td").textContent;
      window.location.href = `loan-details.html?loan=${loanId}`;
    });
  });

  if (searchInput) {
    searchInput.addEventListener("keyup", () => {
      const filter = searchInput.value.toLowerCase();
      document.querySelectorAll("tbody tr").forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
      });
    });
  }
});

// Loan Details Page (loan-details.html)
document.addEventListener("DOMContentLoaded", () => {
  const approveBtn = document.querySelector(".loan-info-box .btn-approve");
  const rejectBtn = document.querySelector(".loan-info-box .btn-reject");
  const repaymentForm = document.querySelector(".add-repayment-form form");

  if (approveBtn) {
    approveBtn.addEventListener("click", () => {
      const status = document.querySelector(".status");
      status.textContent = "Approved";
      status.className = "status approved";
      alert("Loan Approved!");
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      const status = document.querySelector(".status");
      status.textContent = "Rejected";
      status.className = "status rejected";
      alert("Loan Rejected!");
    });
  }

  if (repaymentForm) {
    repaymentForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const amount = repaymentForm.amount.value;
      const method = repaymentForm.method.value;
      const note = repaymentForm.note.value;
      const today = new Date().toISOString().split("T")[0];

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${today}</td>
        <td>₦${Number(amount).toLocaleString()}</td>
        <td>${method === "bank" ? "Bank Transfer" : "Cash"}</td>
        <td>${note}</td>
      `;

      document.querySelector(".repayment-history tbody").appendChild(row);
      repaymentForm.reset();
      alert("Repayment Recorded!");
    });
  }
});

// Loan Form Validation
document.addEventListener("DOMContentLoaded", () => {
  const loanForm = document.getElementById('loanForm');

  if (loanForm) {
    loanForm.addEventListener('submit', function (e) {
      const amount = loanForm.amount.value;
      const interest = loanForm.interest.value;

      if (amount <= 0 || interest < 0) {
        e.preventDefault();
        alert("Please enter a valid loan amount and interest.");
      }
    });
  }
});


approveBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const row = btn.closest("tr");
    const loanId = row.querySelector("td").textContent;

    // Update Supabase
    const { error } = await supabase
      .from("loans")
      .update({ status: "Approved" })
      .eq("loan_id", loanId);

    if (error) {
      alert("Failed to update loan status");
      return;
    }

    row.querySelector(".status").textContent = "Approved";
    row.querySelector(".status").className = "status approved";
    alert("Loan Approved!");
  });
});

document.getElementById("loanForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const loan_id = this.loan_id.value;
  const customer = this.customer.value;
  const amount = parseFloat(this.amount.value);
  const duration = parseInt(this.duration.value);

  const { data, error } = await supabase.from("loans").insert([
    { loan_id, customer, amount, duration, status: "Pending", repayment: 0 }
  ]);

  if (error) {
    alert("Error adding loan.");
    console.error(error);
  } else {
    alert("Loan added successfully!");
    this.reset();
  }
});


document.addEventListener('click', function(e) {
  if (e.target.classList.contains("btn-view")) {
    const row = e.target.closest("tr");
    const loanId = row.querySelector("td").textContent;
    const customer = row.children[1].textContent;
    const currentRepayment = row.children[5].textContent;

    document.getElementById("loanDetails").textContent = `Loan for ${customer} (${loanId}) - Current: ${currentRepayment}`;
    document.getElementById("repaymentLoanId").value = loanId;
    document.getElementById("repaymentModal").classList.remove("hidden");
  }

  if (e.target.id === "closeModal") {
    document.getElementById("repaymentModal").classList.add("hidden");
  }
});

document.getElementById("repaymentForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const loanId = document.getElementById("repaymentLoanId").value;
  const newRepayment = parseFloat(document.getElementById("repaymentAmount").value);

  // Fetch current repayment
  const { data, error: fetchError } = await supabase
    .from("loans")
    .select("repayment")
    .eq("loan_id", loanId)
    .single();

  if (fetchError) {
    alert("Error fetching current repayment.");
    return;
  }

  const updatedRepayment = (data.repayment || 0) + newRepayment;

  // Update Supabase
  const { error } = await supabase
    .from("loans")
    .update({ repayment: updatedRepayment })
    .eq("loan_id", loanId);

  if (error) {
    alert("Error updating repayment.");
  } else {
    alert("Repayment updated!");
    document.getElementById("repaymentModal").classList.add("hidden");
    location.reload(); // refresh to show updated amount
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Load staff data from localStorage
  const staff = JSON.parse(localStorage.getItem("staff")) || [];

  // Update total staff count
  const totalElement = document.getElementById("staff-total");
  if (totalElement) {
    totalElement.textContent = `Total Staff: ${staff.length}`;
  }

  // Show list of names and positions
  const listContainer = document.getElementById("staff-list-overview");
  if (listContainer) {
    listContainer.innerHTML = "";

    staff.forEach(member => {
      const li = document.createElement("li");
      li.textContent = `${member.name} — ${member.position}`;
      listContainer.appendChild(li);
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

  // Total Customers
  const customerTotal = document.getElementById("customer-total");
  if (customerTotal) {
    customerTotal.textContent = `Total Customers: ${accounts.length}`;
  }

  // Total Deposits
  const depositTotal = document.getElementById("total-deposit");
  if (depositTotal) {
    const total = accounts.reduce((sum, acc) => sum + (acc.deposit || 0), 0);
    depositTotal.textContent = `₦${total.toLocaleString()}`;
  }

  // Show Staff (optional from previous step)
  const staff = JSON.parse(localStorage.getItem("staff")) || [];
  const staffTotal = document.getElementById("staff-total");
  if (staffTotal) {
    staffTotal.textContent = `Total Staff: ${staff.length}`;
  }

  const staffList = document.getElementById("staff-list-overview");
  if (staffList) {
    staffList.innerHTML = "";
    staff.forEach(s => {
      const li = document.createElement("li");
      li.textContent = `${s.name} — ${s.position}`;
      staffList.appendChild(li);
    });
  }
});
