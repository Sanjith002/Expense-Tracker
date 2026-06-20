const baseURl = "https://expense-tracker-xz85.onrender.com"
const token = localStorage.getItem("token");

const protectRoute = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.replace("login.html");
        return;
    }

    const res = await fetch(`${baseURl}/api/auth/verify`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        localStorage.removeItem("token");
        window.location.replace("login.html");
    }
}

const logout = async () => {
    localStorage.removeItem("token");
    window.location.replace("login.html")
}

const username = async () => {
    const user = document.querySelector(".user-name")
    try {
        const res = await fetch(`${baseURl}/api/auth/getme`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        user.textContent = data.username;
    } catch (error) {
        console.log(error);
        Toastify({
            text: error.message,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                color: "white",
                background: "#dc2626"
            }
        }).showToast();
    }
}

const dashboardValue = async () => {
    const income = document.getElementById("income-value")
    const expense = document.getElementById("expense-value")
    const balance = document.getElementById("balance-value")
    try {
        const res = await fetch(`${baseURl}/api/dashboard`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        const data = await res.json();
        if(!res.ok){
            throw new Error(data.message);
        }
        income.textContent = `₹ ${data.income.toLocaleString()}`;
        expense.textContent = `₹ ${data.expense.toLocaleString()}`;
        balance.textContent = `₹ ${data.balance.toLocaleString()}`;
    } catch (error) {
        console.log(error)
        Toastify({
            text: error.message,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                color: "white",
                background: "#dc2626"
            }
        }).showToast();
    }
}

const addIncome = async () => {
    const des = document.getElementById("description")
    const description = des.value
    const amt = document.getElementById("amount")
    const amount = Number(amt.value)
    try {
        const res = await fetch(`${baseURl}/api/transaction/add`,{
            method:"POST",
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                description,
                amount,
                type:"income"
            })
        })
        const data = await res.json();
        if(!res.ok){
            throw new Error(data.message)
        }
        Toastify({
            text: "Income added successfully!",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "#06A36A",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }
        }).showToast();
        des.value = "";
        amt.value = "";
        refreshUI();
    } catch (error) {
        console.log(error)
            Toastify({
            text: error.message,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                color: "white",
                background: "#dc2626",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }
        }).showToast();
        }
}

const addExpense = async () => {
    const des = document.getElementById("description")
    const description = des.value
    const amt = document.getElementById("amount")
    const amount = Number(amt.value)
    try {
        const res = await fetch(`${baseURl}/api/transaction/add`,{
            method:"POST",
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                description,
                amount,
                type:"expense"
            })
        })
        const data = await res.json();
        if(!res.ok){
            throw new Error(data.message)
        }
        Toastify({
            text: "Expense added successfully!",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "#06A36A",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }
        }).showToast();
        des.value = "";
        amt.value = "";
        refreshUI();
    } catch (error) {
        console.log(error)
        Toastify({
            text: error.message,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                color: "white",
                background: "#dc2626",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }
        }).showToast();
    }
}

