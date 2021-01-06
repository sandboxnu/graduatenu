import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { IComment } from "../../models/types";
import { fetchComments, sendComment } from "../../services/AdvisorService";
import {
  getAdvisorCommentsFromState,
  safelyGetActivePlanIdFromState,
  safelyGetUserIdFromState,
  getUserFullNameFromState,
  getAdvisorFullNameFromState,
} from "../../state";
import { addCommentAction } from "../../state/actions/advisorActions";
import { AppState } from "../../state/reducers/state";
import { GenericColorButton } from "../common/ColoredButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import * as timeago from "timeago.js";
import { TextField } from "@material-ui/core";
import { LoadingSpinner } from "../common/LoadingSpinner";

const CommentsHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  background-color: rgba(21, 116, 62, 0.68);
  padding: 0px;
  width: 100%;
`;

const CommentsContainer = styled.div`
  margin-right: 30px;
`;

const CommentHeaderText = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: white;
`;

const CommentContainer = styled.div<any>`
  border: 1px solid rgba(21, 116, 62, 0.68);
  border-top: none;
  box-sizing: border-box;
  position: relative;
  height: 100%;
  padding: 30px;
  margin-left: 30px;
  white-space: pre-wrap;
`;

const CommentHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-bottom: 14px;
`;

const CommentAuthor = styled.div`
  font-weight: 600;
`;

const CommentTimestamp = styled.div`
  color: dimgrey;
`;

const SubmitCommentButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
`;

const CommentHeaderWithDropDown = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface Props {
  planId: number;
  studentId: number;
}

export const Comments: React.FC<Props> = (props: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [comments, setComments] = useState<IComment[]>([]);
  const [comment, setComment] = useState("");

  const { planId, userId, userName } = useSelector((state: AppState) => ({
    planId: safelyGetActivePlanIdFromState(state),
    userId: safelyGetUserIdFromState(state),
    userName: getAdvisorFullNameFromState(state),
  }));

  useEffect(() => {
    fetchComments(props.planId, props.studentId)
      .then(response => {
        setComments(response);
      })
      .catch(e => console.log(e));
  }, []);

  const CommentInput = () => {
    const buttonDisabled = !comment;

    const CommentButton = GenericColorButton(
      "rgba(21, 116, 62, 0.68)",
      "rgba(21, 116, 62, 0.74)"
    );

    const dispatch = useDispatch();

    const handleCommentButtonClick = () => {
      if (planId && userId) {
        sendComment(
          planId,
          userId,
          userName,
          comment
        ).then((response: IComment) => setComments([...comments, response]));
        setComment("");
      }
    };

    return (
      <CommentContainer>
        <TextField
          multiline
          value={comment}
          onChange={event => setComment(event.target.value)}
          label={"Enter comment here"}
          variant="outlined"
          fullWidth
        />
        <SubmitCommentButton>
          <CommentButton
            onClick={handleCommentButtonClick}
            disabled={buttonDisabled}
          >
            Comment
          </CommentButton>
        </SubmitCommentButton>
      </CommentContainer>
    );
  };

  return (
    <CommentsContainer>
      <CommentHeaderWithDropDown>
        <div
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          style={{ marginRight: 4, marginLeft: 2 }}
        >
          {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </div>
        <CommentsHeader>
          <CommentHeaderText> Comments </CommentHeaderText>
        </CommentsHeader>
      </CommentHeaderWithDropDown>
      {isExpanded && (
        <div>
          {comments.map((comment: IComment) => (
            <Comment
              author={comment.author}
              comment={comment.comment}
              createdAt={comment.createdAt}
              updatedAt={comment.updatedAt}
            ></Comment>
          ))}
          <CommentInput />
        </div>
      )}
    </CommentsContainer>
  );
};

const Comment: React.FC<IComment> = (props: IComment) => {
  const { author, comment, createdAt, updatedAt } = props;
  return (
    <CommentContainer>
      <CommentHeader>
        <CommentAuthor>{author}</CommentAuthor>
        <CommentTimestamp>{timeago.format(createdAt)}</CommentTimestamp>
      </CommentHeader>
      {comment}
    </CommentContainer>
  );
};
