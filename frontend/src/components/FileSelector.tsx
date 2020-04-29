import * as React from "react";
import { ExcelToSchedule } from "../utils/excelParser"

type Props = {}

export class FileSelector extends React.Component {
    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e : any) {
        if (e != null && e.target != null) {
            console.log(e.target.files);
            const file = e.target.files[0]
            console.log(ExcelToSchedule(file))
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