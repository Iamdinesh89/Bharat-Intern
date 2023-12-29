const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const API_URL = 'http://localhost:3000/api/transactions';

async function fetchTransactions() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data && Array.isArray(data)) {
      init(data);
    } else {
      console.error('Error fetching transactions: Invalid data format', data);
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
}

async function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a name and amount');
  } else {
    const transaction = {
      name: text.value,
      amount: +amount.value,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchTransactions();
      text.value = '';
      amount.value = '';
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error adding transaction. Please try again.');
    }
  }
}

async function removeTransaction(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      fetchTransactions();
    } catch (error) {
      console.error('Error removing transaction:', error);
      alert('Error removing transaction. Please try again.');
    }
  }
  
function init(transactions) {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues(transactions);
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
  ${transaction.name} <span>${sign}${Math.abs(transaction.amount)}</span>
  <button class="delete-btn" onclick="removeTransaction('${transaction._id}')">x</button>
  `;

  list.appendChild(item);
}

// Update the balance, income, and expense
function updateValues(transactions) {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `${total}₹`;
  money_plus.innerText = `${income}₹`;
  money_minus.innerText = `${expense}₹`;
}

// Fetch transactions when the page loads
fetchTransactions();

// Event listener for form submission
form.addEventListener('submit', addTransaction);
