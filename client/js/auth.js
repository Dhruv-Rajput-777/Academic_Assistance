const loginUser = async (e) => {
  e.preventDefault();
  const username = document.forms["login-form"]["username"].value;
  const password = document.forms["login-form"]["password"].value;

  const response = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.status === 200) {
    const prevPage = document.referrer;
    if (prevPage.includes("/post/add")) {
      return history.back();
    }
    return (location.href = "/profile");
  }

  const data = await response.json();
  showError("failure", data.message);
};

const showError = (type, message) => {
  const errorDiv = document.querySelector("#error");
  errorDiv.innerText = message;
  if (type === "success") {
    if (errorDiv.classList.contains("text-red-400")) {
      errorDiv.classList.remove("text-red-400");
    }
    if (!errorDiv.classList.contains("text-green-400")) {
      errorDiv.classList.add("text-green-400");
    }
  } else {
    if (errorDiv.classList.contains("text-green-400")) {
      errorDiv.classList.remove("text-green-400");
    }
    if (!errorDiv.classList.contains("text-red-400")) {
      errorDiv.classList.add("text-red-400");
    }
  }
  if (errorDiv.classList.contains("hidden")) {
    errorDiv.classList.remove("hidden");
  }
};

const checkUsername = async (e) => {
  document.getElementById("signup-btn").disabled = true;
  const username = e.target.value;
  if (username.length < 4) {
    return showError("failure", "Username must be at least 4 characters");
  }
  if (username.length > 20) {
    return showError("failure", "Username must be less than 20 characters");
  }
  if (username.includes(" ")) {
    return showError("failure", "Username cannot contain spaces");
  }
  if (!username.match(/^[a-zA-Z0-9]+$/)) {
    return showError(
      "failure",
      "Username must only contain letters and numbers"
    );
  }
  const response = await fetch(`/auth/checkUsername?username=${username}`);
  const data = await response.json();
  if (response.status !== 200) {
    return showError("failure", data.message);
  }

  if (data.userExists) {
    return showError("failure", "Username already exists");
  } else {
    showError("success", "Username is available");
    return document.getElementById("signup-btn").disabled = false;
  }
};

window.onload = () => {
  document.getElementById("signup-btn").disabled = true;
};
