const title = document.getElementById("title");
const description = document.getElementById("description");
const form = document.getElementById("create_form");

const validateTitle = () => {
    let value = title.value;
    return /^[a-zA-Z,() .!?-_]+$/.test(value);
};

const validateDescription = () => {
    let value = description.value;
    return /^[a-zA-Z,() .!?-_]+$/.test(value);
};

form.addEventListener("submit", (event) => {
    if (!validateTitle()) {
        event.preventDefault();
        addClass(title, "is-invalid");
    }

    if (!validateDescription()) {
        event.preventDefault();
        addClass(description, "is-invalid");
    }
});