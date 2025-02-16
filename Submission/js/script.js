// Function to handle user registration
function register() {
  const { fullname, username, email, contact, password, confirmPassword } = fetchRegisterPageData();

  // Validate that password and confirmPassword match
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Retrieve existing users from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    alert("Username already exists! Please choose another username.");
    return;
  }

  // Create a new user object
  const newUser = { fullname, username, email, contact, password };

  // Add the new user to the users array
  users.push(newUser);

  // Save the updated users array to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  // Redirect to signin.html page
  window.location.href = "../html/signin.html";
}

// Fetch form data from the register.html page
function fetchRegisterPageData() {
  // Fetch form values
  const fullname = document.getElementById("fullname").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const contact = document.getElementById("contact").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  return { fullname, username, email, contact, password, confirmPassword };
}

// Function to handle user login
function signIn() {
  const { username, password, messageElement } = fetchSignInPageData();

  // Retrieve users from localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Find the user with matching credentials
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    // Set login status in sessionStorage
    sessionStorage.setItem("login", true);
    // Redirect to index.html page
    window.location.href = "../html/index.html";
  } else {
    // Display an error message if credentials are invalid
    messageElement.textContent = "Invalid username or password!";
  }
}

// Function to fetch user data from the signin.html page
function fetchSignInPageData() {
  // Fetch data from the signin form
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const messageElement = document.getElementById("message");

  return { username, password, messageElement };
}

// Function to load content on the index.html page
function loadContent() {
  // Fetch the login info from the session storage
  const userLogin = sessionStorage.getItem("login");

  // Check whether the login status is true
  if (userLogin) {
    fetchAndLoadData();
  } else {
    // If login status is false, redirect to signin.html page
    loadSignInPage();
  }
}

// Fetch the URLs from the external API
function fetchURLs() {
  const cuisineUrl = "https://foodorder-api-elti.onrender.com/v1/cuisines";
  const categoryUrl = "https://foodorder-api-elti.onrender.com/v1/categories";
  const restaurantUrl = "https://foodorder-api-elti.onrender.com/v1/restaurants";

  return { cuisineUrl, categoryUrl, restaurantUrl };
}

// Get the list HTML elements to display cuisines, categories and restaurants
function loadListElements() {
  const cuisineList = document.getElementById("cuisine-list");
  const categoryList = document.getElementById("category-list");
  const restaurantList = document.getElementById("restaurant-list");

  return { cuisineList, categoryList, restaurantList };
}

// Fetch the data from the URLs
function fetchAndLoadData() {
  const { cuisineUrl, categoryUrl, restaurantUrl } = fetchURLs();

  // Fetch the list elements from index.html which will store cuisines, categories and restaurants data
  const { cuisineList, categoryList, restaurantList } = loadListElements();

  // Call the fetchData function to fetch the data from the above-mentioned endpoints
  fetchData(cuisineUrl, cuisineList);
  fetchData(categoryUrl, categoryList);
  fetchData(restaurantUrl, restaurantList);
}

// Load the signin.html page
function loadSignInPage() {
  window.location.href = "../html/signin.html";
}

// Function to fetch data from an external URL endpoint
async function fetchData(url, listElement) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    displayData(data, listElement);
  } catch (error) {
    console.error("Error fetching data:", error);
    listElement.innerHTML = "<li>Error loading data</li>";
  }
}

// Display data which is fetched from an external API
function displayData(data, listElement) {
  // Clear the list element
  listElement.innerHTML = "";

  // Assume data is either an array or an object with a data property
  const items = Array.isArray(data) ? data : data.data;

  // Traverse over the data objects and add the respective images and names
  items.forEach(item => {
    const li = document.createElement("li");

    // Create an image element if the item has an image property
    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.name || "Image";
      li.appendChild(img);
    }

    // Create a span to display the name
    const span = document.createElement("span");
    span.textContent = item.name || "No Name";
    li.appendChild(span);

    listElement.appendChild(li);
  });
}

// Logging out when clicked on the logout button
function logout() {
  // Remove login status from sessionStorage
  sessionStorage.removeItem("login");
  // Redirect to signin.html page
  window.location.href = "../html/signin.html";
}
