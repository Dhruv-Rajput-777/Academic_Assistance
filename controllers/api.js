const Post = require("../models/post");

const getSuggestions = async (req, res) => {
  const { searchText, searchTextType } = req.query;

  try {
    let suggestions = await Post.find({
      [searchTextType]: { $regex: searchText, $options: "i" },
    }).sort({ upvoteCount: -1, timestamp: -1 });

    suggestions = suggestions.map((suggestion) => {
      return suggestion[searchTextType];
    });

    suggestions = suggestions.filter(
      (item, index, arr) => arr.indexOf(item) === index
    );

    return res.send(suggestions.splice(0, 5));
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

const getPosts = async (req, res) => {
  const { searchText, searchTextType, filters, page, sortType } = req.body;
  const limit = 8;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find({
      $and: [
        { [searchTextType]: { $regex: searchText, $options: "i" } },
        {
          academicYear: { $in: filters.academicYear },
        },
        {
          department: { $in: filters.department },
        },
        {
          fileType: { $in: filters.fileType },
        },
        {
          authorType: { $in: filters.authorType },
        },
      ],
    })
      .limit(limit)
      .skip(skip)
      .sort(sortType);

    let updatedPosts = [];
    for (let post of posts) {
      updatedPosts.push({
        id: post.id,
        title: post.title,
        description: post.description,
        timestamp: post.timestamp,
        filetype: post.file.mimetype,
      });
    }

    const countPosts = await Post.find({
      $and: [
        { [searchTextType]: { $regex: searchText, $options: "i" } },
        {
          academicYear: { $in: filters.academicYear },
        },
        {
          department: { $in: filters.department },
        },
        {
          fileType: { $in: filters.fileType },
        },
        {
          authorType: { $in: filters.authorType },
        },
      ],
    });

    const totalPosts = countPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    return res.send({ posts: updatedPosts, totalPages, totalPosts });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

module.exports = { getSuggestions, getPosts };
