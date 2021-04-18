import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
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
  safelyGetStudentFullNameFromState,
  getIsAdvisorFromState,
  safelyGetAdvisorUserIdFromState,
  safelyGetAdvisorFullNameFromState,
} from "../../state";
import { AppState } from "../../state/reducers/state";
import { GenericColorButton } from "../common/ColoredButtons";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import * as timeago from "timeago.js";
import { TextField } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  ALERT_STATUS,
  SnackbarAlert,
} from "../../components/common/SnackbarAlert";
import useOnScreen from "../../hooks/useOnScreen";

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
  margin-bottom: 30px;
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

const ContentEnd = styled.div`
  height: 1px;
  background: rgba(21, 116, 62, 0.68);
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
  const [alertStatus, setAlertStatus] = useState<ALERT_STATUS>(
    ALERT_STATUS.None
  );

  const contentEndRef = useRef<HTMLDivElement>(null);
  const endPageRef = useRef<HTMLDivElement>(null);

  const isEndPageOnScreen = useOnScreen(endPageRef, "-125px");

  const scrollToBottom = () => {
    if (contentEndRef !== null && contentEndRef.current !== null) {
      contentEndRef.current.scrollIntoView();
    }
  };

  const { planId, studentId, advisorId, isAdvisor, studentName, advisorName } = useSelector(
    (state: AppState) => ({
      planId: safelyGetActivePlanIdFromState(state),
      studentId: safelyGetUserIdFromState(state),
      advisorId: safelyGetAdvisorUserIdFromState(state),
      isAdvisor: getIsAdvisorFromState(state),
      studentName: safelyGetStudentFullNameFromState(state),
      advisorName: safelyGetAdvisorFullNameFromState(state),
    })
  );

  const userName = isAdvisor && advisorName ? advisorName : studentName;
  const userId = isAdvisor && advisorId ? advisorId : studentId;

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

  // If end of comments is on screen, let's scroll to the bottom.
  // This was the best solution I could find, feel free to refactor if there's a better one.
  useEffect(() => {
    if (isEndPageOnScreen) scrollToBottom();
  }, [isEndPageOnScreen]);

  const CommentInput = () => {
    const [comment, setComment] = useState("");
    const buttonDisabled = !comment;

    const CommentButton = GenericColorButton(
      "rgba(21, 116, 62, 0.68)",
      "rgba(21, 116, 62, 0.74)"
    );

    const handleCommentButtonClick = () => {
      if (planId && userId) {
        sendComment(planId, userId, userName, comment)
          .then((response: IComment) => {
            setTab(0);
            setComments([...comments, response]);
            setAlertStatus(ALERT_STATUS.Success);
          })
          .catch(e => setAlertStatus(ALERT_STATUS.Error));
        setComment("");
        if (tab === 0) scrollToBottom();
      }
    };

    return (
      <InputContainer>
        <TextField
          multiline
          value={comment}
          onChange={event => setComment(event.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              handleCommentButtonClick();
            }
          }}
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
    <>
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
            {isExpanded && (
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
            )}
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
                  <ContentEnd ref={contentEndRef}></ContentEnd>
                </>
              )}
            </div>
          )}
        </ContentContainer>
        <CommentInput />
        <SnackbarAlert
          alertStatus={alertStatus}
          handleClose={() => setAlertStatus(ALERT_STATUS.None)}
          successMsg={"Comment Sent"}
        />
      </CommentsDropdownContainer>
      <div ref={endPageRef}></div>
    </>
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
