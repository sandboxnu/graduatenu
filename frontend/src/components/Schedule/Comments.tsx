import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { IChangeLog, IComment } from "../../models/types";
import {
  fetchChangelogs,
  fetchComments,
  sendComment,
} from "../../services/PlanService";
import {
  safelyGetActivePlanIdFromState,
  safelyGetUserIdFromState,
  getAdvisorFullNameFromState,
} from "../../state";
import { AppState } from "../../state/reducers/state";
import { GenericColorButton } from "../common/ColoredButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import * as timeago from "timeago.js";
import { TextField } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import CommentIcon from "@material-ui/icons/Comment";
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const CommentsHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  background-color: rgba(21, 116, 62, 0.68);
  padding: 0px;
  width: 100%;
`;

const CommentsDropdownContainer = styled.div`
  margin-right: 30px;
`;

const ContentContainer = styled.div`
  margin-left: 30px;
  border: 1px solid rgba(21, 116, 62, 0.68);
  max-height: 400px;
  overflow-y: scroll;
`;

const CommentHeaderText = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: white;
`;

const CommentsHeaderWithTabs = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TabContainer = styled.div`
  border: 1px solid rgba(21, 116, 62, 0.68);
`;

const LoadingContainer = styled.div`
  margin-left: 30px;
`;

const CommentContainer = styled.div<any>`
  border-bottom: 1px solid rgba(21, 116, 62, 0.68);
  box-sizing: border-box;
  position: relative;
  height: 100%;
  padding: 30px;
  white-space: pre-wrap;
`;

const InputContainer = styled.div<any>`
  border: 1px solid rgba(21, 116, 62, 0.68);
  border-top: 0px;
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

const CommentTheme = createMuiTheme({
  palette: {
    secondary: {
      main: "#15743e",
    },
  },
});

const LinearLoading = () => {
  return (
    <MuiThemeProvider theme={CommentTheme}>
      <LoadingContainer>
        <LinearProgress color="secondary" />
      </LoadingContainer>
    </MuiThemeProvider>
  );
};

interface Props {
  planId: number;
  studentId: number;
}

export const Comments: React.FC<Props> = (props: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [comments, setComments] = useState<IComment[]>([]);
  const [changeLogs, setChangeLogs] = useState<IChangeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const { planId, userId, userName } = useSelector((state: AppState) => ({
    planId: safelyGetActivePlanIdFromState(state),
    userId: safelyGetUserIdFromState(state),
    userName: getAdvisorFullNameFromState(state),
  }));

  useEffect(() => {
    Promise.all([
      fetchComments(props.planId, props.studentId),
      fetchChangelogs(props.planId, props.studentId),
    ])
      .then(values => {
        setComments(values[0]);
        setChangeLogs(values[1]);
        setLoading(false);
      })
      .catch(e => console.log(e));
  }, []);

  const CommentInput = () => {
    const [comment, setComment] = useState("");
    const buttonDisabled = !comment;

    const CommentButton = GenericColorButton(
      "rgba(21, 116, 62, 0.68)",
      "rgba(21, 116, 62, 0.74)"
    );

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
      <InputContainer>
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
      </InputContainer>
    );
  };

  const CommentContainer = () => {
    if (tab !== 0) {
      return null;
    }

    return (
      <>
        {comments.map((comment: IComment) => (
          <Comment
            author={comment.author}
            comment={comment.comment}
            createdAt={comment.createdAt}
            updatedAt={comment.updatedAt}
          ></Comment>
        ))}
      </>
    );
  };

  const ChangeLogsContainer = () => {
    if (tab !== 1) {
      return null;
    }

    return (
      <>
        {changeLogs.map((changeLog: IChangeLog) => (
          <ChangeLog
            userId={changeLog.userId}
            author={changeLog.author}
            log={changeLog.log}
            createdAt={changeLog.createdAt}
            updatedAt={changeLog.updatedAt}
          />
        ))}
      </>
    );
  };

  const handleTabChange = (event: any, newValue: any) => {
    setTab(newValue);
  };

  return (
    <CommentsDropdownContainer>
      <CommentHeaderWithDropDown>
        <div
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          style={{ marginRight: 4, marginLeft: 2 }}
        >
          {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </div>
        <CommentsHeaderWithTabs>
          <CommentsHeader>
            <CommentHeaderText> Comments </CommentHeaderText>
          </CommentsHeader>
          <TabContainer>
            <MuiThemeProvider theme={CommentTheme}>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="secondary"
                textColor="secondary"
                aria-label="icon label tabs example"
              >
                <Tab label="COMMENTS" />
                <Tab label="CHANGE HISTORY" />
              </Tabs>
            </MuiThemeProvider>
          </TabContainer>
        </CommentsHeaderWithTabs>
      </CommentHeaderWithDropDown>
      <ContentContainer>
        {isExpanded && (
          <div>
            {loading ? (
              <LinearLoading />
            ) : (
              <>
                <CommentContainer />
                <ChangeLogsContainer />
              </>
            )}
          </div>
        )}
      </ContentContainer>
      <CommentInput />
    </CommentsDropdownContainer>
  );
};

const Comment: React.FC<IComment> = (props: IComment) => {
  const { author, comment, createdAt } = props;
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

const ChangeLog: React.FC<IChangeLog> = (props: IChangeLog) => {
  const { author, log, createdAt } = props;
  return (
    <CommentContainer>
      <CommentHeader>
        <CommentAuthor>{author}</CommentAuthor>
        <CommentTimestamp>{timeago.format(createdAt)}</CommentTimestamp>
      </CommentHeader>
      {log}
    </CommentContainer>
  );
};
