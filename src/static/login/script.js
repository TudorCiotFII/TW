const username = document.getElementById("username");
const password = document.getElementById("password");
const errorText = document.getElementById("error-message");
// add event listener to the form
document.getElementById("submit-btn").addEventListener("click", (event) => {
  event.preventDefault();
  login();
});

// register function

function login() {
  // get the values from the form
  const usernameValue = username.value;
  const passwordValue = password.value;

  // check if the values are not empty
  if (!usernameValue || !passwordValue) {
    errorText.innerHTML = "Please fill in all the fields";
    return;
  }

  const requestBody = {
    username: usernameValue,
    password: passwordValue,
  };

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message) {
        errorText.style.color = "red";
        errorText.innerHTML = `Error: ${data.message}`;
      } else {
        document.cookie = `token=${data.token}`;
        window.location.href = "http://localhost:3000";
      }
    });
}
