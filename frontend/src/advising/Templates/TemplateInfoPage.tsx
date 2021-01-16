import { TextField, FormControl } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect } from "react";
import { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import {
  WhiteColorButton,
  RedColorButton,
} from "../../components/common/ColoredButtons";
import { IFolderData } from "../../models/types";
import {
  createTemplate,
  getTemplates,
  TemplatesAPI,
} from "../../services/TemplateService";
import {
  getAdvisorUserIdFromState,
  getMajorsFromState,
  getPlansFromState,
} from "../../state";
import { addNewPlanAction } from "../../state/actions/userPlansActions";
import { AppState } from "../../state/reducers/state";
import {
  generateBlankCoopPlan,
  generateYearlessSchedule,
  planToString,
} from "../../utils";

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
  gap: 25px;
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

export const NewTemplatesPage: React.FC<RouteComponentProps<{}>> = ({
  history,
}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [major, setMajor] = useState<string | null>(null);
  const [catalogYear, setCatalogYear] = useState<string | null>(null);
  const [coopCycle, setCoopCycle] = useState<string | null>(null);
  const [folders, setFolders] = useState<IFolderData[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  const fetchTemplates = () => {
    getTemplates(userId)
      .then((response: TemplatesAPI) => {
        setFolders(response.templates);
      })
      .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const { majors, userId, allCoopCycles } = useSelector(
    (state: AppState) => ({
      userId: getAdvisorUserIdFromState(state),
      majors: getMajorsFromState(state),
      allCoopCycles: getPlansFromState(state),
    }),
    shallowEqual
  );
  const catalogYears = [
    ...Array.from(new Set(majors.map(maj => maj.yearVersion.toString()))),
  ];
  const buttonSize = 90;
  const disabled = !(name && major && catalogYear && selectedFolderId !== null);
  const onSubmit = async () => {
    let schedule, courseCounter;
    if (!!coopCycle) {
      [schedule, courseCounter] = generateBlankCoopPlan(
        major!,
        coopCycle!,
        allCoopCycles
      );
    } else {
      schedule = generateYearlessSchedule([], 4);
      courseCounter = 0;
    }

    const response = await createTemplate(userId!, {
      name: name,
      schedule: schedule,
      major: major,
      coop_cycle: coopCycle,
      course_counter: courseCounter,
      catalog_year: catalogYear ? Number(catalogYear) : null,
      folder_id: selectedFolderId,
      folder_name:
        folders.find(folder => selectedFolderId === folder.id)?.name || null,
    });
    dispatch(addNewPlanAction(response.templatePlan));
    return response.templatePlan.id;
  };
  return (
    <NewTemplatesPageContainer>
      <Container style={{ fontSize: "24px" }}>
        Let's create a template!
      </Container>
      <InputContainer>
        <NameField name={name} setTemplateName={setName} />
      </InputContainer>
      <FormControl variant="outlined">
        <Autocomplete
          style={{ width: 326 }}
          disableListWrap
          getOptionLabel={option => option.name}
          options={folders}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label={"Save Plan in Folder"}
              fullWidth
            />
          )}
          onChange={(event, newValue: any) =>
            setSelectedFolderId(newValue.id || null)
          }
        />
      </FormControl>
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
          options={allCoopCycles[major!].map(p => planToString(p))}
          value={coopCycle}
          setValue={setCoopCycle}
        />
      )}
      <ButtonContainer>
        <Link
          to={{ pathname: "/advisor/templates/" }}
          style={{ textDecoration: "none" }}
        >
          <WhiteColorButton style={{ width: buttonSize, marginRight: "20px" }}>
            Previous
          </WhiteColorButton>
        </Link>
        <RedColorButton
          onClick={async () => {
            const planId = await onSubmit();
            history.push(`/advisor/templates/templateBuilder/${planId}`);
          }}
          style={{ width: buttonSize }}
          disabled={disabled}
        >
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
