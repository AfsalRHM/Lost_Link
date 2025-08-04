import IcommentModel from "../interface/IcommentModel";

const mergeUserAndComment = ({
  userDatas,
  commentDatas,
}: {
  userDatas: any;
  commentDatas: IcommentModel[];
}) => {
  const userMap =
    userDatas?.reduce((acc: any, user: any) => {
      acc[user._id] = {
        _id: user._id,
        name: user.user_name,
        profilePicture: user.profile_pic,
      };
      return acc;
    }, {}) || {};

  const newCommentDatas = commentDatas.map((comment: IcommentModel) => ({
    ...comment.toObject(),
    user_id: userMap[comment.user_id],
  }));

  return newCommentDatas;
};

export default mergeUserAndComment;
