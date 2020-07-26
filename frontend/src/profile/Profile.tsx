import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { OutlinedButton } from '../components/common/OutlinedButton';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ChangePasswordModal } from "./ChangePasswordModal"
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import {
    setMajorAction,
    setFullNameAction,
    setEmailAction,
    setUserCoopCycleAction
} from "../state/actions/userActions";
import {
    getMajors,
    getPlans,
    getMajorFromState,
    getUserCoopCycleFromState,
    getFullNameFromState,
    getToken,
    getId,
    getEmail
  } from "../state";
import { Dispatch } from "redux";
import { Major, Schedule } from "../../../common/types";
import { AppState } from "../state/reducers/state";
import { planToString } from "../utils";
import { updateUser } from "../services/UserService"
import { IUpdateUser, IUpdateUserData } from "../models/types";


const OuterContainer = styled.div`
    width: 50%;
    margin: 0 auto;
`;

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: 3px solid #EB5757;
    box-sizing: border-box;
    margin: 10%;
    padding: 30px 20% 40px 30px;
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
    justify-content: space-between;
`;

const ProfileColumn = styled.div`
    display: flex;
    flex-direction: column;
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

const Container = styled.div`
`;

const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0px 20px 0px 20px;
`;

const StyledLink = styled(Link)`
  padding: 20px 0px 0px 0px;
  color: #EB5757;
