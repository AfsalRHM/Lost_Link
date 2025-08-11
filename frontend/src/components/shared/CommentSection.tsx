import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { userService } from "../../services/userService";
import { adminService } from "../../services/adminService";

import { format } from "date-fns";
import { showErrorToast2 } from "../../utils/iziToastUtils";
import { MessageCircle, Send } from "lucide-react";
import { RootState } from "../../redux/store";
import UserErrorHandling from "../../middlewares/UserErrorHandling";

interface ICommentModel {
  _id?: string;
  user_id: string;
  user_info: {
    user_name: string;
    profile_pic: string;
  };
  content: string;
  createdAt: string;
  comment_likes: string[];
}

const CommentSection = ({
  requestId,
  noField,
  from,
}: {
  requestId: string | null | undefined;
  noField: boolean;
  from: string;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [comments, setComments] = useState<ICommentModel[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(0);

  const [commentOnScreenCount, setCommentOnScreenCount] = useState<number>(3);

  const { userId, userName, userProfile } = useSelector(
    (state: RootState) => state.userDetails
  );

  useEffect(() => {
    fetchComments(commentOnScreenCount);
  }, [commentOnScreenCount]);

  const fetchComments = async (count: number) => {
    setLoadingComments(true);
    try {
      if (requestId) {
        let response;
        if (from == "user") {
          response = await userService.getComments({ requestId, count });
        } else {
          response = await adminService.getComments({ requestId, count });
        }

        if (response.status === 200) {
          setComments(response.data.data.newCommentDatas);
          setCommentCount(response.data.data.totalCommentLength);
        } else {
          showErrorToast2(response.data.message);
        }
      } else {
        showErrorToast2("Request Id not found");
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLoadMore = () => {
    setCommentOnScreenCount((prev) => prev + 3);
  };

  // Function to submit a new comment
  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !requestId) return;

    try {
      setCommentText("");

      const response = await userService.createComment({
        requestId,
        commentText,
        userId,
      });
      if (response.status == 200) {
        setComments((prev) => [response.data.data, ...prev]);
        setCommentCount((prev) => prev + 1);
      } else {
        setCommentText(commentText);
        console.log(response, "this is the error response on createComment");
        UserErrorHandling(response, dispatch, navigate);
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      showErrorToast2("Something went wrong!");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="mt-10 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold text-violet-800 mb-6 flex items-center gap-2">
        <MessageCircle size={20} /> Comments ({commentCount})
      </h2>

      {noField ? null : (
        <div className="bg-violet-50 p-4 rounded-xl mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={userProfile}
                alt="Your profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://i.pravatar.cc/150?img=3";
                }}
              />
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-violet-800">{userName}</h4>
              <textarea
                className="w-full p-3 rounded-lg border border-violet-300 focus:border-violet-500 focus:ring focus:ring-violet-200 focus:ring-opacity-50 transition-all resize-none"
                rows={3}
                placeholder="Share information or ask a question..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-2">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                >
                  <Send size={16} /> Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {loadingComments ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
            <p className="mt-2 text-violet-600">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={comment.user_info.profile_pic}
                    alt={comment.user_info.user_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://i.pravatar.cc/150?img=8";
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-violet-800">
                        {comment.user_info.user_name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <MessageCircle size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">
              No comments yet.{" "}
              {noField ? null : "Be the first to share information!"}
            </p>
          </div>
        )}

        {comments.length < commentCount && (
          <div className="text-center mt-4">
            <button
              className="px-6 py-2 text-violet-600 hover:text-violet-800 border border-violet-300 rounded-full transition-all hover:bg-violet-50"
              onClick={handleLoadMore}
            >
              Load More Comments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
