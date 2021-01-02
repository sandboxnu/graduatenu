import { TextField, FormControl } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  WhiteColorButton,
  RedColorButton,
} from "../../components/common/ColoredButton";
import { getMajorsFromState, getPlansFromState } from "../../state";
import { AppState } from "../../state/reducers/state";
import { planToString } from "../../utils";
import { TemplatePageState } from "./Templates";

const Container = styled.div`
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 50px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  overflow: hidden;
`;

const NewTemplatesPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px;
`;

const InputContainer = styled.div`
  width: 326px;
`;

interface TemplatesPageProps {
  readonly setPageState: (pageState: TemplatePageState) => void;
}

interface DropdownProps {
  readonly label: string;
  readonly options: Array<string>;
  readonly value: string | null;
  readonly setValue: (value: string | null) => void;
}

interface NameFieldProps {
  readonly name: string;
  readonly setTemplateName: (name: string) => void;
}

export const NewTemplatesPage: React.FC<TemplatesPageProps> = ({
  setPageState,
}) => {
  const [name, setName] = useState("");
  const [major, setMajor] = useState<string | null>(null);
  const [catalogYear, setCatalogYear] = useState<string | null>(null);
  const [coopCycle, setCoopCycle] = useState<string | null>(null);

  const majors = useSelector((state: AppState) => getMajorsFromState(state));
  const catalogYears = [
    ...Array.from(new Set(majors.map(maj => maj.yearVersion.toString()))),
  ];
  const coopCycles = useSelector((state: AppState) => getPlansFromState(state));
  const buttonSize = 90;
  const disabled = !(name && major && catalogYear && coopCycle);

  return (
    <NewTemplatesPageContainer>
      <Container style={{ fontSize: "24px" }}>
        Let's create a template!
      </Container>
      <InputContainer>
        <NameField name={name} setTemplateName={setName} />
      </InputContainer>
      <Dropdown
        label="Catalog year"
        options={catalogYears}
        value={catalogYear}
        setValue={value => {
          setCatalogYear(value);
          setMajor(null);
          setCoopCycle(null);
        }}
      />
      {catalogYear && (
        <Dropdown
          label="Major"
          options={majors.map(maj => maj.name)}
          value={major}
          setValue={value => {
            setMajor(value);
            setCoopCycle(null);
          }}
        />
      )}
      {major && (
        <Dropdown
          label="Co-op cycle"
          options={coopCycles[major!].map(p => planToString(p))}
          value={coopCycle}
          setValue={setCoopCycle}
        />
      )}
      <ButtonContainer>
        <WhiteColorButton
          onClick={() => setPageState(TemplatePageState.LIST)}
          style={{ width: buttonSize }}
        >
          Previous
        </WhiteColorButton>
        <RedColorButton style={{ width: buttonSize }} disabled={disabled}>
          Next
        </RedColorButton>
      </ButtonContainer>
    </NewTemplatesPageContainer>
  );
};

const NameField: React.FC<NameFieldProps> = ({ name, setTemplateName }) => {
  return (
    <TextField
      id="outlined-basic"
      label="Template name"
      variant="outlined"
      value={name}
      onChange={event => setTemplateName(event.target.value)}
      placeholder=""
      style={{ width: "100%" }}
    />
  );
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  setValue,
}) => {
  return (
    <FormControl variant="outlined">
      <Autocomplete
        style={{ width: 326 }}
        disableListWrap
        options={options}
        renderInput={params => (
          <TextField {...params} variant="outlined" label={label} fullWidth />
        )}
        value={value}
        onChange={(event, newValue: any) => setValue(newValue || null)}
      />
    </FormControl>
  );
};