`
interface ProfileNameProps {
    name: string,
    isEdit: boolean,
    setName: (name: string) => void
}

interface ProfileMajorProps {
    major: string,
    isEdit: boolean,
    majors: Major[],
    setMajor: (major: Major | undefined) => void
}

interface ProfileCoopProps {
    major: Major,
    coop: string,
    isEdit: boolean,
    plans: Record<string, Schedule[]>,
    setCoop: (coop: Schedule | undefined) => void
}

interface ProfileEmailProps {
    email: string,
    isEdit: boolean,
    setEmail: (email: string) => void
}

interface SaveProps {
    setEdit: Function,
    name: string,
    email: string,
    major: Major,
    coop: string,
    token: string,
    id: number,
    setMajorAction: (major?: Major) => void,
    setCoopCycleAction: (plan: string) => void,
    setFullNameAction: (fullName: string) => void,
    setEmailAction: (email: string) => void,
}

interface ChangePasswordProps {
    token: string,
    id: number,
}

const ProfileName = (props: ProfileNameProps) => {
    return (
        <ProfileEntryContainer>
            <ItemTitle> Name </ItemTitle>
            {props.isEdit && 
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    value={props.name}
                    onChange={e => props.setName(e.target.value)}
                    placeholder="John Smith"
                />
            }
            {!props.isEdit && 
                <ItemEntry> {props.name} </ItemEntry>
            }
        </ProfileEntryContainer>
    );
}

const ProfileMajor = (props: ProfileMajorProps) => {
    const val = props.major != "" ? props.major : "None Selected";
    return (
        <ProfileEntryContainer>
            <ItemTitle> Major </ItemTitle>
            {props.isEdit && 
                <Autocomplete
                    disableListWrap
                    options={props.majors.map((maj: { name: any; }) => maj.name)}
                    renderInput={params => (
                    <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                    />
                    )}
                    value={val}
                    onChange={(event: React.SyntheticEvent<{}>, value: any) => props.setMajor(props.majors.find((m: Major) => m.name == value))}
                />
            }
            {!props.isEdit && 
                <ItemEntry> {val} </ItemEntry>
            }
        </ProfileEntryContainer>
    );
}

const ProfileCoop = (props: ProfileCoopProps) => {
    const val = props.coop != "" ? props.coop : "None Selected";
    return (
        <ProfileEntryContainer>
            <ItemTitle> Co-op Cycle </ItemTitle>
            {props.isEdit && 
                <Autocomplete
                    disableListWrap
                    options={props.plans[props.major.name].map((p: Schedule) =>
                        planToString(p)
                    )}
                    renderInput={params => (
                    <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                    />
                    )}
                    value={val}
                    onChange={(event: React.SyntheticEvent<{}>, value: any) => 
                        props.setCoop(value)}
                />
            }
            {!props.isEdit && 
                <ItemEntry> {val} </ItemEntry>
            }
        </ProfileEntryContainer>
    );
}

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

const ProfileEmail = (props: ProfileEmailProps) => {
    return (
        <ProfileEntryContainer>
            <ItemTitle> Email </ItemTitle>
            {props.isEdit && 
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    value={props.email}
                    onChange={e => props.setEmail(e.target.value)}
                    placeholder="johnsmith@email.com"
                />
            }
            {!props.isEdit && 
                <ItemEntry> {props.email} </ItemEntry>
            }
        </ProfileEntryContainer>
    );
}

const save = (props: SaveProps) => {
    props.setEdit(false);
    props.setMajorAction(props.major);
    props.setFullNameAction(props.name);
    props.setEmailAction(props.email);
    props.setCoopCycleAction(props.coop);

    const user: IUpdateUser = {
        token: props.token,
        id: props.id
    };

    const updateUserData: IUpdateUserData = {
        username: props.name,
        email: props.email,
        major: props.major != undefined ? props.major.name : "",
        coop_cycle: props.coop != undefined && props.coop != "None Selected" ? props.coop : "",
    };
    updateUser(user, updateUserData);
}

const SaveButton = (props: SaveProps) => {
    return (
        <PrimaryButton
            onClick={() => save(props)}>
            Save 
        </PrimaryButton>
    );
}

const ChangePassword = (props: ChangePasswordProps) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            <ProfileEntryContainer>
                <ItemTitle> Password </ItemTitle>
                <div onClick={() => setOpen(true)}>
                    <OutlinedButton>Change Password</OutlinedButton>
                </div>
            </ProfileEntryContainer>
            <ChangePasswordModal
                open={open}
                setOpen={setOpen}
                token={props.token}/>
      </div>
    );
}

export const ProfileComponent: React.FC = (props: any) => {
    const [isEdit, setEdit] = useState(false);
    const [name, setName] = useState(props.name);
    const [major, setMajor] = useState(props.major);
    const [advisor, setAdvisor] = useState("");
    const [email, setEmail] = useState(props.email);
    const [coop, setCoop] = useState(props.coop)
    const { majors, plans } = props;

    console.log(props);
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
                        {!isEdit && 
                            <IconButton
                                onClick={() => setEdit(true)}
                                style={{ color: "rgba(102, 102, 102, 0.3)" }}
                                disableRipple
                                disableFocusRipple
                                disableTouchRipple
                            >
                                <EditIcon fontSize="default" />
                            </IconButton>
                        }
                    </ProfileTitleContainer>
                    <DataContainer>
                        <ProfileColumn> 
                            <ProfileName
                                isEdit={isEdit}
                                name={name}
                                setName={setName}/>
                            <ProfileMajor
                                isEdit={isEdit}
                                major={major == undefined ? "" : major.name}
                                setMajor={setMajor}
                                majors={majors}/>
                            { (props.token != undefined && props.token.length > 0) && 
                                <ChangePassword
                                    token={props.token}
                                    id={props.id}/>
                            }
                        </ProfileColumn>
                        <ProfileColumn> 
                            <ProfileEmail
                                isEdit={isEdit}
                                email={email}
                                setEmail={setEmail}/>
                            {major != undefined &&
                                <ProfileCoop
                                    isEdit={isEdit}
                                    coop={coop == undefined ? "" : coop}
                                    setCoop={setCoop}
                                    plans={plans}
                                    major={major}/>
                            }
                        </ProfileColumn>
                    </DataContainer>
                {isEdit && 
                    <SaveButton 
                        setEdit={setEdit}
                        name={name}
                        email={email}
                        major={major}
                        coop={coop}
                        token={props.token}
                        id={props.id}
                        setMajorAction={props.setMajorAction}
                        setCoopCycleAction={props.setCoopCycleAction}
                        setFullNameAction={props.setFullNameAction}
                        setEmailAction={props.setEmailAction}/>
                }
                </InnerContainer>
            </OuterContainer>
        </Container>
    )
}

/**
 * Callback to be passed into connect, to make properties of the AppState available as this components props.
 * @param state the AppState
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({
    setMajorAction: (major?: Major) => dispatch(setMajorAction(major)),
    setCoopCycleAction: (plan: string) => dispatch(setUserCoopCycleAction(plan)),
    setFullNameAction: (fullName: string) => dispatch(setFullNameAction(fullName)),
    setEmailAction: (email: string) => dispatch(setEmailAction(email))
});
  
/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the appstate.
 * @param dispatch responsible for dispatching actions to the redux store.
 */
const mapStateToProps = (state: AppState) => ({
    name: getFullNameFromState(state),
    major: getMajorFromState(state),
    coop: getUserCoopCycleFromState(state),
    majors: getMajors(state),
    plans: getPlans(state),
    token: getToken(state),
    id: getId(state),
    email: getEmail(state),
});

/**
 * Convert this React component to a component that's connected to the redux store.
 * When rendering the connecting component, the props assigned in mapStateToProps, do not need to
 * be passed down as props from the parent component.
 */
export const Profile = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ProfileComponent));
  