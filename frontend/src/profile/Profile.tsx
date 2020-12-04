import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import {
  setUserCoopCycleAction,
  setUserMajorAction,
} from "../state/actions/userActions";
import {
  getMajorsFromState,
  getUserFromState,
  getPlansFromState,
} from "../state";
import { Schedule } from "../../../common/types";
import { AppState } from "../state/reducers/state";
import { planToString } from "../utils";
import { updateUser } from "../services/UserService";
import { IUpdateUser, IUpdateUserData } from "../models/types";
import { getAuthToken } from "../utils/auth-helpers";

const OuterContainer = styled.div`
  width: 70%;
  margin: 0 auto;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 3px solid #eb5757;
  box-sizing: border-box;
  margin: 10%;
  padding: 30px;
`;

const ProfileTitle = styled.h1`
  padding-right: 10px;
`;

const ProfileTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const DataContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ProfileColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0px 12px 0px 12px;
`;

const ProfileEntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 0px 15px 0px;
`;

const ItemTitle = styled.p`
  font-weight: bold;
  margin: 0;
  padding: 5px 0px 5px 0px;
`;

const ItemEntry = styled.p`
  margin: 0;
  padding: 0;
`;

const Container = styled.div``;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 20px 0px 20px;
`;

const StyledLink = styled(Link)`
  padding: 20px 0px 0px 0px;
  color: #eb5757;
`;

const ProfileComponent: React.FC = () => {
  const dispatch = useDispatch();
  const { user, majors, plans } = useSelector((state: AppState) => ({
    user: getUserFromState(state), // best to update this screen when any part of the user changes
    majors: getMajorsFromState(state),
    plans: getPlansFromState(state),
  }));

  const [isEdit, setEdit] = useState(false);
  const [major, setMajor] = useState(user.major!);
  const [advisor, setAdvisor] = useState("");
  const [coopCycle, setCoopCycle] = useState(user.coopCycle);

  const ProfileName = () => {
    return (
      <ProfileEntryContainer>
        <ItemTitle> Name </ItemTitle>
        <ItemEntry> {user.fullName} </ItemEntry>
      </ProfileEntryContainer>
    );
  };

  const ProfileMajor = () => {
    const val = !!major ? major : "None Selected";
    return (
      <ProfileEntryContainer>
        <ItemTitle> Major </ItemTitle>
        {isEdit && (
          <Autocomplete
            disableListWrap
            options={majors.map((maj: { name: any }) => maj.name)}
            renderInput={params => (
              <TextField {...params} variant="outlined" fullWidth />
            )}
            value={val}
            onChange={(event: React.SyntheticEvent<{}>, value: any) =>
              setMajor(value)
            }
          />
        )}
        {!isEdit && <ItemEntry> {val} </ItemEntry>}
      </ProfileEntryContainer>
    );
  };

  const ProfileCoop = () => {
    const val = !!coopCycle ? coopCycle : "None Selected";
    return (
      <ProfileEntryContainer>
        <ItemTitle> Co-op Cycle </ItemTitle>
        {isEdit && (
          <Autocomplete
            disableListWrap
            options={plans[major].map((p: Schedule) => planToString(p))}
            renderInput={params => (
              <TextField {...params} variant="outlined" fullWidth />
            )}
            value={val}
            onChange={(event: React.SyntheticEvent<{}>, value: any) =>
              setCoopCycle(value)
            }
          />
        )}
        {!isEdit && <ItemEntry> {val} </ItemEntry>}
      </ProfileEntryContainer>
    );
  };

  /*
  TODO: // Add Advsisors to profile page once we support them
  const ProfileAdvisor = (props: any) => {
      return (
          <ProfileEntryContainer>
              <ItemTitle> Advisor </ItemTitle>
              {props.isEdit &&
                  <Autocomplete
                      disableListWrap
                      options={["advisor", "advisor 2", "advisor 3"]}
                      renderInput={params => (
                      <TextField
                          {...params}
                          variant="outlined"
                          fullWidth
                      />
                      )}
                      value={props.advisor}
                      onChange={(event: React.SyntheticEvent<{}>, value: any) => props.setAdvisor(value)}
                  />
              }
              {!props.isEdit &&
                  <ItemEntry> {props.advisor} </ItemEntry>
              }
          </ProfileEntryContainer>
      );
  }
  */

  const ProfileEmail = () => {
    return (
      <ProfileEntryContainer>
        <ItemTitle> Email </ItemTitle>
        <ItemEntry> {user.email} </ItemEntry>
      </ProfileEntryContainer>
    );
  };

  const save = () => {
    setEdit(false);
    dispatch(setUserMajorAction(major));
    if (coopCycle != undefined && coopCycle !== "None Selected") {
      dispatch(setUserCoopCycleAction(coopCycle));
    }

    const token = getAuthToken();

    const updateUserObj: IUpdateUser = {
      token: token,
      id: user.id!,
    };

    const updateUserData: IUpdateUserData = {
      major: major,
      coop_cycle:
        coopCycle != undefined && coopCycle !== "None Selected"
          ? coopCycle
          : "",
    };
    updateUser(updateUserObj, updateUserData);
  };

  const SaveButton = () => {
    return <PrimaryButton onClick={() => save()}>Save</PrimaryButton>;
  };

  // const ChangePassword = (props: ChangePasswordProps) => {
  //   const [open, setOpen] = React.useState(false);
  //   const token = getAuthToken();

  //   return (
  //     <div>
  //       <ProfileEntryContainer>
  //         <ItemTitle> Password </ItemTitle>
  //         <div onClick={() => setOpen(true)}>
  //           <OutlinedButton>Change Password</OutlinedButton>
  //         </div>
  //       </ProfileEntryContainer>
  //       <ChangePasswordModal open={open} setOpen={setOpen} token={token} />
  //     </div>
  //   );
  // };

  return (
    <Container>
      <HeaderRow>
        <h1>GraduateNU</h1>
        <StyledLink to="/home">Go to Plans</StyledLink>
      </HeaderRow>
      <OuterContainer>
        <InnerContainer>
          <ProfileTitleContainer>
            <ProfileTitle> Profile </ProfileTitle>
            {!isEdit && (
              <IconButton
                onClick={() => setEdit(true)}
                style={{ color: "rgba(102, 102, 102, 0.3)" }}
                disableRipple
                disableFocusRipple
                disableTouchRipple
              >
                <EditIcon fontSize="default" />
              </IconButton>
            )}
          </ProfileTitleContainer>
          <DataContainer>
            <ProfileColumn>
              <ProfileName />
              <ProfileMajor />
              {/* {props.token != undefined && props.token.length > 0 && (
                <ChangePassword token={props.token} id={props.id} />
              )} */}
            </ProfileColumn>
            <ProfileColumn>
              <ProfileEmail />
              {!!major && <ProfileCoop />}
            </ProfileColumn>
          </DataContainer>
          {isEdit && <SaveButton />}
        </InnerContainer>
      </OuterContainer>
    </Container>
  );
};

export const Profile = withRouter(ProfileComponent);
