import invariant from "invariant";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import { action, computed } from "mobx";
import Comment from "~/models/Comment";
import { client } from "~/utils/ApiClient";
import RootStore from "./RootStore";
import Store from "./base/Store";

export default class CommentsStore extends Store<Comment> {
  constructor(rootStore: RootStore) {
    super(rootStore, Comment);
  }

  /**
   * Returns a list of comments in a document.
   *
   * @param documentId ID of the document to get comments for
   * @returns Array of comments
   */
  inDocument(documentId: string): Comment[] {
    return this.filter((comment: Comment) => comment.documentId === documentId);
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
        comment.documentId === documentId &&
        !comment.parentCommentId &&
        (!comment.isNew ||
          comment.createdById === this.rootStore.auth.currentUserId)
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
        comment.documentId === documentId &&
        !comment.parentCommentId &&
        (!comment.isNew ||
          comment.createdById === this.rootStore.auth.currentUserId)
    );
  }

  /**
   * Returns a list of resolved comments in a document that are not replies to other
   * comments.
   *
   * @param documentId ID of the document to get comments for
   * @returns Array of comments
   */
  resolvedThreadsInDocument(documentId: string): Comment[] {
    return this.threadsInDocument(documentId).filter(
      (comment: Comment) => comment.isResolved === true
    );
  }

  /**
   * Returns a list of comments in a document that are not replies to other
   * comments.
   *
   * @param documentId ID of the document to get comments for
   * @returns Array of comments
   */
  unresolvedThreadsInDocument(documentId: string): Comment[] {
    return this.threadsInDocument(documentId).filter(
      (comment: Comment) => comment.isResolved !== true
    );
  }

  /**
   * Returns the total number of unresolbed comments in the given document.
   *
   * @param documentId ID of the document to get comments for
   * @returns A number of comments
   */
  unresolvedCommentsInDocumentCount(documentId: string): number {
    return this.unresolvedThreadsInDocument(documentId).reduce(
      (memo, thread) => memo + this.inThread(thread.id).length,
      0
    );
  }

  /**
   * Returns a list of comments that includes the given thread ID and any of it's replies.
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
   * Resolve a comment thread with the given ID.
   *
   * @param id ID of the comment to resolve
   * @returns Resolved comment
   */
  @action
  resolve = async (id: string): Promise<Comment> => {
    const res = await client.post("/comments.resolve", {
      id,
    });
    invariant(res?.data, "Comment not available");
    this.addPolicies(res.policies);
    this.add(res.data);
    return this.data.get(res.data.id) as Comment;
  };

  /**
   * Unresolve a comment thread with the given ID.
   *
   * @param id ID of the comment to unresolve
   * @returns Unresolved comment
   */
  @action
  unresolve = async (id: string): Promise<Comment> => {
    const res = await client.post("/comments.unresolve", {
      id,
    });
    invariant(res?.data, "Comment not available");
    this.addPolicies(res.policies);
    this.add(res.data);
    return this.data.get(res.data.id) as Comment;
  };

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
  return (
    _target: CommentsStore,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
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
