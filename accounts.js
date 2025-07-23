// LocalStorage key
const STORAGE_KEY = "accounts";

// Utility: Show toast message
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.backgroundColor = type === "error" ? "#e74c3c" : "#2ecc71";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// Load accounts from localStorage
function loadAccounts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Save accounts to localStorage
function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

// Render account table
function renderAccounts() {
  const accountBody = document.getElementById("accountBody");
  accountBody.innerHTML = "";

  const accounts = loadAccounts();
  accounts.forEach((acc, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${acc.account_number}</td>
      <td>${acc.full_name}</td>
      <td>${acc.type}</td>
      <td>₦${acc.balance}</td>
      <td>${acc.status}</td>
      <td>${acc.created}</td>
      <td>
        <button onclick="editAccount(${index})">✏️</button>
        <button onclick="deleteAccount(${index})">🗑️</button>
      </td>
    `;
    accountBody.appendChild(row);
  });
}

// Add New Account
document.getElementById("accountForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const full_name = document.getElementById("full_name").value;
  const account_number = document.getElementById("account_number").value;
  const type = document.getElementById("type").value;
  const balance = parseFloat(document.getElementById("balance").value);

  const newAccount = {
    full_name,
    account_number,
    type,
    balance,
    status: "Active",
    created: new Date().toLocaleDateString(),
  };

  const accounts = loadAccounts();
  accounts.push(newAccount);
  saveAccounts(accounts);
  renderAccounts();
  showToast("✅ Account created successfully");

  document.getElementById("accountForm").reset();
});

// Edit Account
function editAccount(index) {
  const accounts = loadAccounts();
  const acc = accounts[index];

  document.getElementById("edit_id").value = index;
  document.getElementById("edit_customer").value = acc.full_name;
  document.getElementById("edit_type").value = acc.type;
  document.getElementById("edit_balance").value = acc.balance;
  document.getElementById("edit_status").value = acc.status;

  document.getElementById("editSection").style.display = "block";
}

// Update Account
document.getElementById("editForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("edit_id").value;
  const accounts = loadAccounts();

  accounts[id].full_name = document.getElementById("edit_customer").value;
  accounts[id].type = document.getElementById("edit_type").value;
  accounts[id].balance = parseFloat(document.getElementById("edit_balance").value);
  accounts[id].status = document.getElementById("edit_status").value;

  saveAccounts(accounts);
  renderAccounts();
  showToast("✅ Account updated");
  document.getElementById("editForm").reset();
  document.getElementById("editSection").style.display = "none";
});

// Delete Account
function deleteAccount(index) {
  if (confirm("Are you sure you want to delete this account?")) {
    const accounts = loadAccounts();
    accounts.splice(index, 1);
    saveAccounts(accounts);
    renderAccounts();
    showToast("❌ Account deleted", "error");
  }
}

// Initial render
window.addEventListener("DOMContentLoaded", renderAccounts);

const form = document.getElementById("accountForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const full_name = document.getElementById("full_name").value;
  const account_number = document.getElementById("account_number").value;
  const type = document.getElementById("type").value;
  const balance = document.getElementById("balance").value;

  const newAccount = { full_name, account_number, type, balance };

  // Save to localStorage
  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
  accounts.push(newAccount);
  localStorage.setItem("accounts", JSON.stringify(accounts));

  // Clear form and show success
  form.reset();
  alert("Account created successfully!");
});

const depositForm = document.getElementById("depositForm");

depositForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const nameOrAcc = document.getElementById("deposit_name").value.trim();
  const amount = parseFloat(document.getElementById("deposit_amount").value);
  const note = document.getElementById("deposit_note").value.trim();

  if (!nameOrAcc || isNaN(amount) || amount <= 0) {
    showToast("Please enter valid details.");
    return;
  }

  const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
  const account = accounts.find(
    acc =>
      acc.account_number === nameOrAcc ||
      acc.full_name.toLowerCase() === nameOrAcc.toLowerCase()
  );

  if (!account) {
    showToast("Account not found!");
    return;
  }

  // Update balance
  account.balance += amount;
  localStorage.setItem("accounts", JSON.stringify(accounts));

  // Save transaction
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  transactions.push({
    date: new Date().toLocaleDateString(),
    customer: account.full_name,
    amount: amount,
    type: "Deposit",
    note: note
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // Refresh data
  loadAccounts();
  loadTransactions();

  depositForm.reset();
  showToast("Deposit successful!");
});

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
accounts.push({
  full_name: "John Doe",
  account_number: "123456",
  type: "Savings",
  balance: 5000
});
localStorage.setItem("accounts", JSON.stringify(accounts));
