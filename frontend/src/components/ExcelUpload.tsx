import * as React from "react";
import { ExcelToSchedule } from "../utils/excelParser"
import { Schedule } from "../models/types"

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
            <div>
                <input type="file" onChange={ (e) => this.handleChange(e) } />
            </div>
        );
    }
}