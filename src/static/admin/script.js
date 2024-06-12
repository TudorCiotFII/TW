const loadUsers = async () => {
  await fetch("http://localhost:4000/users", {})
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Error loading users");
      }
    })
    .then((data) => {
      showUsers(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleEditButtonClick = (userID) => {
  const userNameCell = document.getElementById(`username-${userID}`);
  const userEmailCell = document.getElementById(`email-${userID}`);
  const editButton = document.getElementById(`edit-${userID}`);

  if (editButton) {
    if (editButton.textContent === "Edit") {
      editButton.textContent = "Save";
    } else {
      handleSaveButtonClick(userID);
    }
  }
};

const handleDeleteButtonClick = (userID) => {
  const table = document.getElementById("user-table");
  fetch(`http://localhost:4000/users/${userID}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        const row = document.getElementById(`row-${userID}`);
        row.remove();
      } else {
        throw new Error("Error deleting user");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  table.innerHTML = "";
  loadUsers();
};

const handleSaveButtonClick = (userID) => {
  const userNameCell = document.getElementById(`username-${userID}`);
  const userEmailCell = document.getElementById(`email-${userID}`);
  const editButton = document.getElementById(`edit-${userID}`);

  if (editButton) {
    if (editButton.textContent === "Save") {
      editButton.textContent = "Edit";
      userNameCell.classList.toggle("editable-field");
      userEmailCell.classList.toggle("editable-field");

      const updatedData = {
        username: userNameCell.textContent,
        email: userEmailCell.textContent,
      };

      fetch(`http://localhost:4000/users/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Error updating user");
          }
        })
        .then((updatedUser) => {
          console.log(updatedUser);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
};

const showUsers = async (data) => {
  let color = "white";
  const table = document.getElementById("user-table");
  data.forEach((user) => {
    const userID = user.id;
    const userName = user.username;
    const userEmail = user.email;
    const userCreatedAt = user.created_at;
    const userRole = user.role_id === 1 ? "Admin" : "User";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${userID}</td>
      <td id="username-${userID}">${userName}</td>
      <td id="email-${userID}">${userEmail}</td>
      <td>${userCreatedAt}</td>
      <td>${userRole}</td>
      <td>
        ${
          user.role_id === 2
            ? `<button id="edit-${userID}" class="btn btn-primary">Edit</button>
               <button id="delete-${userID}" class="btn btn-danger">Delete</button>`
            : `<span></span>`
        }
      </td>
    `;

    if (user.role_id === 2) {
      const editButton = row.querySelector(`#edit-${userID}`);
      editButton.addEventListener("click", () => {
        const userNameCell = document.getElementById(`username-${userID}`);
        const userEmailCell = document.getElementById(`email-${userID}`);
        if (color === "pink") {
          userNameCell.classList.toggle("white-background");
          userEmailCell.classList.toggle("white-background");
          userNameCell.contentEditable = false;
          userEmailCell.contentEditable = false;
          color = "white";
        } else if (color === "white") {
          userNameCell.classList.toggle("white-background");
          userEmailCell.classList.toggle("white-background");
          userNameCell.contentEditable = true;
          userEmailCell.contentEditable = true;
          color = "pink";
        }

        if (editButton.textContent === "Edit") {
          handleEditButtonClick(userID);
        } else if (editButton.textContent === "Save") {
          handleSaveButtonClick(userID);
        }
      });

      const deleteButton = row.querySelector(`#delete-${userID}`);
      deleteButton.addEventListener("click", () => {
        handleDeleteButtonClick(userID);
      });
    }

    table.appendChild(row);
  });
};

loadUsers();