const history = async () => {
    const historyList = document.querySelector(".history-list")
    try {
        const res = await fetch(`${baseURl}/api/dashboard/history`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        const data = await res.json();
        if(!res.ok){
            throw new Error(data.message)
        }
        historyList.innerHTML = "";
        if(data.lastFiveTransaction.length === 0){
            historyList.innerHTML = `
                <p class="empty-state">No transaction added</p>
            `
            return;
        }
        data.lastFiveTransaction.forEach( e => {
            const div = document.createElement("div");
            if(e.type === "income"){
                div.className = "history income"
            }else{
                div.className = "history expense"
            }
            div.innerHTML = `
                <p>${e.description}</p>
                <p>${e.amount}</p>
            `    
            historyList.appendChild(div);
        });
    } catch (error) {
        console.log(error)
        Toastify({
            text:error.message,
            duration:3000,
            gravity:"top",
            position:"right",
            style: {
                color: "white",
                background: "#dc2626",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }
        }).showToast();
    }
}

const allIncome = async () => {
    const transactions = document.getElementById("income-transactions")
    try {
        const res = await fetch(`${baseURl}/api/dashboard/income`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        const data = await res.json();
        if(!res.ok){
            throw new Error(data.message)
        }
        const incomes = data.incomeTransactions || [];
        transactions.innerHTML = "";
        if(incomes.length === 0){
            transactions.innerHTML = `
            <p class="transaction-empty-state">No income added</p>
            `
            return;
        }
        incomes.forEach(e => {
            const div = document.createElement("div")
            div.className = "transaction income"
            div.dataset.id = e._id;
            div.innerHTML = `
            <p class="des">${e.description}</p>
            <i class="bi bi-pencil-square edit"></i>
            <p class="amt">${e.amount}</p>
            `
            transactions.appendChild(div)
        })
    } catch (error) {
        console.log(error)
        Toastify({
            text:error.message,
            duration:3000,
            gravity:"top",
            position:"right",
            style: {
                color: "white",
                background: "#dc2626",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }
        })
    }
}

const allExpense = async () => {
    const transactions = document.getElementById("expense-transactions")
    try {
        const res = await fetch(`${baseURl}/api/dashboard/expense`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        const data = await res.json();
        if(!res.ok){
            throw new Error(data.message)
        }
        const expenses = data.expenseTransactions || [];
        transactions.innerHTML = "";
        if(expenses.length === 0){
            transactions.innerHTML = `
            <p class="transaction-empty-state">No expense added</p>
            `
            return;
        }
        expenses.forEach(e => {
            const div = document.createElement("div")
            div.className = "transaction expense"
            div.dataset.id = e._id;
            div.innerHTML = `
            <p class="des">${e.description}</p>
            <i class="bi bi-pencil-square edit"></i>
            <p class="amt">${e.amount}</p>
            `
            transactions.appendChild(div)
        })
    } catch (error) {
        console.log(error)
        Toastify({
            text:error.message,
            duration:3000,
            gravity:"top",
            position:"right",
            style: {
                color: "white",
                background: "#dc2626",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }
        })
    }
}

const allTransactions = document.querySelector(".all-transactions");

allTransactions.addEventListener("click", (event) => {
    if(!event.target.classList.contains("edit")) return;
    if (document.querySelector(".edit-box")) return;
    const selectRow = event.target.closest(".transaction");
    const rowId = selectRow.dataset.id;

    const currentDescription = selectRow.querySelector(".des").textContent;
    const currentAmount = selectRow.querySelector(".amt").textContent;

    selectRow.style.display = "none";
    const editdiv = document.createElement("div")
    editdiv.className = "edit-box"
    editdiv.innerHTML = `
    <div class="edit-transaction">
        <div>
            <label for="Description">Description</label>
            <input type="text" class="edit-des" value="${currentDescription}">
        </div>
        <div>
            <label for="Amount">Amount</label>
            <input type="text" class="edit-amt" value="${currentAmount}">
        </div>
        <div class="edit-btns">
            <button class="edit-btn">Update</button>
            <button class="delete-btn">Delete</button>
            <button class="cancel-btn">Cancel</button>
        </div>
    </div>  
    `
    selectRow.after(editdiv);

    editdiv.querySelector(".edit-btn").addEventListener("click", async () => {
        const description = editdiv.querySelector(".edit-des").value
        const amount = Number(editdiv.querySelector(".edit-amt").value)
        try {
            const res = await fetch(`${baseURl}/api/transaction/update/${rowId}`,{
                method:"PUT",
                headers:{
                    Authorization:`Bearer ${token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    description,
                    amount
                })
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message)
            }
            editdiv.remove();
            selectRow.style.removeProperty("display");
            refreshUI();
        } catch (error) {
            console.log(error)
            Toastify({
            text:error.message,
            duration:3000,
            gravity:"top",
            position:"right",
            style: {
                color: "white",
                background: "#dc2626",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }
        })
        }
    })

    editdiv.querySelector(".delete-btn").addEventListener("click", async () => {
        try {
            const res = await fetch(`${baseURl}/api/transaction/delete/${rowId}`,{
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message);
            }
            editdiv.remove();
            selectRow.style.removeProperty("display");
            refreshUI();
        } catch (error) {
            console.log(error)
            Toastify({
            text:error.message,
            duration:3000,
            gravity:"top",
            position:"right",
            style: {
                color: "white",
                background: "#dc2626",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }
        })
        }
    })

    editdiv.querySelector(".cancel-btn").addEventListener("click", () => {
        editdiv.remove();
        selectRow.style.removeProperty("display");
    })
})

const refreshUI = () => {
    dashboardValue();
    history();
    allIncome();
    allExpense();
};

document.addEventListener("DOMContentLoaded", () => {
    protectRoute(),
    username(),
    refreshUI()
});

