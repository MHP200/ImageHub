const userName = document.getElementById("username");
const form = document.getElementById("register_form");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("password_confirmation");

const validateName = () => {
    let nameValue = userName.value;
    return /^[a-zA-Z]+ ?[a-zA-Z0-9]*? ?[a-zA-Z0-9]*?$/.test(nameValue);
};

const validatePassword = () => {
    let passValue = password.value;
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(passValue);
};

const validateConfirm = () => {
    let pass1 = password.value;
    let pass2 = confirmPassword.value;
    return pass1 === pass2;
};

form.addEventListener("submit", (event) => {
    if (!validateName()) {
        event.preventDefault();
        addClass(userName, "is-invalid");
    }

    if (!validatePassword()) {
        event.preventDefault();
        addClass(password, "is-invalid");
    }

    if (!validateConfirm()) {
        event.preventDefault();
        addClass(confirmPassword, "is-invalid");
    }
});