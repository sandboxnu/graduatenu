import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import {
  EditableSchedule,
  NonEditableScheduleStudentView,
} from "../../components/Schedule/ScheduleComponents";
import { AutoSavePlan } from "../../home/AutoSavePlan";
import { safelyGetActivePlanFromState } from "../../state";
import {
  expandAllYearsForActivePlanAction,
  setActivePlanAction,
  setUserPlansAction,
} from "../../state/actions/userPlansActions";
import { AppState } from "../../state/reducers/state";
import { IconButton, TextField, Tooltip } from "@material-ui/core";
import { ArrowBack, Check, FullscreenExit } from "@material-ui/icons";
import Edit from "@material-ui/icons/Edit";
import styled from "styled-components";
import { PlanTitle, ButtonHeader, ScheduleWrapper, Container } from "./Shared";
import { useHistory, useLocation, useParams } from "react-router";
import { IComment, IUserData } from "../../models/types";
import { fetchComments, fetchUser } from "../../services/AdvisorService";
import { fetchPlan } from "../../services/PlanService";
import { getAuthToken } from "../../utils/auth-helpers";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { setUserAction } from "../../state/actions/userActions";
import * as timeago from "timeago.js";
import { GenericColorButton } from "../GenericAdvisingTemplate";

const FullScheduleViewContainer = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  * {
    font-family: Roboto;
    font-style: normal;
  }
`;

const ExpandedScheduleStudentInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ExpandedStudentContainer = styled.div`
  margin-top: 12px;
  border: 1px solid red;
  border-radius: 10px;
  padding: 30px;
`;

const CommentsHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  background-color: rgba(21, 116, 62, 0.68);
  padding: 0px;
`;

const CommentsContainer = styled.div`
  margin: 0 30px;
`;

const CommentHeaderText = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: white;
`;

const CommentHolderBody = styled.div<any>`
  border: 1px solid rgba(21, 116, 62, 0.68);
  border-top: none;
  box-sizing: border-box;
  position: relative;
  height: 100%;
  padding: 30px;
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

const CommentContent = styled.div``;

const CommentTimestamp = styled.div`
  color: dimgrey;
`;

const SubmitCommentButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
`;

interface ParamProps {
  id: string; // id of the student
  planId: string; // id of the student's plan
}

interface CommmentsProps {
  comments: IComment[];
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const ExpandedStudentView: React.FC = () => {
  const history = useHistory();
  const params = useParams<ParamProps>();
  const queryParams = useQuery();
  const id = Number(params.id);
  const planId = Number(params.planId);

  const [editMode, setEditMode] = useState(queryParams.get("edit") === "true");
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<IUserData | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const mockComments = [
    {
      author: "person1",
      comment: "heres your plan",
      createdAt: new Date("14 Dec 2020 00:00:00 PDT"),
      updatedAt: new Date(),
    },
    {
      author: "person2",
      comment: "thanks!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  const { plan } = useSelector((state: AppState) => ({
    plan: safelyGetActivePlanFromState(state),
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(expandAllYearsForActivePlanAction());

    fetchUser(id)
      .then(response => {
        const user = response.user;
        fetchPlan(id, planId)
          .then(response => {
            batch(() => {
              dispatch(setUserAction(user));
              dispatch(setUserPlansAction([response], user.academicYear));
              dispatch(
                setActivePlanAction(response.name, id, user.academicYear)
              );
            });
            setStudent(user);
            setLoading(false);
            // fetchComments(planId, id).then(response => {
            //   setComments(response);
            // });
          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }, []);

  const onEditPress = () => setEditMode(!editMode);

  return (
    <Container>
      <FullScheduleViewContainer>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <ExpandedScheduleStudentInfo>
              <IconButton
                onClick={() => history.push(`/advisor/manageStudents/${id}`)}
              >
                <ArrowBack />
              </IconButton>
              <b style={{ marginRight: 12 }}>{student!.fullName}</b>
              {plan!.major || ""} {plan!.coopCycle || ""}
            </ExpandedScheduleStudentInfo>
            <ExpandedStudentContainer>
              <PlanTitle>{plan!.name}</PlanTitle>
              <ButtonHeader>
                {editMode && <AutoSavePlan />}
                {editMode ? (
                  <Tooltip title="Finished Editing">
                    <IconButton onClick={onEditPress}>
                      <Check />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Edit this student's plan">
                    <IconButton onClick={onEditPress}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                )}
                <IconButton
                  onClick={() => history.push(`/advisor/manageStudents/${id}`)}
                >
                  <FullscreenExit />
                </IconButton>
              </ButtonHeader>
              <ScheduleWrapper>
                {editMode ? (
                  <EditableSchedule
                    transferCreditPresent
                    collapsibleYears={false}
                  />
                ) : (
                  <NonEditableScheduleStudentView
                    transferCreditPresent
                    collapsibleYears={false}
                  />
                )}
                <Comments comments={mockComments} />
              </ScheduleWrapper>
            </ExpandedStudentContainer>
          </>
        )}
      </FullScheduleViewContainer>
    </Container>
  );
};

const Comments: React.FC<CommmentsProps> = ({ comments }) => {
  return (
    <CommentsContainer>
      <CommentsHeader>
        <CommentHeaderText> Comments </CommentHeaderText>
      </CommentsHeader>
      {comments.map((comment: IComment) => (
        <Comment
          author={comment.author}
          comment={comment.comment}
          createdAt={comment.createdAt}
          updatedAt={comment.updatedAt}
        ></Comment>
      ))}
      <CommentInput />
    </CommentsContainer>
  );
};

const Comment: React.FC<IComment> = (props: IComment) => {
  const { author, comment, createdAt, updatedAt } = props;
  return (
    <CommentHolderBody>
      <CommentHeader>
        <CommentAuthor>{author}</CommentAuthor>
        <CommentTimestamp>{timeago.format(createdAt)}</CommentTimestamp>
      </CommentHeader>
      <CommentContent>{comment}</CommentContent>
    </CommentHolderBody>
  );
};

const CommentInput: React.FC = () => {
  const [comment, setComment] = useState("");

  const CommentButton = GenericColorButton(
    "rgba(21, 116, 62, 0.68)",
    "rgba(21, 116, 62, 0.74)"
  );

  return (
    <CommentHolderBody>
      {" "}
      <TextField
        multiline
        value={comment}
        onChange={event => setComment(event.target.value)}
        label={"Enter comment here"}
        variant="outlined"
        fullWidth
      />
      <SubmitCommentButton>
        <CommentButton>Comment</CommentButton>
      </SubmitCommentButton>
    </CommentHolderBody>
  );
};
