// Filters
const getFilters = () => {
  const getAcademicYear = () => {
    const academicYearForm = document.forms["academic-year-form"];
    const academicYearFormValues = academicYearForm.elements;
    const academicYear = [];
    for (let i = 0; i < academicYearFormValues.length; i++) {
      if (academicYearFormValues[i].checked) {
        academicYear.push(parseInt(academicYearFormValues[i].value));
      }
    }
    return academicYear;
  };

  const getDepartment = () => {
    const departmentForm = document.forms["department-form"];
    const departmentFormValues = departmentForm.elements;
    const department = [];
    for (let i = 0; i < departmentFormValues.length; i++) {
      if (departmentFormValues[i].checked) {
        department.push(departmentFormValues[i].value);
      }
    }
    return department;
  };

  const getFileType = () => {
    const fileTypeForm = document.forms["file-type-form"];
    const fileTypeFormValues = fileTypeForm.elements;
    const fileType = [];
    for (let i = 0; i < fileTypeFormValues.length; i++) {
      if (fileTypeFormValues[i].checked) {
        fileType.push(fileTypeFormValues[i].value);
      }
    }
    return fileType;
  };

  const getAuthorType = () => {
    const authorTypeForm = document.forms["author-type-form"];
    const authorTypeFormValues = authorTypeForm.elements;
    const authorType = [];
    for (let i = 0; i < authorTypeFormValues.length; i++) {
      if (authorTypeFormValues[i].checked) {
        authorType.push(authorTypeFormValues[i].value);
      }
    }
    return authorType;
  };

  const academicYear = getAcademicYear();
  const department = getDepartment();
  const fileType = getFileType();
  const authorType = getAuthorType();

  return { academicYear, department, fileType, authorType };
};

const toggleFilterDisplay = (id) => {
  const currentDiv = document.getElementById(id);
  if (currentDiv.classList.contains("hidden")) {
    currentDiv.classList.remove("hidden");
  } else {
    currentDiv.classList.add("hidden");
  }
};

const getSortType = () => {
  const sortTypeBtns = document.querySelectorAll(".sort-type-btn");
  let activeBtnId;
  for (let btn of sortTypeBtns) {
    if (btn.classList.contains("active-btn")) {
      activeBtnId = btn.id;
      break;
    }
  }
  activeBtnId = activeBtnId.slice(10, activeBtnId.length);
  switch (activeBtnId) {
    case "upvote":
      return { upvoteCount: -1 };
    case "download":
      return { downloads: -1 };
    case "newest":
      return { timestamp: -1 };
    case "oldest":
      return { timestamp: 1 };
    default:
      return { upvoteCount: -1 };
  }
};

const getSearchTextType = () => {
  const searchTypeBtns = document.querySelectorAll(".search-type-btn");
  let activeBtnId;
  for (let btn of searchTypeBtns) {
    if (btn.classList.contains("active-btn")) {
      activeBtnId = btn.id;
      break;
    }
  }
  activeBtnId = activeBtnId.slice(12, activeBtnId.length);
  return activeBtnId;
};

const setActiveSortTypeBtn = (id) => {
  const sortTypeBtns = document.querySelectorAll(".sort-type-btn");
  for (let btn of sortTypeBtns) {
    if (btn.classList.contains("active-btn")) {
      btn.classList.remove("active-btn", "text-white", "bg-indigo-600");
      btn.classList.add("text-gray-700");
    }
  }
  const activeBtn = document.getElementById(id);
  activeBtn.classList.add("active-btn", "text-white", "bg-indigo-600");
  activeBtn.classList.remove("text-gray-700");
  toggleFilterDisplay("sort-type-form");
};

const setActiveSearchTypeBtn = (id) => {
  const searchTextTypeBtns = document.querySelectorAll(".search-type-btn");
  for (let btn of searchTextTypeBtns) {
    if (btn.classList.contains("active-btn")) {
      btn.classList.remove("active-btn", "text-white", "bg-indigo-600");
      btn.classList.add("text-gray-700");
    }
  }
  const activeBtn = document.getElementById(id);
  activeBtn.classList.add("active-btn", "text-white", "bg-indigo-600");
  activeBtn.classList.remove("text-gray-700");
  toggleFilterDisplay("search-type-form");
};

// paging

const checkPageNumber = () => {
  const pageNumber = getPageNumber();
  const totalPages = localStorage.getItem("totalPages");
  if (pageNumber == 1) {
    document.getElementById("prev-page-btn").classList.add("disable");
  } else {
    document.getElementById("prev-page-btn").classList.remove("disable");
  }
  if (pageNumber == totalPages) {
    document.getElementById("next-page-btn").classList.add("disable");
  } else {
    document.getElementById("next-page-btn").classList.remove("disable");
  }
};

