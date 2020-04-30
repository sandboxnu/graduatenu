import * as React from "react";
import { ExcelToSchedule } from "../utils/excelParser"
import { Schedule } from "../models/types"
import styled from "styled-components";
import IconButton from '@material-ui/core/IconButton';
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

export class ExcelUpload extends React.Component<Props> {
    constructor(props: any) {
        super(props);
        this.onUpload = this.onUpload.bind(this);
    }

    async onUpload(e : any) {
        if (e != null && e.target != null) {
            console.log(e.target.files);
            const file = e.target.files[0]
            ExcelToSchedule(file, this.props.setSchedule)
        }
    }

    render () {
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
                            onChange={ (e) => this.onUpload(e) }/>
                    </Button>
                </Tooltip>
            </Container>
        );
    }
}