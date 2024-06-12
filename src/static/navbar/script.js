window.onload = () => {
  setTimeout(() => {
    const navbarDrawerOpen = document.querySelector(".navbar__drawer-button");

    const navbarDrawer = document.querySelector(".navbar__drawer");

    const navbarDrawerClose = document.querySelector(".navbar__drawer-close");

    const navbarDrawerToggle = () => {
      navbarDrawer.classList.toggle("open");
    };

    navbarDrawerOpen.onclick = navbarDrawerToggle;
    navbarDrawerClose.onclick = navbarDrawerToggle;
  }, 200);
};

document.addEventListener("click", (e) => {
  const isDropdownButton = e.target.matches("[data-dropdown-button]");
  if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return;

  const profileDropdown = document.querySelector("[data-dropdown]");
  if (isDropdownButton) {
    profileDropdown.classList.toggle("active");
  } else {
    profileDropdown.classList.remove("active");
  }
});

const dropdownMenu = document.querySelector("[data-dropdown-menu]");
const mobileMenu = document.querySelector(".navbar__drawer ul");

// get the token from cookie
const token = document.cookie.split("=")[1];

// decode the token
console.log(token)
const user = JSON.parse(atob(token.split(".")[1]));

// verify the token
const verifyToken = async () => {
  fetch("http://localhost:3000/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: user.id, token }),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      throw new Error("Token not verified");
    })
    .then((data) => {
      console.log(data)
      if (data.verified) {
        let dropdownMenuContent = `<p>Hi, ${data.user.username}!</p>`;
        let mobileMenuContent = `<li><a href="/profile" class="navbar__option">Profile</a></li>`;
        if (data.user.role_id === 1) {
          dropdownMenuContent += `
          
          <a href="/profile" class="dropdown__item">Profile</a>
          <a href="/admin" class="dropdown__item">Admin</a>
          <a href="/logout" class="dropdown__item">Logout</a>
          `;

          mobileMenuContent += `<li><a href="/admin" class="navbar__option">Admin</a></li>`;
        } else {
          dropdownMenuContent += `
          <a href="/profile" class="dropdown__item">Profile</a>
          <a href="/logout" class="dropdown__item">Logout</a>
          `;
        }
        dropdownMenu.innerHTML = dropdownMenuContent;
        mobileMenuContent += `<li><a href="/logout" class="navbar__option">Logout</a></li>`;
        mobileMenu.innerHTML += mobileMenuContent;
      }
    })
    .catch((err) => console.log(err));
};

verifyToken();
