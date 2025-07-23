import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ✅ Using your actual Supabase keys
const supabase = createClient(
  "https://cxnwrvnevhspqlozwusp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4bndydm5ldmhzcHFsb3p3dXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODQxMjgsImV4cCI6MjA2ODY2MDEyOH0.DqyHNhYm1xY-6WtZCi-_6D8PnAqS272GLsL9Y-ppHko"
);

// Load transactions
document.addEventListener("DOMContentLoaded", async () => {
  await loadTransactions();
});

async function loadTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    alert("Failed to fetch transactions");
    console.error(error);
    return;
  }

  const tbody = document.getElementById("transactionBody");
  tbody.innerHTML = "";

  data.forEach((tx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${tx.date}</td>
      <td>${tx.customer}</td>
      <td>${tx.type}</td>
      <td>₦${Number(tx.amount).toLocaleString()}</td>
      <td>${tx.note || ""}</td>
    `;
    tbody.appendChild(row);
  });
}

// Submit transaction
document.getElementById("transactionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const newTx = {
    customer: form.customer.value,
    type: form.type.value,
    amount: parseFloat(form.amount.value),
    note: form.note.value || null,
  };

  const { error } = await supabase.from("transactions").insert([newTx]);
  if (error) {
    alert("Error adding transaction.");
    console.error(error);
  } else {
    alert("Transaction added!");
    form.reset();
    loadTransactions();
  }
});


async function loadTransactions() {
  const customer = document.getElementById("filterCustomer").value.trim();
  const date = document.getElementById("filterDate").value;

  let query = supabase.from("transactions").select("*").order("date", { ascending: false });

  if (customer) {
    query = query.ilike("customer", `%${customer}%`);
  }

  if (date) {
    query = query.eq("date", date);
  }

  const { data, error } = await query;

  if (error) {
    alert("Failed to fetch transactions");
    console.error(error);
    return;
  }

  const tbody = document.getElementById("transactionBody");
  tbody.innerHTML = "";

  data.forEach((tx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${tx.date}</td>
      <td>${tx.customer}</td>
      <td>${tx.type}</td>
      <td>₦${Number(tx.amount).toLocaleString()}</td>
      <td>${tx.note || ""}</td>
    `;
    tbody.appendChild(row);
  });
}

document.getElementById("applyFilterBtn").addEventListener("click", () => {
  loadTransactions();
});

document.getElementById("clearFilterBtn").addEventListener("click", () => {
  document.getElementById("filterCustomer").value = "";
  document.getElementById("filterDate").value = "";
  loadTransactions();
});

function exportToCSV() {
  const rows = document.querySelectorAll("#transactionBody tr");
  if (!rows.length) {
    alert("No transactions to export.");
    return;
  }

  let csv = "Date,Customer,Type,Amount,Note\n";

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const rowData = Array.from(cells).map(cell => `"${cell.textContent.trim()}"`);
    csv += rowData.join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", "transactions_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
document.getElementById("exportCSVBtn").addEventListener("click", exportToCSV);
