// Get the menu links and content blocks
const accountOverviewLink = document.getElementById("account-overview-link");
const editProfileLink = document.getElementById("edit-profile-link");
const changePasswordLink = document.getElementById("change-password-link");
const editButton = document.getElementById("edit-profile-button");
// Get the content blocks
const accountOverviewBlock = document.getElementById("account-overview");
const editProfileBlock = document.getElementById("edit-profile");
const changePasswordBlock = document.getElementById("change-password");
const accountSelect = document.getElementById("account");

// Function to hide all content blocks and remove the selected class from links
function hideAllContentBlocks() {
  accountOverviewBlock.style.display = "none";
  editProfileBlock.style.display = "none";
  changePasswordBlock.style.display = "none";

  accountOverviewLink.classList.remove("active");
  editProfileLink.classList.remove("active");
  changePasswordLink.classList.remove("active");
}
// Show the default content block and mark the corresponding link as selected
hideAllContentBlocks();
accountOverviewBlock.style.display = "flex";
accountOverviewLink.classList.add("active");

accountOverviewLink.addEventListener("click", async function (event) {
  event.preventDefault();

  hideAllContentBlocks();

  accountOverviewBlock.style.display = "flex";

  accountOverviewLink.classList.add("active");
});

editProfileLink.addEventListener("click", function (event) {
  event.preventDefault();

  hideAllContentBlocks();

  editProfileBlock.style.display = "flex";

  editProfileLink.classList.add("active");
});

changePasswordLink.addEventListener("click", function (event) {
  event.preventDefault();

  hideAllContentBlocks();

  changePasswordBlock.style.display = "flex";

  changePasswordLink.classList.add("active");
});

editButton.addEventListener("click", function (event) {
  event.preventDefault();

  hideAllContentBlocks();

  editProfileBlock.style.display = "flex";

  editProfileLink.classList.add("active");
});

accountSelect.addEventListener("change", function () {
  const page = document.getElementById(accountSelect.value);
  hideAllContentBlocks();

  page.style.display = "flex";

  page.classList.add("active");
});

const getUserData = async () => {
  const token = document.cookie.split("=")[1];
  const user = JSON.parse(atob(token.split(".")[1]));
  const id = user.id;
  const response = await fetch(`http://localhost:4000/users/${id}`);
  const data = await response.json();

  const usernameSpan = document.getElementById("username");
  const emailSpan = document.getElementById("email");
  const firstNameSpan = document.getElementById("first-name");
  const lastNameSpan = document.getElementById("last-name");

  usernameSpan.innerText = data.username;
  emailSpan.innerText = data.email;
  firstNameSpan.innerText = data.firstname;
  lastNameSpan.innerText = data.lastname;

  const usernameInput = document.getElementById("username-input");
  const emailInput = document.getElementById("email-input");
  const firstNameInput = document.getElementById("first-name-input");
  const lastNameInput = document.getElementById("last-name-input");

  usernameInput.value = data.username;
  emailInput.value = data.email;
  firstNameInput.value = data.firstname;
  lastNameInput.value = data.lastname;
};

document.onload = getUserData();

const editProfile = async (event) => {
  event.preventDefault();
  const token = document.cookie.split("=")[1];
  const user = JSON.parse(atob(token.split(".")[1]));
  const id = user.id;

  const usernameInput = document.getElementById("username-input");
  const emailInput = document.getElementById("email-input");
  const firstNameInput = document.getElementById("first-name-input");
  const lastNameInput = document.getElementById("last-name-input");

  const username = usernameInput.value;
  const email = emailInput.value;
  const firstname = firstNameInput.value;
  const lastname = lastNameInput.value;

  const requestBody = {
    username,
    email,
    firstname,
    lastname,
  };

  const response = await fetch(`http://localhost:4000/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  const usernameSpan = document.getElementById("username");
  const emailSpan = document.getElementById("email");
  const firstNameSpan = document.getElementById("first-name");
  const lastNameSpan = document.getElementById("last-name");

  usernameSpan.innerText = data.username;
  emailSpan.innerText = data.email;
  firstNameSpan.innerText = data.first_name;
  lastNameSpan.innerText = data.last_name;
};

const changePassword = async (event) => {
  event.preventDefault();
  const token = document.cookie.split("=")[1];
  const user = JSON.parse(atob(token.split(".")[1]));
  const id = user.id;

  const oldPasswordInput = document.getElementById("old-password-input");
  const newPasswordInput = document.getElementById("new-password-input");
  const confirmPasswordInput = document.getElementById(
    "confirm-password-input"
  );

  const oldPassword = oldPasswordInput.value;
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const requestBody = {
    oldPassword,
    newPassword,
  };

  const response = await fetch(`http://localhost:4000/users/${id}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  alert(data.message);
};

const saveChangesButton = document.getElementById("save-changes-button");

saveChangesButton.addEventListener("click", editProfile);

const changePasswordButton = document.getElementById("change-password-button");

changePasswordButton.addEventListener("click", changePassword);
