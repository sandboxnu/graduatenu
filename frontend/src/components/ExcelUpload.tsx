import * as React from "react";
import { ExcelToSchedule } from "../utils/excelParser"
import { Schedule } from "../models/types"
import styled from "styled-components";
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

const Container = styled.div`
    position: relative;
    justify-content: right;
    padding: 0px;
    margin: 0px;
`;

const ButtonAndDescription = styled.div`
    display: flex;
    flex-direction: column;
`;

const Description = styled.div`
    margin: 5px;
    font-size: 0.5em;
`;

interface props {
    setSchedule: ((schedule: Schedule) => void)
}

export class ExcelUpload extends React.Component<props> {
    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    async handleChange(e : any) {
        if (e != null && e.target != null) {
            console.log(e.target.files);
            const file = e.target.files[0]
            ExcelToSchedule(file, this.props.setSchedule)
        }
    }

    render () {
        return(
            <Container>
                <ButtonAndDescription>
                    <Button
                        variant="contained"
                        component="label">
                        Upload Plan Of Study
                        <input
                            type="file"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            style={{ display: "none" }}
                            onChange={ (e) => this.handleChange(e) }/>
                    </Button>
                    <Description>
                        Upload the Excel sheet from your advisor!
                    </Description>
                </ButtonAndDescription>
            </Container>
            
        );
    }
}