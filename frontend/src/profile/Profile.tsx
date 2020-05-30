import React, { useState } from "react";
import styled from "styled-components";
import { OutlinedButton } from '../components/common/OutlinedButton';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ChangePasswordModal } from "./ChangePasswordModal"
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

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


function ProfileName(props: any) {
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

function ProfileMajor(props: any) {
    return (
        <ProfileEntryContainer>
            <ItemTitle> Major </ItemTitle>
            {props.isEdit && 
                <Autocomplete
                    disableListWrap
                    //options={props.majors.map((maj: { name: any; }) => maj.name)}
                    options={["major", "major 2", "major 3"]}
                    renderInput={params => (
                    <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                    />
                    )}
                    value={props.major}
                    onChange={(event: React.SyntheticEvent<{}>, value: any) => props.setMajor(value)}
                />
            }
            {!props.isEdit && 
                <ItemEntry> {props.major} </ItemEntry>
            }
        </ProfileEntryContainer>
    );
}

function ProfileCoop(props: any) {
    return (
        <ProfileEntryContainer>
            <ItemTitle> Co-op Cycle </ItemTitle>
            {props.isEdit && 
                <Autocomplete
                    disableListWrap
                    //options={props.majors.map((maj: { name: any; }) => maj.name)}
                    options={["coop 1", "coop 2"]}
                    renderInput={params => (
                    <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                    />
                    )}
                    value={props.coop}
                    onChange={(event: React.SyntheticEvent<{}>, value: any) => props.setCoop(value)}
                />
            }
            {!props.isEdit && 
                <ItemEntry> {props.coop} </ItemEntry>
            }
        </ProfileEntryContainer>
    );
}

function ProfileAdvisor(props: any) {
    return (
        <ProfileEntryContainer>
            <ItemTitle> Advisor </ItemTitle>
            {props.isEdit && 
                <Autocomplete
                    disableListWrap
                    //options={props.majors.map((maj: { name: any; }) => maj.name)}
                    options={["test", "test 2"]}
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


function ProfileEmail(props: any) {
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

function save(setEdit: Function) {
    console.log("TEST");
    setEdit(false);
    // TODO: Save
}
function SaveButton(props: any) {
    return (
        <div onClick={() => save(props.setEdit)}>
            <PrimaryButton>
                Save 
            </PrimaryButton>
        </div>
    );
}

const ChangePassword: React.FC = (props: any) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            <ProfileEntryContainer>
                <ItemTitle> Password </ItemTitle>
                <div onClick={() => setOpen(true)}>
                    <OutlinedButton>Log In</OutlinedButton>
                </div>
            </ProfileEntryContainer>
            <ChangePasswordModal
                open={open}
                setOpen={setOpen}/>
      </div>
    );
}

export const Profile: React.FC = (props: any) => {
    const [isEdit, setEdit] = useState(false);
    const [name, setName] = useState("John");
    const [major, setMajor] = useState("major");
    const [advisor, setAdvisor] = useState("Andrea");
    const [email, setEmail] = useState("test@email.com");
    const [coop, setCoop] = useState("coop")

    return (
        <OuterContainer> 
            <InnerContainer>
                <ProfileTitleContainer>
                    <ProfileTitle> Profile </ProfileTitle>
                    <IconButton
                        onClick={() => setEdit(true)}
                        style={{ color: "rgba(102, 102, 102, 0.3)" }}
                        disableRipple
                        disableFocusRipple
                        disableTouchRipple
                    >
                        <EditIcon fontSize="default" />
                    </IconButton>
                </ProfileTitleContainer>
                <DataContainer>
                    <ProfileColumn> 
                        <ProfileName
                            isEdit={isEdit}
                            name={name}
                            setName={setName}/>
                        <ProfileMajor
                            isEdit={isEdit}
                            major={major}
                            setMajor={setMajor}/>
                        <ProfileAdvisor
                            isEdit={isEdit}
                            advisor={advisor}
                            setAdvisor={setAdvisor}/>
                    </ProfileColumn>
                    <ProfileColumn> 
                        <ProfileEmail
                            isEdit={isEdit}
                            email={email}
                            setEmail={setEmail}/>
                        <ProfileCoop
                            isEdit={isEdit}
                            coop={coop}
                            setCoop={setCoop}/>
                        <ChangePassword/>
                    </ProfileColumn>
                </DataContainer>
               {isEdit && <SaveButton setEdit={setEdit}/>}
            </InnerContainer>
        </OuterContainer>
    )
}

