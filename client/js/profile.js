const getIcon = (filetype, postId) => {
  switch (filetype) {
    case "image/jpeg":
      return `<i class="fa-solid fa-image fa-7x cursor-pointer" onclick="location.href='/post/?postId=${postId}'"></i>`;
    case "image/png":
      return `<i class="fa-solid fa-image fa-7x cursor-pointer" onclick="location.href='/post/?postId=${postId}'"></i>`;
    case "application/pdf":
      return `<i class="fa-solid fa-file-pdf fa-7x cursor-pointer" style="color:#ff3333;" onclick="location.href='/post/?postId=${postId}'"></i>`;
    case "application/ppt":
      return `<i class="fa-solid fa-file-powerpoint fa-7x cursor-pointer" style="color:#ff3333;" onclick="location.href='/post/?postId=${postId}'"></i>`;
    default:
      return `<i class="fa-solid fa-file fa-7x cursor-pointer" onclick="location.href='/post/?postId=${postId}'"></i>`;
  }
};

const removeAlert = () => {
  const alertDiv = document.getElementById("alert-div");
  if (!alertDiv.classList.contains("hidden")) alertDiv.classList.add("hidden");
};

const showAlert = (type, message) => {
  const alertDiv = document.getElementById("alert-div");
  document.getElementById("alert-div-message").innerHTML = message;
  if (type === "success") {
    if (alertDiv.classList.contains("bg-red-400")) {
      alertDiv.classList.remove("bg-red-400");
    }
    alertDiv.classList.add("bg-green-400");
  } else {
    if (alertDiv.classList.contains("bg-green-400")) {
      alertDiv.classList.remove("bg-green-400");
    }
    alertDiv.classList.add("bg-red-400");
  }
  if (alertDiv.classList.contains("hidden"))
    alertDiv.classList.remove("hidden");
  setTimeout(removeAlert, 3000);
};

const deletePost = async (postId) => {
  const response = await fetch(`/profile/deletePost?postId=${postId}`);
  const data = await response.json();
  if (response.status !== 200) {
    return showAlert("error", data.msg);
  }

  document.getElementById(`post-${postId}`).remove();
  showAlert("success", data.msg);
};

const showUploadedPosts = async () => {
  const getUploadedPosts = async () => {
    const response = await fetch("/profile/getPosts");
    const posts = await response.json();
    return posts;
  };

  const posts = await getUploadedPosts();
  const rightContainer = document.getElementById("right-container");
  rightContainer.replaceChildren();

  for (let post of posts) {
    const d = new Date(post.timestamp);
    const postContainer = document.createElement("div");
    postContainer.id = `post-${post.id}`;
    postContainer.classList.add("group", "relative");
    postContainer.innerHTML = `<div class="file-type-img min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden p-5 relative group-hover:opacity-75 lg:h-80 lg:aspect-none flex justify-center">${getIcon(
      post.filetype,
      post.id
    )}
    <i class="fa-solid fa-xmark fa-lg absolute top-1 right-0 mr-3 cursor-pointer" onclick="deletePost('${
      post.id
    }')"></i>
    </div>
    <div class="mt-3 cursor-pointer" onclick="location.href='/post/?postId=${
      post.id
    }'">
        <h3 class="title text-sm font-medium text-gray-900">${post.title}</h3>
        <div class="flex justify-between mt-1 text-xs text-gray-700">Upload Date : ${d.getDate()}-${d.getMonth()}-${d.getFullYear()}
        </div>
    </div>
    `;
    rightContainer.appendChild(postContainer);
  }
};

const unsavePost = async (postId) => {
  const response = await fetch(`/profile/unsavePost?postId=${postId}`);
  const data = await response.json();
  if (response.status !== 200) {
    return showAlert("error", data.msg);
  }
  document.getElementById(`post-${postId}`).remove();
  showAlert("success", data.msg);
};

const showSavedPosts = async () => {
  const getSavedPosts = async () => {
    const response = await fetch("/profile/getSavedPosts");
    const posts = await response.json();
    return posts;
  };

  const posts = await getSavedPosts();
  const rightContainer = document.getElementById("right-container");
  rightContainer.replaceChildren();

  for (let post of posts) {
    const d = new Date(post.timestamp);
    const postContainer = document.createElement("div");
    postContainer.id = `post-${post.id}`;
    postContainer.classList.add("group", "relative");
    postContainer.innerHTML = `<div class="file-type-img min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden p-5 relative group-hover:opacity-75 lg:h-80 lg:aspect-none flex justify-center">${getIcon(
      post.filetype,
      post.id
    )}
    <i class="fa-regular fa-bookmark fa-lg absolute top-1 right-0 mr-3 cursor-pointer" onclick="unsavePost('${
      post.id
    }')"></i>
    </div>
    <div class="mt-3 cursor-pointer" onclick="location.href='/post/?postId=${
      post.id
    }'">
        <h3 class="title text-sm font-medium text-gray-900">${post.title}</h3>
        <div class="flex justify-between mt-1 text-xs text-gray-700">Upload Date : ${d.getDate()}-${d.getMonth()}-${d.getFullYear()}
        </div>
    </div>
    `;
    rightContainer.appendChild(postContainer);
  }
};

const setActiveBtn = (btnId) => {
  let prevActiveBtn = document.querySelector(".active-btn");

  if (prevActiveBtn) {
    prevActiveBtn.classList.remove(
      "active-btn",
      "border-r",
      "border-l",
      "bg-gray-200"
    );
    const prevActiveBtnId = prevActiveBtn.id;
    const prevInnerBtn = document.getElementById(prevActiveBtnId + "-btn");
    prevInnerBtn.classList.remove("bg-gray-200");
  }
  document.getElementById(btnId).classList.add("active-btn");
  setRightContainer();
};

const showSettings = () => {
  const rightContainer = document.getElementById("right-container");
}

const setRightContainer = () => {
  const activeBtn = document.querySelector(".active-btn");
  const btnId = activeBtn.id;

  const innerBtn = document.getElementById(btnId + "-btn");

  activeBtn.classList.add("border-r", "border-l", "bg-gray-200");
  innerBtn.classList.add("bg-gray-200");

  switch (btnId) {
    case "your-documents":
      return showUploadedPosts();
    case "saved-documents":
      return showSavedPosts();
    case "statistics":
      return showStatistics();
    case "settings":
      return showSettings();
  }
};

window.onload = () => {
  setRightContainer();
};
