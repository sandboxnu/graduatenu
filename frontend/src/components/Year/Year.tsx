import * as React from "react";
import styled from "styled-components";
import { YearTop } from ".";
import { SemesterBlock } from "../";
import { DNDSchedule } from "../../models/types";
import { SEMESTER_MIN_HEIGHT } from "../../constants";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { isYearInPast } from "../../utils";

interface Props {
  index: number;
  schedule: DNDSchedule;
}

interface State {
  expanded: boolean;
}

const YearTopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: -28px;
`;

const YearBody = styled.div`
  display: flex;
  flex-direction: row;
  min-height: ${SEMESTER_MIN_HEIGHT}px;
`;

export class Year extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const year = props.schedule.years[props.index];

    this.state = {
      expanded: !isYearInPast(year),
    };
  }

  handleExpandedChange() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { index, schedule } = this.props;
    const year = schedule.years[index];
    return (
      <div style={{ width: "100%", marginBottom: 28 }}>
        <YearTopWrapper>
          <div
            onClick={this.handleExpandedChange.bind(this)}
            style={{ marginRight: 4 }}
          >
            {this.state.expanded ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </div>
          <YearTop
            year={year}
            fallStatus={schedule.yearMap[year].fall.status}
            springStatus={schedule.yearMap[year].spring.status}
            summer1Status={schedule.yearMap[year].summer1.status}
            summer2Status={schedule.yearMap[year].summer2.status}
          />
        </YearTopWrapper>
        {this.state.expanded && (
          <YearBody>
            <SemesterBlock semester={schedule.yearMap[year].fall} />
            <SemesterBlock semester={schedule.yearMap[year].spring} />
            <SemesterBlock semester={schedule.yearMap[year].summer1} />
            <SemesterBlock semester={schedule.yearMap[year].summer2} />
          </YearBody>
        )}
      </div>
    );
  }
}
