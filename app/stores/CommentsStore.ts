import filter from "lodash/filter"
import orderBy from "lodash/orderBy";
import { action, computed } from "mobx";
import Comment from "~/models/Comment";
import RootStore from "./RootStore";
import Store from "./base/Store";

export default class CommentsStore extends Store<Comment> {
  constructor(rootStore: RootStore) {
    super(rootStore, Comment);
  }

  /**
   * Returns a list of comments in a document that are not replies to other
   * comments.
   *
   * @param documentId ID of the document to get comments for
   * @returns Array of comments
   */
  threadsInDocument(documentId: string): Comment[] {
    return this.filter(
      (comment: Comment) =>
        comment.documentId === documentId && !comment.parentCommentId
    );
  }

  /**
   * Returns a list of comments in a document that are not replies to other
   * comments.
   *
   * @param documentId ID of the document to get comments for
   * @returns Array of comments where isInPage is true
   */
  threadsInDocumentInpageOnly(documentId: string): Comment[] {
    return this.threadsInDocumentInpageOnly(documentId).filter(
      (comment: Comment) =>
        comment.documentId === documentId && !comment.parentCommentId
    );
  }

  /**
   * Returns a list of comments that are replies to the given comment.
   *
   * @param commentId ID of the comment to get replies for
   * @returns Array of comments
   */
  inThread(threadId: string): Comment[] {
    return this.filter(
      (comment: Comment) =>
        comment.parentCommentId === threadId || comment.id === threadId
    );
  }

  /**
   * Returns a list of comments that are replies to the given comment.
   *
   * @param commentId ID of the comment to get replies for
   * @returns Array of comments where isInPage is true
   */
  inThreadInpageOnly(threadId: string): Comment[] {
    return filter(
      this.orderedDataInpageOnly,
      (comment: Comment) =>
        comment.parentCommentId === threadId || comment.id === threadId
    );
  }

  @action
  setTyping({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }): void {
    const comment = this.get(commentId);
    if (comment) {
      comment.typingUsers.set(userId, new Date());
    }
  }

  @computed
  @filterInpageComment(false)
  get orderedData(): Comment[] {
    return orderBy(Array.from(this.data.values()), "createdAt", "asc");
  }

  @computed
  @filterInpageComment(true)
  get orderedDataInpageOnly(): Comment[] {
    return orderBy(Array.from(this.data.values()), "createdAt", "asc");
  }
}

function filterInpageComment(positive: boolean) {
  return (target: CommentsStore, propertyKey: string, descriptor: PropertyDescriptor) => {
    const filterFn = (comment: Comment) =>
      positive ? comment.isInpage : !comment.isInpage;
    if (descriptor.value) {
      const method = descriptor.value as () => Comment[];
      descriptor.value = function (...args: any[]) {
        return (method?.apply(this, args) as Comment[]).filter(filterFn);
      };
    } else if (descriptor.get) {
      const getter = descriptor.get as () => Comment[];
      descriptor.get = function () {
        return (getter?.call(this) as Comment[]).filter(filterFn);
      };
    }
  };
}
