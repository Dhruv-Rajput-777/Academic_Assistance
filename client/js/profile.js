const getUser = async () => {
  const userObj = await fetch("http://localhost:3000/profile/getUser");
  const user = await userObj.json();

  if (!user) {
    return alert("Please login first!");
  }

  displayUserInfo(user);
};

const displayUserInfo = (user) => {
  console.log(user);
};


window.onload(getUser());
