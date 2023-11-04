import { throttle } from "lodash";
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import InpageThread from "@shared/editor/nodes/InpageThread";
import { ComponentProps } from "@shared/editor/types";
import CommentForm from "~/scenes/Document/components/CommentForm";
import { Reply, Thread } from "~/scenes/Document/components/CommentThread";
import CommentThreadItem from "~/scenes/Document/components/CommentThreadItem";
import Avatar from "~/components/Avatar";
import Fade from "~/components/Fade";
import Flex from "~/components/Flex";
import { ResizingHeightContainer } from "~/components/ResizingHeightContainer";
import Typing from "~/components/Typing";
import { WebsocketContext } from "~/components/WebsocketProvider";
import useCurrentUser from "~/hooks/useCurrentUser";
import useOnClickOutside from "~/hooks/useOnClickOutside";
import usePolicy from "~/hooks/usePolicy";
import useStores from "~/hooks/useStores";

// eslint-disable-next-line react/display-name
InpageThread.prototype.component = function InpageThreadComponent(
  props: ComponentProps
) {
  const { node } = props;
  const { comments, documents } = useStores();
  const user = useCurrentUser();
  const { t } = useTranslation();
  const match = useRouteMatch<{ documentSlug: string }>();
  const document = documents.getByUrl(match.params.documentSlug)!;

  const can = usePolicy(document.id);
  const [thread, setThread] = useState(comments.get(node.attrs.id));
  const fetchThread = async () => {
    const data = comments.get(node.attrs.id);
    setThread(data);
    if (data) {
      return;
    }
    await comments
      .create({
        id: node.attrs.id,
        documentId: document.id,
        data: node,
        isInpage: true,
      })
      .then((data) => setThread(data))
      .catch();
  };
  useEffect(() => {
    if (thread) {
      return;
    }
    fetchThread();
  }, [fetchThread]);

  const socket = useContext(WebsocketContext);
  const setIsTyping = useMemo(
    () =>
      throttle(() => {
        if (!thread) {
          return;
        }
        socket?.emit("typing", {
          documentId: document.id,
          commentId: thread.id,
        });
      }, 500),
    [socket, document.id, thread]
  );

  const [focused, setFocused] = useState(thread?.isNew ?? false);

  const topRef = React.useRef<HTMLDivElement>(node.attrs.id);
  useOnClickOutside(topRef, (event) => {
    if (focused) {
      setFocused(false);
    }
  });

  if (!thread) {
    return <div>no comments available</div>;
  }

  const commentsInThread = comments
    .inThreadInpageOnly(thread?.id ?? "")
    .filter((comment) => !comment.isNew && comment.parentCommentId);

  return (
    <Thread
      ref={topRef}
      $focused={focused}
      $recessed={false}
      $dir={document.dir}
    >
      {commentsInThread.map((comment, index) => {
        const firstOfAuthor =
          index === 0 ||
          comment.createdById !== commentsInThread[index - 1].createdById;
        const lastOfAuthor =
          index === commentsInThread.length - 1 ||
          comment.createdById !== commentsInThread[index + 1].createdById;

        return (
          <CommentThreadItem
            comment={comment}
            key={comment.id}
            firstOfThread={index === 0}
            lastOfThread={index === commentsInThread.length - 1}
            canReply={focused && can.comment}
            firstOfAuthor={firstOfAuthor}
            lastOfAuthor={lastOfAuthor}
            previousCommentCreatedAt={commentsInThread[index - 1]?.createdAt}
            dir={document.dir}
          />
        );
      })}

      {thread.currentlyTypingUsers
        .filter((typing) => typing.id !== user.id)
        .map((typing) => (
          <Flex gap={8} key={typing.id}>
            <Avatar model={typing} size={24} />
            <Typing />
          </Flex>
        ))}
      <ResizingHeightContainer hideOverflow={false}>
        {(focused || commentsInThread.length === 0) && can.comment && (
          <Fade timing={100}>
            <StyledCommentForm
              documentId={document.id}
              thread={thread}
              onTyping={setIsTyping}
              standalone={commentsInThread.length === 0}
              dir={document.dir}
              autoFocus={focused}
            />
          </Fade>
        )}
      </ResizingHeightContainer>
      {!focused && can.comment && (
        <Reply onClick={() => setFocused(true)}>{t("Reply")}…</Reply>
      )}
    </Thread>
  );
};

const StyledCommentForm = styled(CommentForm)`
  position: relative;
  left: -4px;
`;

export default InpageThread;
