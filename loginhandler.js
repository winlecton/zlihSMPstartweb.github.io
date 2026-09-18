```javascript
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    /*
        TEMPORARY DEMO LOGIN

        This is NOT real security.
        We will replace this with the Control API later.

        Demo credentials:
        username: admin
        password: zlih-demo
    */

    if (username === "admin" && password === "zlih-demo") {
        sessionStorage.setItem("zlihLoggedIn", "true");
        window.location.href = "index.html";
        return;
    }

    loginError.textContent = "Invalid username or password.";
});
```
