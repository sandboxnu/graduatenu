import * as React from "react";
import { excelToSchedule } from "../utils/excelParser"
import { Schedule } from "../../../common/types"
import styled from "styled-components";
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';


const Container = styled.div`
    position: relative;
    justify-content: right;
    padding: 0px;
    margin: 0px;
`;

interface Props {
    setSchedule: ((schedule: Schedule) => void)
}

function onUpload(e : any, setSchedule: ((schedule: Schedule) => any)) {
    if (e != null && e.target != null) {
        const file = e.target.files[0]
        excelToSchedule(file, setSchedule)
    }
}

export const ExcelUpload: React.FC<Props> = (props) => {
    return(
        <Container>
            <Tooltip 
                title="Auto-populate your schedule with your excel plan of study. Reach out to your advisor if you don't have it!"
                placement="left"
                arrow>
                <Button
                    variant="contained"
                    component="label">
                    Upload Plan Of Study
                    <input
                        type="file"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        style={{ display: "none" }}
                        onChange={ (e) => onUpload(e, props.setSchedule)}/>
                </Button>
            </Tooltip>
        </Container>
    );
}