import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { PrimaryButton } from "../components/common/PrimaryButton";
import {
  FormControl,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import {
  setGraduationYearAction,
  setUserCoopCycleAction,
  setUserMajorAction,
  setUserCatalogYearAction,
  setUserConcentrationAction,
} from "../state/actions/userActions";
import {
  getMajorsFromState,
  getUserFromState,
  getPlansFromState,
  getUserCatalogYearFromState,
  getUserConcentrationFromState,
  getUserMajorFromState,
} from "../state";
import { Major, Schedule } from "../../../common/types";
import { AppState } from "../state/reducers/state";
import { planToString } from "../utils";
import { updateUser } from "../services/UserService";
import { IUpdateUser, IUpdateUserData } from "../models/types";
import { getAuthToken } from "../utils/auth-helpers";
import { SaveInParentConcentrationDropdown } from "../components/ConcentrationDropdown";
import { findMajorFromName } from "../utils/plan-helpers";

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

const WhiteSpace = styled.div`
  width: 100%;
  height: 38px;
`;

const ProfileEmail = styled.div`
  margin-top: -20px;
  color: gray;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  text-align: center;
  margin-top: 20px;
`;

const ProfileComponent: React.FC = () => {
  const dispatch = useDispatch();
  const { user, majors, plans } = useSelector((state: AppState) => ({
    user: getUserFromState(state), // best to update this screen when any part of the user changes
    majors: getMajorsFromState(state),
    plans: getPlansFromState(state),
  }));

  const [isEdit, setEdit] = useState(false);
  const [major, setMajor] = useState(user.major);
  const [concentration, setConcentration] = useState<string | null>(
    user.concentration || null
  );
  const [coopCycle, setCoopCycle] = useState(user.coopCycle);
  const [catalogYear, setCatalogYear] = useState(user.catalogYear);
  const [gradYear, setGradYear] = useState(user.graduationYear!);
  const [advisor, setAdvisor] = useState("");
  const [hasConcentrationError, setHasConcentrationError] = useState(false);
  const [showConcentrationError, setShowConcentrationError] = useState(false);

  const ProfileGradYear = () => {
    return (
      <ProfileEntryContainer>
        <ItemTitle> Graduation Year </ItemTitle>
        {isEdit && (
          <FormControl variant="outlined">
            <Select
              value={gradYear}
              onChange={(event: any) => setGradYear(event.target.value)}
            >
              <MenuItem value={2019}>2019</MenuItem>
              <MenuItem value={2020}>2020</MenuItem>
              <MenuItem value={2021}>2021</MenuItem>
              <MenuItem value={2022}>2022</MenuItem>
              <MenuItem value={2023}>2023</MenuItem>
              <MenuItem value={2024}>2024</MenuItem>
              <MenuItem value={2025}>2025</MenuItem>
            </Select>
          </FormControl>
        )}
        {!isEdit && <ItemEntry> {user.graduationYear} </ItemEntry>}
      </ProfileEntryContainer>
    );
  };

  const ProfileMajor = () => {
    const val = !!major ? major : "None Selected";
    const majorsFromCatalogYear = majors.filter(
      (maj: Major) => maj.yearVersion === catalogYear
    );
    return (
      <ProfileEntryContainer>
        <ItemTitle> Major </ItemTitle>
        {isEdit && (
          <Autocomplete
            disableListWrap
            options={majorsFromCatalogYear.map(
              (maj: { name: any }) => maj.name
            )}
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

  const ProfileCatalogYear = () => {
    const val = catalogYear != undefined ? String(catalogYear) : "";
    let majorSet = [
      ...Array.from(new Set(majors.map(maj => maj.yearVersion.toString()))),
    ];
    return (
      <ProfileEntryContainer>
        <ItemTitle> Catalog Year </ItemTitle>
        {isEdit && (
          <Autocomplete
            disableListWrap
            options={majorSet}
            renderInput={params => (
              <TextField {...params} variant="outlined" fullWidth />
            )}
            value={val}
            onChange={(event: React.SyntheticEvent<{}>, value: any) => {
              setMajor("");
              setCoopCycle("");
              setConcentration("");
              setCatalogYear(Number(value));
            }}
          />
        )}
        {!isEdit && <ItemEntry> {val} </ItemEntry>}
      </ProfileEntryContainer>
    );
  };

  const ProfileConcentration = () => {
    const selectedMajorObj = findMajorFromName(major, majors, catalogYear);
    const hasConcentrations: boolean =
      (selectedMajorObj &&
        selectedMajorObj.concentrations.concentrationOptions.length > 0) ||
      false;

    const shouldDisplay: boolean =
      (isEdit && hasConcentrations) || (!isEdit && !!concentration);

    return (
      <>
        {shouldDisplay && (
          <ProfileEntryContainer>
            <ItemTitle> Concentration </ItemTitle>
            {isEdit && (
              <SaveInParentConcentrationDropdown
                major={selectedMajorObj}
                concentration={concentration || null}
                setConcentration={setConcentration}
                setError={setHasConcentrationError}
                showError={showConcentrationError}
              />
            )}
            {!isEdit && <ItemEntry> {concentration} </ItemEntry>}
          </ProfileEntryContainer>
        )}
      </>
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
            options={plans[major!].map((p: Schedule) => planToString(p))}
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
  */

  const save = () => {
    setEdit(false);
    dispatch(setUserMajorAction(major || ""));
    dispatch(setUserCatalogYearAction(catalogYear));
    dispatch(setUserConcentrationAction(concentration));
    if (coopCycle !== "None Selected") {
      dispatch(setUserCoopCycleAction(""));
    } else {
      dispatch(setUserCoopCycleAction(coopCycle || ""));
    }

    dispatch(setGraduationYearAction(gradYear));

    const token = getAuthToken();

    const updateUserObj: IUpdateUser = {
      token: token,
      id: user.id!,
    };

    //TODO add concentration
    const updateUserData: IUpdateUserData = {
      graduation_year: gradYear,
      major: major || null,
      coop_cycle:
        coopCycle != undefined && coopCycle !== "None Selected"
          ? coopCycle
          : "",
      catalog_year: catalogYear,
    };
    updateUser(updateUserObj, updateUserData);
  };

  const SaveButton = () => {
    const onClick = () => {
      if (hasConcentrationError) {
        setShowConcentrationError(true);
      } else {
        save();
      }
    };
    return <PrimaryButton onClick={onClick}>Save</PrimaryButton>;
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
            <ProfileTitle> {user.fullName} </ProfileTitle>
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
          <ProfileEmail>{user.email}</ProfileEmail>
          <DataContainer>
            <ProfileColumn>
              <ProfileCatalogYear />
              {isEdit && <WhiteSpace />}
              {!!catalogYear && <ProfileMajor />}
              {isEdit && <WhiteSpace />}
              {!!catalogYear && !!major && <ProfileConcentration />}
              {isEdit && <WhiteSpace />}
            </ProfileColumn>
            <ProfileColumn>
              <ProfileGradYear />
              {isEdit && <WhiteSpace />}
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
