import mongoose from "mongoose";
const PostSchema = new mongoose.Schema({
  userId: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  photo: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length <= 3;
      },
      message: "You can upload a maximum of 3 photos.",
    },
    default: [
      "https://lirp.cdn-website.com/efc89e53/dms3rep/multi/opt/the-history-of-merry-go-rounds-1920w.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmPvHSu9aTzpOHhBVgSE-ox17iECmbZ3SyfQ&s",
      "https://m.media-amazon.com/images/M/MV5BMGQ1ZGZmNTAtM2MyYi00NmZhLTkwYmYtNTNlZDRhMzU2ZTgwXkEyXkFqcGdeQW1yb3NzZXI@._V1_.jpg",
    ],
  },
});
const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;
