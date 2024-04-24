document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('expense-form');
    const totalExpenses = document.getElementById('total-expenses');
    const expensesList = document.getElementById('expenses-list');
    const editFormContainer = document.getElementById('edit-form-container');
    const editForm = document.getElementById('edit-form');
    const cancelEditBtn = document.getElementById('cancel-edit');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const date = document.getElementById('date').value;
        const category = document.getElementById('category').value;
        const amount = parseFloat(document.getElementById('amount').value);

        const expense = {
            date,
            category,
            amount
        };

        saveExpense(expense);
        form.reset();
    });

    function saveExpense(expense) {
        fetch('http://localhost:3000/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Expense added:', data);
            updateTotalExpenses();
            fetchExpenses();
        })
        .catch(error => {
            console.error('Error adding expense:', error);
        });
    }

    function updateTotalExpenses() {
        fetch('http://localhost:3000/expenses')
        .then(response => response.json())
        .then(data => {
            const total = data.reduce((acc, expense) => acc + expense.amount, 0);
            totalExpenses.innerHTML = `<h2>Gastos Totales del Mes: ${total.toFixed(2)}€ </h2>`;
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
        });
    }

    function fetchExpenses() {
        fetch('http://localhost:3000/expenses')
        .then(response => response.json())
        .then(data => {
            expensesList.innerHTML = ''; // Limpiar la lista antes de volver a mostrar los gastos
            data.forEach(expense => {
                const expenseItem = document.createElement('div');
                expenseItem.classList.add('expense-item');
                expenseItem.innerHTML = `
                    <span>${expense.date}</span>
                    <span>${expense.category}</span>
                    <span>${expense.amount.toFixed(2)}€ </span>
                    <button class="edit-btn" data-id="${expense.id}">Editar</button>
                    <button class="delete-btn" data-id="${expense.id}">Eliminar</button>
                `;
                expensesList.appendChild(expenseItem);

                // Agregar eventos a los botones de editar y eliminar
                const editBtn = expenseItem.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => editExpense(expense.id));

                const deleteBtn = expenseItem.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => deleteExpense(expense.id));
            });
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
        });
    }

    function editExpense(id) {
        fetch(`http://localhost:3000/expenses/${id}`)
        .then(response => response.json())
        .then(data => {
            fillEditForm(data);
        })
        .catch(error => {
            console.error('Error fetching expense for edit:', error);
        });
    }

    function fillEditForm(expense) {
        const editIdInput = document.getElementById('edit-expense-id');
        const editDateInput = document.getElementById('edit-date');
        const editCategoryInput = document.getElementById('edit-category');
        const editAmountInput = document.getElementById('edit-amount');

        editIdInput.value = expense.id;
        editDateInput.value = expense.date;
        editCategoryInput.value = expense.category;
        editAmountInput.value = expense.amount;

        editFormContainer.style.display = 'block';
    }

    editForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const id = document.getElementById('edit-expense-id').value;
        const date = document.getElementById('edit-date').value;
        const category = document.getElementById('edit-category').value;
        const amount = parseFloat(document.getElementById('edit-amount').value);

        const updatedExpense = {
            id,
            date,
            category,
            amount
        };

        updateExpense(updatedExpense);
    });

    cancelEditBtn.addEventListener('click', function () {
        editFormContainer.style.display = 'none';
    });

    function updateExpense(expense) {
        fetch(`http://localhost:3000/expenses/${expense.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Expense updated:', data);
            updateTotalExpenses();
            fetchExpenses();
            editFormContainer.style.display = 'none';
        })
        .catch(error => {
            console.error('Error updating expense:', error);
        });
    }

    function deleteExpense(id) {
        fetch(`http://localhost:3000/expenses/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Expense deleted:', data);
            updateTotalExpenses();
            fetchExpenses();
        })
        .catch(error => {
            console.error('Error deleting expense:', error);
        });
    }

    updateTotalExpenses();
    fetchExpenses();
});
