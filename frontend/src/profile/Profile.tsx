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
    setEmailAction
} from "../state/actions/userActions";
import { setCoopCycle } from "../state/actions/scheduleActions";
import {
    getMajors,
    getPlans,
    getMajorFromState,
    getScheduleFromState,
    getFullNameFromState,
    getToken,
    getId,
    getEmail
  } from "../state";
import { Dispatch } from "redux";
import { Major, Schedule } from "graduate-common";
import { AppState } from "../state/reducers/state";
import { planToString } from "../utils";
import { updateUser } from "../services/UserService"

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
    padding: 30px 20% 70px 30px;
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
    padding: 15px 0px 0px 0px;
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

interface SaveProps {
    setEdit: Function,
    name: string,
    email: string,
    major: Major,
    coop: Schedule,
    token: string,
    id: number
}

interface ChangePasswordProps {
    token: string,
    id: number,
}

const ProfileName = (props: any) => {
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

const ProfileMajor = (props: any) => {
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
                    value={props.major}
                    onChange={(event: React.SyntheticEvent<{}>, value: any) => props.setMajor(props.majors.find((m: Major) => m.name == value))}
                />
            }
            {!props.isEdit && 
                <ItemEntry> {props.major} </ItemEntry>
            }
        </ProfileEntryContainer>
    );
}

const ProfileCoop = (props: any) => {
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
                    value={props.coop}
                    onChange={(event: React.SyntheticEvent<{}>, value: any) => 
                        props.setCoop(props.plans[props.major.name].find((p: Schedule) => planToString(p) === value))}
                />
            }
            {!props.isEdit && 
                <ItemEntry> {props.coop} </ItemEntry>
            }
        </ProfileEntryContainer>
    );
}

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


const ProfileEmail = (props: any) => {
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

const save = ({setEdit, name, email, major, coop, token, id}: SaveProps) => {
    console.log("SAVE");
    console.log(token);
    console.log(id);
    setEdit(false);
    setFullNameAction(name);
    setMajorAction(major);
    setCoopCycle(coop);
    const update = {
        token: token,
        id: id,
        email: email,
    }
    updateUser(update);
}

const SaveButton = (props: SaveProps) => {
    return (
        <div onClick={() => save(props)}>
            <PrimaryButton>
                Save 
            </PrimaryButton>
        </div>
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
                setOpen={setOpen}/>
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
    // TODO: Deal with loading state

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
                                major={major.name}
                                setMajor={setMajor}
                                majors={majors}/>
                            <ChangePassword
                                token={props.token}
                                id={props.id}/>
                        </ProfileColumn>
                        <ProfileColumn> 
                            <ProfileEmail
                                isEdit={isEdit}
                                email={email}
                                setEmail={setEmail}/>
                            <ProfileCoop
                                isEdit={isEdit}
                                coop={planToString(coop)}
                                setCoop={setCoop}
                                plans={plans}
                                major={major}/>
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
                        id={props.id}/>
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
    setMajor: (major?: Major) => dispatch(setMajorAction(major)),
    setCoopCycle: (plan: Schedule) => dispatch(setCoopCycle(plan)),
    setFullName: (fullName: string) => dispatch(setFullNameAction(fullName)),
    setEmail: (email: string) => dispatch(setEmailAction(email))
});
  
/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the appstate.
 * @param dispatch responsible for dispatching actions to the redux store.
 */
const mapStateToProps = (state: AppState) => ({
    name: getFullNameFromState(state),
    major: getMajorFromState(state),
    coop: getScheduleFromState(state),
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
  