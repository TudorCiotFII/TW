const username = document.getElementById("username");
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const errorText = document.getElementById("error-message");

document.getElementById("submit-btn").addEventListener("click", (event) => {
  event.preventDefault();
  register();
});

function register() {
  const usernameValue = username.value;
  const emailValue = email.value;
  const passwordValue = password.value;
  const firstnameValue = firstname.value;
  const lastnameValue = lastname.value;
  const confirmPasswordValue = confirmPassword.value;

  if (confirmPasswordValue != passwordValue) {
    errorText.style.color = "red";
    errorText.innerText = "Error: Passwords do not match";
    return;
  }

  const requestBody = {
    username: usernameValue,
    firstname: firstnameValue,
    lastname: lastnameValue,
    email: emailValue,
    password: passwordValue,
  };

  fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  }).then((res) => {
    switch (res.status) {
      case 201:
        window.location.href = "http://localhost:3000/login";
        break;
      case 409:
        errorText.innerText = "Error: User already exists";
        break;
      default:
        errorText.innerText = "Error: " + res.statusText;
    }
  });
}
