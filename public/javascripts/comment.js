const content = document.getElementById("content");
const form = document.getElementById("comment_form");

const validateContent = () => {
    let value = content.value;
    return /^[a-zA-Z,() .!?-_]+$/.test(value);
};

form.addEventListener("submit", (event) => {
    if (!validateContent()) {
        event.preventDefault();
        addClass(content, "is-invalid");
    }
});