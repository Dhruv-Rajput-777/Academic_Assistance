const getUser = async () => {
  const response = await fetch("/auth/getUser");
  if (response.status !== 200) return null;
  const user = await response.json();
  return user;
};

const addPost = async (e) => {
  e.preventDefault();

  const form = document.forms["add-post-form"];
  const userId = await getUser();

  if (!userId) {
    return (location.href = "/auth/login");
  }

  let post = new FormData();
  post.append("userId", userId);
  post.append("title", form["title"].value);
  post.append("description", form["description"].value);
  post.append("file", form["file"].files[0]);
  post.append("author", form["author"].value);
  post.append("authorType", form["author-type"].value);
  post.append("fileType", form["file-type"].value);
  post.append("academicYear", form["academic-year"].value);
  post.append("subject", form["subject"].value);
  post.append("department", form["department"].value);

  if (!post.get("title") || !post.get("file")) {
    return showModal(
      "failure",
      "Error while Adding Post ! Please try again.",
      "Please make sure that the following fields are filled.<br/><ul><h4><b>TITLE</b></h4><h4><b>FILE</b></h4></ul>"
    );
  }
  showModal(
    "success",
    "Adding Post...",
    `<div class="flex"><div class="loader"></div> <p>&nbsp;&nbsp;Please wait while we add your post.</p></div>`
  );
  const response = await fetch("/post/add", {
    method: "POST",
    body: post,
  });

  const data = await response.json();
  hideModal();
  if (response.status !== 200) {
    return showModal(
      "failure",
      "Error while Adding Post ! Please try again.",
      `The following error occured while adding your post </br> ${data.err.message}`
    );
  }

  showModal(
    "success",
    "Post added Successfully !",
    `<a href="/post?postId=${data.postId}">View Post</a>`
  );
};

const showModal = (status, title, body) => {
  const modalImageBg = document.getElementById("modal-img-bg");
  const modalImage = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");

  if (modalImage.classList.contains("text-red-600")) {
    modalImage.classList.remove("text-red-600");
  }
  if (modalImage.classList.contains("text-green-600")) {
    modalImage.classList.remove("text-green-600");
  }
  if (modalImageBg.classList.contains("bg-red-100")) {
    modalImageBg.classList.remove("bg-red-100");
  }
  if (modalImageBg.classList.contains("bg-green-100")) {
    modalImageBg.classList.remove("bg-green-100");
  }

  modalImage.classList.add(
    status === "success" ? "text-green-600" : "text-red-600"
  );
  modalImageBg.classList.add(
    status === "success" ? "bg-green-100" : "bg-red-100"
  );
  modalTitle.innerHTML = title;
  modalBody.innerHTML = body;

  const modal = document.getElementById("err-modal");
  modal.style.display = "block";
};

const hideModal = () => {
  const modal = document.getElementById("err-modal");
  modal.style.display = "none";
};

// to display name of uploaded file
const setFileName = () => {
  let files = document.querySelector("#file").files;
  if (files.length > 0) {
    document.querySelector("#file-name").innerText =
      document.querySelector("#file").files[0].name;
  } else {
    document.querySelector("#file-name").innerText =
      "No files selected (Max size: 10MB)";
  }
};
setFileName();

document.querySelector("#file").onchange = function () {
  document.querySelector("#file-name").textContent = this.files[0].name;
};
