const extensioncontainer = document.querySelector(".extensions__grid");
const filterbtns = document.querySelectorAll(".filter");
const toogletheme = document.querySelector(".theme-btn");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".behind");
const cancelbtn = document.querySelector(".cancel-btn");
const rembtn = document.querySelector(".rem-btn");
const themelogo = document.querySelector(".theme-icon");

let extensionArr;
let currentbtn;

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    extensionArr = data;
    displayExtensions(extensionArr);
  });

const displayExtensions = (extensionArr) => {
  extensionArr.forEach((extension) => {
    const isChecked = extension["isActive"] ? "checked" : "";
    const extensionHTML = `
        <div class="extension__card">
            <div class="extension__text">
              <img src=${extension["logo"]} />
              <div class="description">
                <h3>${extension["name"]}</h3>
                <p>
                  ${extension["description"]}
                </p>
              </div>
            </div>
            <div class="extension__btns">
              <button class='btn-remove' name="${extension["name"]}">Remove</button>
              <label for="${extension["name"]}">
                <input id="${extension["name"]}" ${isChecked} type="checkbox" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        `;
    extensioncontainer.insertAdjacentHTML("beforeend", extensionHTML);
  });
};

const filterExtensions = (filter) => {
  if (filter === "Active") {
    return extensionArr.filter((extension) => extension["isActive"]);
  } else if (filter === "Inactive") {
    return extensionArr.filter((extension) => !extension["isActive"]);
  } else return extensionArr;
};

const changeFilterState = (filterArr, filterbtnclicked) => {
  filterArr.forEach((filterbtn) => {
    if (filterbtn === filterbtnclicked)
      filterbtn.setAttribute("aria-pressed", "true");
    else filterbtn.setAttribute("aria-pressed", "false");
  });
};

filterbtns.forEach((filterbtn) => {
  filterbtn.addEventListener("click", () => {
    extensioncontainer.innerHTML = "";
    changeFilterState(filterbtns, filterbtn);
    displayExtensions(filterExtensions(filterbtn.getAttribute("id")));
  });
});

extensioncontainer.addEventListener("click", (event) => {
  if (event.target.type === "checkbox") {
    extensionArr.find(
      (extension) => extension["name"] === event.target.getAttribute("id")
    )["isActive"] = event.target.checked;
  }
});

const displayModal = () => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const removeModal = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

extensioncontainer.addEventListener("click", (event) => {
  if (event.target.className === "btn-remove") {
    displayModal();
    currentbtn = event.target;
  }
});

cancelbtn.addEventListener("click", () => {
  removeModal();
});

rembtn.addEventListener("click", () => {
  const extensionindex = extensionArr.findIndex(
    (extension) => extension["name"] === currentbtn.getAttribute("name")
  );
  extensioncontainer.innerHTML = "";
  extensionArr.splice(extensionindex, 1);
  const currentExtensions = document
    .querySelector("[aria-pressed=true]")
    .getAttribute("id");
  displayExtensions(filterExtensions(currentExtensions));
  removeModal();
});

const SystemTheme = (localstoragetheme, userselectedtheme) => {
  if (localstoragetheme !== null) return localstoragetheme;

  if (userselectedtheme.matches) return "dark";

  return "light";
};

const updateThemeIcon = (newTheme) => {
  themelogo.src =
    newTheme === "dark"
      ? "./assets/images/icon-sun.svg"
      : "./assets/images/icon-moon.svg";
};

toogletheme.addEventListener("click", () => {
  const localstoragetheme = localStorage.getItem("theme");
  const darkthemeselected = window.matchMedia("(prefers-color-scheme: dark)");

  const defaultheme = SystemTheme(localstoragetheme, darkthemeselected);
  const newTheme = defaultheme === "dark" ? "light" : "dark";
  updateThemeIcon(newTheme);
  document.querySelector("html").setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});
