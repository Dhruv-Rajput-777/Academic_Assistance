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
    if(prevPage.includes("/post/add")){
      return history.back();
    }
    return location.href = document.referrer || "/";
  }

  const data = await response.json();
  showError(data.message);
};

const showError = (message) => {
  const errorDiv = document.querySelector("#error");
  errorDiv.innerText = message;
};
