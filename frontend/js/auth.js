const baseURl = "http://localhost:5000"
const token = localStorage.getItem("token");

const protectRoute = () => {
    if(token) {
        window.location.replace("index.html");
    }
};

const togglePassword  = (inputId, showId, hideId) => {
    const input = document.getElementById(inputId);
    const showIcon = document.getElementById(showId);
    const hideIcon = document.getElementById(hideId);
    if (input.type === "password") {
        input.type = "text"
        showIcon.style.display = "none"
        hideIcon.style.display = "block"
    } else {
        input.type = "password"
        showIcon.style.display = "block"
        hideIcon.style.display = "none"
    }
}

const handleSignup = async (e) => {
    e.preventDefault();
    const err = document.querySelector(".signupError")
    err.textContent = "";
    const userInput = document.getElementById("user-input").value
    const emailInput = document.getElementById("email-input").value
    const passwordInput = document.getElementById("signup-input").value
    try {
        const res = await fetch(`${baseURl}/api/auth/signup`,{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username:userInput,
                email:emailInput,
                password:passwordInput
            })
        })
        const data = await res.json();
        if(res.ok){
            localStorage.setItem("token",data.token)
            window.location.replace("index.html");
        } else{
            err.textContent = data.message;
        }
    } catch (error) {
        err.textContent = `${error.message}`;
    }
}

const handlelogin = async (e) => {
    e.preventDefault();
    const err = document.querySelector(".loginError")
    err.textContent = "";
    const emailInput = document.getElementById("login-email-input").value
    const passwordInput = document.getElementById("login-input").value
    try {
        const res = await fetch(`${baseURl}/api/auth/login`,{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:emailInput,
                password:passwordInput
            })
        })
        const data = await res.json();
        if(res.ok){
            localStorage.setItem("token",data.token)
            window.location.replace("index.html");
        } else{
            err.textContent = data.message;
        }
    } catch (error) {
        err.textContent = `${error.message}`;
    }
}

document.addEventListener("DOMContentLoaded",protectRoute)