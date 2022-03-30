var post = {};

window.onload = async () => {
  const postData = await getPost();
  if (!postData)
    return showErrModal(
      "No post found!",
      "The post you're looking for does not exist."
    );
  post = postData;
  showPost(postData);
};

const getUser = async () => {
  const response = await fetch("/auth/getUser");
  if (response.status !== 200) {
    return null;
  }
  const user = await response.json();
  return user;
};

const getPost = async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("postId");

  const response = await fetch(`/post/getPost?postId=${postId}`);

  if (response.status !== 200) {
    return null;
  }
  const data = await response.json();
  return data;
};

const showModal = () => {
  console.log("No post found!");
};

const showPost = () => {
  document.getElementById("title").innerText = post.title;
  document.getElementById("sub-title").innerText = "Type : " + post.fileType;
  document.getElementById("subject").innerText = post.subject;
  document.getElementById("author").innerText =
    post.author + ` [${post.authorType}]`;
  document.getElementById("description").innerText = post.description;

  let d = new Date(post.timestamp);
  document.getElementById(
    "date"
  ).innerText = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;

  setSaveBtn();
  setVotedBtn(null);

  document.getElementById("file-name").innerText = post.filename;
};

const downloadFile = () => {
  const postId = post._id;
  post.downloads++;
  setVotedBtn();
  let a = document.createElement("a");
  a.href = `/post/getFile?postId=${postId}`;
  a.target = "_blank";
  a.click();
};

const savePost = async () => {
  const user = await getUser();
  if (!user) {
    return (location.href = "/auth/login");
  }

  let postId = post._id,
    isSaved = post.isSaved;

  let res = await fetch(`/post/savePost/?postId=${postId}&isSaved=${isSaved}`);
  if (res.status === 200) {
    post.isSaved = !isSaved;
    setSaveBtn();
  } else {
    showErrModal(
      "Failed to Save Post",
      "An error occured while saving the post. Please try again later."
    );
  }
};

const setSaveBtn = () => {
  document.getElementById("save-btn").innerHTML = post.isSaved
    ? '<i onclick="savePost()" class="fa-solid fa-bookmark fa-2x cursor-pointer"></i>'
    : '<i onclick="savePost()" class="fa-regular fa-bookmark fa-2x cursor-pointer"></i>';
};

const setVotedBtn = () => {
  document.getElementById("upvote-btn").innerText = `${post.upvotes} Upvotes`;
  document.getElementById(
    "downvote-btn"
  ).innerText = `${post.downvotes} Downvotes`;
  document.getElementById(
    "download-btn"
  ).innerText = `${post.downloads} Downloads`;

  if (post.isVoted) {
    if (post.isVoted === "upvoted") btnId = "upvote-btn";
    else btnId = "downvote-btn";
    let btnText = document.getElementById(btnId).innerHTML;
    btnText = btnText.concat("&nbsp;<i class='fa-solid fa-circle-check'></i>");
    document.getElementById(btnId).innerHTML = btnText;
  }
};

const upvotePost = async () => {
  let user = await getUser();
  if (!user) {
    return (location.href = "/auth/login");
  }

  let postId = post._id;
  const response = await fetch(
    `/post/upvotePost/?postId=${postId}&isSaved=${post.isSaved}`
  );

  if (response.status !== 200) {
    return showErrModal(
      "Failed to Upvote Post",
      "An error occured while upvoting the post. Please try again later."
    );
  }

  const votes = await response.json();
  post.upvotes += votes.upvotes;
  post.downvotes += votes.downvotes;
  post.isVoted = "upvoted";
  setVotedBtn(null);
};

const downvotePost = async () => {
  let user = await getUser();
  if (!user) {
    return (location.href = "/auth/login");
  }
  let postId = post._id;
  const response = await fetch(
    `/post/downvotePost/?postId=${postId}&isSaved=${post.isSaved}`
  );

  if (response.status !== 200) {
    return showErrModal(
      "Failed to Downvote Post",
      "An error occured while Downvoting the post. Please try again later."
    );
  }

  const votes = await response.json();
  post.upvotes += votes.upvotes;
  post.downvotes += votes.downvotes;
  post.isVoted = "downvoted";
  setVotedBtn(null);
};

// button events

document.getElementById("upvote-btn").onmouseover = () => {
  document.getElementById("upvote-btn").innerText = "Upvote";
};
document.getElementById("upvote-btn").onmouseout = () => {
  setVotedBtn();
};

document.getElementById("downvote-btn").onmouseover = () => {
  document.getElementById("downvote-btn").innerText = "Downvote";
};
document.getElementById("downvote-btn").onmouseout = () => {
  setVotedBtn();
};

document.getElementById("download-btn").onmouseover = () => {
  document.getElementById("download-btn").innerText = "Download";
};
document.getElementById("download-btn").onmouseout = () => {
  setVotedBtn();
};

// err modal
const showErrModal = (title, body) => {
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
 
  modalTitle.innerHTML = title;
  modalBody.innerHTML = body;

  const modal = document.getElementById("err-modal");
  modal.style.display = "block";
};

const hideModal = () => {
  const modal = document.getElementById("err-modal");
  modal.style.display = "none";
};
