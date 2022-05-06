// alerts

const removeAlert = () => {
  const alertDiv = document.getElementById("alert-div");
  if (!alertDiv.classList.contains("hidden")) alertDiv.classList.add("hidden");
};

const showAlert = (type, message) => {
  const alertDiv = document.getElementById("alert-div");
  document.getElementById("alert-div-message").innerHTML = message;
  if (type === "success") {
    document.getElementById(
      "alert-icon"
    ).innerHTML = `<i class="fa-regular fa-circle-check fa-lg text-white"></i>`;
    if (alertDiv.classList.contains("bg-red-400")) {
      alertDiv.classList.remove("bg-red-400");
    }
    alertDiv.classList.add("bg-green-400");
  } else {
    document.getElementById(
      "alert-icon"
    ).innerHTML = `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>`;
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
    if (response.status !== 200) return [];
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
    if (response.status !== 200) return [];
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

const getOverallStatistics = (upvotes, downvotes, downloads) => {
  return `
  <div class="flex w-full py-2 align-center justify-evenly">

  <div class="bg-white border border-gray-200 rounded-lg shadow-lg my-5 flex flex-col items-center"
      style="height:16rem; width:14rem;">

      <div class="shadow-xl border-8 border-green-600 mt-8 mb-4 flex flex-col align-center justify-center"
          style="width: 9rem; height: 9rem; border-radius: 50%;">
          <span class="text-4xl font-semibold mx-auto mb-2">${upvotes}</span>
          <i class="fa-solid fa-caret-up w-fit fa-lg mx-auto"></i>
      </div>

      <div class="text-sm font-medium">UPVOTES</div>

  </div>

  <div class="bg-white border border-gray-200 rounded-lg shadow-lg my-5 flex flex-col items-center"
      style="height:16rem; width:14rem;">

      <div class="shadow-xl border-8 border-red-600 mt-8 mb-4 flex flex-col align-center justify-center"
          style="width: 9rem; height: 9rem; border-radius: 50%;">
          <span class="text-4xl font-semibold mx-auto mb-2">${downvotes}</span>
          <i class="fa-solid fa-caret-down w-fit fa-lg mx-auto"></i>
      </div>

      <div class="text-sm font-medium">DOWNVOTES</div>

  </div>

  <div class="bg-white border border-gray-200 rounded-lg shadow-lg my-5 flex flex-col items-center"
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

const getIndividualStatistics = (posts) => {
  const getIndividualStatisticsUtil = (posts) => {
    let html = "";
    for (let post of posts) {
      html += `
      <div class="w-full flex my-2 text-center justify-between px-5 py-2 border border-gray-200 shadow-md rounded-lg"
      style="height: 6rem;">
      <div class="my-auto text-md font-medium">${post.title}</div>
      <div class="flex text-center my-auto">
          <div class="flex items-center mr-6">
              <p class="mr-2 text-md font-medium">${post.upvotes}</p>
              <i class="fa-solid fa-caret-up w-fit fa-lg mt-1 text-green-600"></i>
          </div>
          <div class="flex items-center mr-6">
              <p class="mr-2 text-md font-medium">${post.downvotes}</p>
              <i class="fa-solid fa-caret-down w-fit fa-lg text-red-600"></i>
          </div>
          <div class="flex items-center">
              <p class="mr-2 text-md font-medium">${post.downloads}</p>
              <i
                  class="fa-solid fa-angle-down w-fit fa-lg text-indigo-600"></i>
          </div>
      </div>
    </div>
  `;
    }
    return html;
  };

  return `
  <div class="flex w-full flex-col py-2 px-4 align-center">
    ${getIndividualStatisticsUtil(posts)}
  </div>
`;
};

const showStatistics = async () => {
  const getStatistics = async () => {
    const response = await fetch("/profile/getStatistics");
    if (response.status !== 200)
      return {
        upvotes: 0,
        downvotes: 0,
        downloads: 0,
        posts: [],
      };
    const statistics = await response.json();
    return statistics;
  };

  const rightContainer = document.getElementById("right-container");
  rightContainer.replaceChildren();

  const { upvotes, downvotes, downloads, posts } = await getStatistics();

  rightContainer.innerHTML =
    getOverallStatistics(upvotes, downvotes, downloads) +
    getIndividualStatistics(posts);
};

// settings

const showSettings = () => {
  const rightContainer = document.getElementById("right-container");
  rightContainer.replaceChildren();

  rightContainer.innerHTML = `
  <div class="flex flex-col">
  <h2 class="font-bold mt-1 mb-4">Change Password</h2>

  <form id="change-password-form" class="">

      <div class="flex flex-col" style="width: 25rem;">
          <div class="mb-6 flex flex-col w-full">
              <div class="flex items-center justify-between w-full">
                  <label for="old-password"
                      class="block text-sm mr-3 font-medium text-gray-700">
                      Old Password </label>
                  <div class="flex rounded-md shadow-sm">

                      <input type="password" name="oldPassword"
                          id="old-password"
                          class="border border-gray-200 rounded-md shadow-md flex-1 p-2 block w-full rounded-none rounded-r-md sm:text-sm focus:outline-none"
                          placeholder="Old Password" required>
                  </div>
              </div>
          </div>

          <div class="mb-6 flex flex-col w-full">
              <div class="flex items-center justify-between w-full">
                  <label for="new-password"
                      class="block text-sm mr-3 font-medium text-gray-700">
                      New Password </label>
                  <div class="flex rounded-md shadow-sm">

                      <input type="password" name="newPassword"
                          id="new-password"
                          class="border border-gray-200 rounded-md shadow-md flex-1 p-2 block w-full rounded-none rounded-r-md sm:text-sm focus:outline-none"
                          placeholder="New Password" required>
                  </div>
              </div>
          </div>

          <div class="mb-6 flex flex-col w-full">
              <div class="flex items-center justify-between w-full">
                  <label for="confirm-new-password"
                      class="block text-sm mr-3 font-medium text-gray-700">
                      Confirm New Password </label>
                  <div class="flex rounded-md shadow-sm">

                      <input type="password" name="confirmPassword"
                          id="confirm-new-password"
                          class="border border-gray-200 rounded-md shadow-md flex-1 p-2 block w-full rounded-none rounded-r-md sm:text-sm focus:outline-none"
                          placeholder="Confirm New Password" required>
                  </div>
              </div>
          </div>


      </div>
      <div class="bg-gray-50">
          <button type="submit" onclick="changePassword(event)"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Change
              Password</button>
      </div>
  </form>
</div>
  `;
};

const changePassword = async (e) => {
  e.preventDefault();
  const form = document.forms["change-password-form"];
  const oldPassword = form.oldPassword.value;
  const newPassword = form.newPassword.value;
  const confirmPassword = form.confirmPassword.value;

  if (newPassword !== confirmPassword) {
    return showAlert("failure", "Passwords do not match");
  }

  const response = await fetch("/profile/changePassword", {
    method: "POST",
    body: JSON.stringify({ oldPassword, newPassword }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (response.status !== 200) {
    return showAlert("failure", data.msg);
  } else {
    form.reset();
    return showAlert("success", data.msg);
  }
};

// onload

window.onload = () => {
  setRightContainer();
};
