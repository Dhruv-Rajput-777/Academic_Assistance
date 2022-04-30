// alerts

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

const hideModal = () => {
  const modal = document.getElementById("confirmation-modal");
  if (!modal.classList.contains("hidden")) modal.classList.add("hidden");
};

const showModal = () => {
  const modal = document.getElementById("confirmation-modal");
  if (modal.classList.contains("hidden")) modal.classList.remove("hidden");
};

// post functions

var neverAskAgain = false;
const setNeverAskAgain = () => {
  neverAskAgain = !neverAskAgain;
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

const deletePostUtil = (postId) => {
  if (neverAskAgain) {
    hideModal();
    return deletePost(postId);
  }
  showModal();
  document.getElementById("confirm-delete-btn").onclick = () => {
    hideModal();
    return deletePost(postId);
  };
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

// post utils

const getIcon = (filetype, postId) => {
  switch (filetype) {
    case "image/jpeg":
      return `<i class="fa-solid fa-image fa-5x cursor-pointer text-white" onclick="location.href='/post/?postId=${postId}'"></i>`;
    case "image/png":
      return `<i class="fa-solid fa-image fa-5x cursor-pointer text-white" onclick="location.href='/post/?postId=${postId}'"></i>`;
    case "application/pdf":
      return `<i class="fa-solid fa-file-pdf fa-5x cursor-pointer text-white" onclick="location.href='/post/?postId=${postId}'"></i>`;
    case "application/ppt":
      return `<i class="fa-solid fa-file-powerpoint fa-5x cursor-pointer text-white" onclick="location.href='/post/?postId=${postId}'"></i>`;
    case "application/octet-stream":
      return `<i class="fa-solid fa-file-code fa-5x cursor-pointer text-white" onclick="location.href='/post/?postId=${postId}'"></i>`;
    default:
      return `<i class="fa-solid fa-file-lines fa-5x cursor-pointer text-white" onclick="location.href='/post/?postId=${postId}'"></i>`;
  }
};

const modifyPostTitle = (title) => {
  const maxLength = 40;
  if (title.length > maxLength) {
    return title.substring(0, maxLength) + "...";
  }
  return title;
};

const modifyPostDescription = (description) => {
  const maxLength = 50;
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + "...";
  }
  return description;
};

// show posts

const showUploadedPosts = async () => {
  const getUploadedPosts = async () => {
    const response = await fetch("/profile/getPosts");
    if(response.status !== 200) return [];
    const posts = await response.json();
    return posts;
  };

  const posts = await getUploadedPosts();
  const rightContainer = document.getElementById("right-container");
  rightContainer.replaceChildren();
  
  if (posts.length === 0) {
    return (rightContainer.innerHTML = `<div class="flex flex-col items-center justify-center">
  <h3 class="text-red-600 text-sm text-center">No posts found</h3>
  </div>`);
  }

  for (let post of posts) {
    const d = new Date(post.timestamp);

    const postDiv = document.createElement("div");
    postDiv.id = `post-${post.id}`;
    postDiv.classList.add("mr-8", "mb-8");
    postDiv.style.height = "15.5rem";
    postDiv.style.width = "12rem";

    postDiv.innerHTML = `
    <div class="group shadow-lg pt-3 pb-1 px-3 h-full w-full flex flex-col border border-gray-200 rounded-md ">
      <div class="relative file-type-img bg-indigo-600 py-3 rounded-md flex justify-center items-center">
        ${getIcon(post.filetype, post.id)}
        <i class="fa-solid fa-xmark absolute text-white top-0 right-0 mr-2 mt-2 cursor-pointer" onclick="deletePostUtil('${
          post.id
        }')"></i>
      </div>

      <div class="mt-3 cursor-pointer flex flex-col justify-between" style="flex-grow:1;">
        <div>
            <h3 class="title text-sm font-medium text-gray-900" onclick="location.href='/post/?postId=${
              post.id
            }'">
              ${modifyPostTitle(post.title)}
            </h3>

            <div class="flex justify-between mt-1 text-xs text-gray-700">
                ${modifyPostDescription(post.description)}
            </div>
        </div>

        <div>
            <hr class="my-1" />
            <div class="flex justify-end font-medium text-xs text-gray-700">
                <div> ${d.getDate()}-${d.getMonth()}-${d.getFullYear()}</div>
            </div>
        </div>

    </div>

</div>
`;
    rightContainer.appendChild(postDiv);
  }
};

const showSavedPosts = async () => {
  const getSavedPosts = async () => {
    const response = await fetch("/profile/getSavedPosts");
    if(response.status !== 200) return [];
    const posts = await response.json();
    return posts;
  };

  const posts = await getSavedPosts();
  const rightContainer = document.getElementById("right-container");
  rightContainer.replaceChildren();

  if (posts.length === 0) {
    return (rightContainer.innerHTML = `<div class="flex flex-col items-center justify-center">
  <h3 class="text-red-600 text-sm text-center">No posts found</h3>
  </div>`);
  }
  
  for (let post of posts) {
    const d = new Date(post.timestamp);

    const postDiv = document.createElement("div");
    postDiv.id = `post-${post.id}`;
    postDiv.classList.add("mr-8", "mb-8");
    postDiv.style.height = "15.5rem";
    postDiv.style.width = "12rem";

    postDiv.innerHTML = `
    <div class="group shadow-lg pt-3 pb-1 px-3 h-full w-full flex flex-col border border-gray-200 rounded-md ">
      <div class="relative file-type-img bg-indigo-600 py-3 rounded-md flex justify-center items-center">
        ${getIcon(post.filetype, post.id)}
        <i class="fa-solid fa-bookmark absolute text-white top-0 right-0 mr-2 mt-2 cursor-pointer" onclick="unsavePost('${
          post.id
        }')"></i>
      </div>

      <div class="mt-3 cursor-pointer flex flex-col justify-between" style="flex-grow:1;">
        <div>
            <h3 class="title text-sm font-medium text-gray-900" onclick="location.href='/post/?postId=${
              post.id
            }'">
              ${modifyPostTitle(post.title)}
            </h3>

            <div class="flex justify-between mt-1 text-xs text-gray-700">
                ${modifyPostDescription(post.description)}
            </div>
        </div>

        <div>
            <hr class="my-1" />
            <div class="flex justify-end font-medium text-xs text-gray-700">
                <div> ${d.getDate()}-${
      d.getMonth() + 1
    }-${d.getFullYear()}</div>
            </div>
        </div>

    </div>

</div>
`;
    rightContainer.appendChild(postDiv);
  }
};

// set up right container

const setActiveBtn = (btnId) => {
  let prevActiveBtn = document.querySelector(".active-btn");

  if (prevActiveBtn) {
    prevActiveBtn.classList.remove("bg-indigo-600", "text-white", "active-btn");
    const prevActiveBtnId = prevActiveBtn.id;
    const prevInnerBtn = document.getElementById(prevActiveBtnId + "-btn");
    prevInnerBtn.classList.remove("bg-indigo-600", "text-white");
    prevInnerBtn.classList.add("text-gray-900");
  }
  document.getElementById(btnId).classList.add("active-btn");
  setRightContainer();
};

const setRightContainer = () => {
  const activeBtn = document.querySelector(".active-btn");
  const btnId = activeBtn.id;
  const innerBtn = document.getElementById(btnId + "-btn");

  activeBtn.classList.add("bg-indigo-600", "text-white");
  innerBtn.classList.remove("text-gray-900");
  innerBtn.classList.add("bg-indigo-600", "text-white");

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

// stats and settings

const showStatistics = async () => {
  
  const getStatistics = async () => {
    const response = await fetch("/profile/getStatistics");
    if(response.status !== 200) return {upvotes : 0, downvotes : 0, downloads : 0};
    const statistics = await response.json();
    return statistics;
  }
  
  const rightContainer = document.getElementById("right-container");
  rightContainer.replaceChildren();

  const {upvotes, downvotes, downloads} = await getStatistics();
  console.log(upvotes, downvotes, downloads);
  rightContainer.innerHTML = `
  <div class="flex w-full py-2 align-center justify-evenly">

  <div class="bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col items-center"
      style="height:16rem; width:14rem;">

      <div class="shadow-xl border-8 border-green-600 mt-8 mb-4 flex flex-col align-center justify-center"
          style="width: 9rem; height: 9rem; border-radius: 50%;">
          <span class="text-4xl font-semibold mx-auto mb-2">${upvotes}</span>
          <i class="fa-solid fa-caret-up w-fit fa-lg mx-auto"></i>
      </div>

      <div class="text-sm font-medium">UPVOTES</div>

  </div>

  <div class="bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col items-center"
      style="height:16rem; width:14rem;">

      <div class="shadow-xl border-8 border-red-600 mt-8 mb-4 flex flex-col align-center justify-center"
          style="width: 9rem; height: 9rem; border-radius: 50%;">
          <span class="text-4xl font-semibold mx-auto mb-2">${downvotes}</span>
          <i class="fa-solid fa-caret-down w-fit fa-lg mx-auto"></i>
      </div>

      <div class="text-sm font-medium">DOWNVOTES</div>

  </div>

  <div class="bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col items-center"
      style="height:16rem; width:14rem;">

      <div class="shadow-xl border-8 border-indigo-600 mt-8 mb-4 flex flex-col align-center justify-center"
          style="width: 9rem; height: 9rem; border-radius: 50%;">
          <span class="text-4xl font-semibold mx-auto mb-2">${downloads}</span>
          <i class="fa-solid fa-angle-down w-fit fa-lg mx-auto"></i>
      </div>

      <div class="text-sm font-medium">DOWNLOADS</div>

  </div>
  
</div>
  `;
};

const showSettings = () => {};

// onload

window.onload = () => {
  setRightContainer();
};
