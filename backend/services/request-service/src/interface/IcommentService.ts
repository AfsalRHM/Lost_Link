export default interface IcommentService {
  createComment({
    requestId,
    commentText,
    userId,
  }: {
    requestId: string;
    commentText: string;
    userId: string;
  }): Promise<any>;
  getRequestComments({
    requestId,
    commentCount,
  }: {
    requestId: string;
    commentCount: number;
  }): Promise<any>;
}
