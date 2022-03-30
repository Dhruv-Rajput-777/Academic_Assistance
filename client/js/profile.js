const getUser = async () => {
  const response = await fetch("http://localhost:3000/auth/getUser");
  const user = await response.json();

  if (!user) {
    return location.href = "/auth/login";
  }

  displayUserInfo(user);
};

const displayUserInfo = (user) => {
  console.log(user);
};


window.onload = () => {
  getUser();
};