const setPagination = () => {
  const totalPosts = localStorage.getItem("totalPosts");
  document.getElementById("total-posts").innerHTML = totalPosts;
  checkPageNumber();
};

const getPageNumber = () => {
  const pageNumber = document.getElementById("page-number");
  return parseInt(pageNumber.innerHTML);
};

const setPageNumber = (nos) => {
  const pageNumberDiv = document.getElementById("page-number");
  const pageNumber = getPageNumber();
  const totalPages = localStorage.getItem("totalPages");
  if (
    (pageNumber == 1 && nos == -1) ||
    (pageNumber == totalPages && nos == 1)
  ) {
    return;
  }
  pageNumberDiv.innerHTML = pageNumber + nos;
  checkPageNumber();
  getPosts();
};

// Suggestions

const selectSuggestion = (e) => {
  const selectedSuggestion = e.target.innerHTML;
  const searchText = document.getElementById("search-text");
  searchText.value = selectedSuggestion;
};

const showSuggestionsUtil = (suggestions) => {
  const suggestionBox = document.getElementById("suggestions");
  suggestionBox.replaceChildren();
  if (suggestions.length === 0) {
    let suggestionDiv = document.createElement("div");
    suggestionDiv.innerHTML = `<div class="text-red-500 block px-4 py-2 text-xs" role="menuitem" tabindex="-1">No results found</div>`;
    suggestionBox.appendChild(suggestionDiv);
  } else {
    for (let suggestion of suggestions) {
      let suggestionDiv = document.createElement("div");
      suggestionDiv.innerHTML = `<div class="text-gray-700 block px-4 py-2 text-xs cursor-pointer" role="menuitem" tabindex="-1" onclick="selectSuggestion(event)">${suggestion}</div>`;
      suggestionBox.appendChild(suggestionDiv);
    }
  }
  if (suggestionBox.classList.contains("hidden"))
    suggestionBox.classList.remove("hidden");
};

const showSuggestions = async () => {
  const searchText = document.getElementById("search-text").value.trim();
  if (searchText === "") return hideSuggestions();
  const searchTextType = getSearchTextType();

  const response = await fetch(
    `/api/suggestions/?searchText=${searchText}&searchTextType=${searchTextType}`
  );

  if (response.status !== 200) return;
  const suggestions = await response.json();
  showSuggestionsUtil(suggestions);
};

const hideSuggestions = () => {
  const suggestionBox = document.getElementById("suggestions");
  if (!suggestionBox.classList.contains("hidden"))
    suggestionBox.classList.add("hidden");
};

// posts

const getPosts = async () => {
  const searchText = document.getElementById("search-text").value.trim();
  const searchTextType = getSearchTextType();
  const sortType = getSortType();
  const filters = getFilters();
  const page = getPageNumber();
  const response = await fetch("/api/getPosts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      searchText,
      searchTextType,
      filters,
      sortType,
      page,
    }),
  });
  const posts = await response.json();
  if (response.status !== 200) {
    const postContainer = document.getElementById("post-container");
    postContainer.replaceChildren();
    postContainer.innerHTML = `<div class="font-md">No documents found!</div>`;
    localStorage.setItem("totalPages", 1);
    localStorage.setItem("totalPosts", 0);
    return;
  }
  localStorage.setItem("totalPages", posts.totalPages);
  localStorage.setItem("totalPosts", posts.totalPosts);
  showPosts(posts);
};

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

const showPosts = (data) => {
  setPagination();
  const { posts, totalPages, totalPosts } = data;
  const postContainer = document.getElementById("post-container");
  postContainer.replaceChildren();
  for (let post of posts) {
    const d = new Date(post.timestamp);

    const postDiv = document.createElement("div");
    postDiv.id = `post-${post.id}`;
    postDiv.classList.add("mr-8", "mb-8");
    postDiv.style.height = "15.5rem";
    postDiv.style.width = "12rem";

    postDiv.innerHTML = `
    <div class="group shadow-lg pt-3 pb-1 px-3 h-full w-full flex flex-col border border-gray-200 rounded-md ">
      <div class="file-type-img bg-indigo-600 py-3 rounded-md flex justify-center items-center">
        ${getIcon(post.filetype, post.id)}
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
    postContainer.appendChild(postDiv);
  }
};

window.onload = () => {
  getPosts();
};

window.onclick = (event) => {
  const suggestionBox = document.getElementById("suggestions");
  if (event.target !== suggestionBox) {
    hideSuggestions();
  }
};
