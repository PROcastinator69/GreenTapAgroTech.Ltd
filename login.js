const API = "http://localhost:5000"; // change this if needed

function showMessage(message, type = "error") {
  const msg = document.getElementById("message");
  msg.innerText = message;
  msg.className = `message ${type}`;
}

function clearMessage() {
  document.getElementById("message").innerText = "";
}

function validateInputs(mobile, password) {
  if (!mobile || !password) {
    showMessage("Please enter both mobile number and password.");
    return false;
  }

  if (!/^[0-9]{10}$/.test(mobile)) {
    showMessage("Enter a valid 10-digit mobile number.");
    return false;
  }

  if (password.length < 4) {
    showMessage("Password must be at least 4 characters.");
    return false;
  }

  return true;
}

function login() {
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!validateInputs(mobile, password)) return;

  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  })
  .then(res => res.json().then(data => ({ status: res.status, body: data })))
  .then(({ status, body }) => {
    if (status === 200) {
      showMessage("Login successful!", "success");
      setTimeout(() => loadMain(mobile), 1000);
    } else {
      showMessage(body.error || "Invalid login.");
    }
  })
  .catch(err => {
    console.error(err);
    showMessage("Server error. Please try again.");
  });
}

function signup() {
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!validateInputs(mobile, password)) return;

  fetch(`${API}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  })
  .then(res => res.json().then(data => ({ status: res.status, body: data })))
  .then(({ status, body }) => {
    if (status === 200) {
      showMessage("Signup successful! Please login.", "success");
    } else {
      showMessage(body.error || "Signup failed.");
    }
  })
  .catch(err => {
    console.error(err);
    showMessage("Server error. Try again.");
  });
}

function loadMain(mobile) {
  clearMessage();
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("main-section").style.display = "block";
  document.getElementById("welcome-text").innerText = `Welcome, ${mobile}`;

  fetch(`${API}/crops`)
    .then(res => res.json())
    .then(crops => {
      const list = document.getElementById("crop-list");
      list.innerHTML = "";
      crops.forEach(crop => {
        const item = document.createElement("li");
        item.innerHTML = `<b>${crop.name}</b> - Season: ${crop.season}<br/>${crop.description}`;
        list.appendChild(item);
      });
    })
    .catch(err => {
      console.error(err);
      showMessage("Failed to load crops.", "error");
    });
}

function logout() {
  document.getElementById("main-section").style.display = "none";
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("mobile").value = "";
  document.getElementById("password").value = "";
  clearMessage();
}
