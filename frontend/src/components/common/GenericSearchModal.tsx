import React, { FunctionComponent, useEffect, useState } from "react";
import { Checkbox, LinearProgress } from "@material-ui/core";
import { RedColorButton } from "../../components/common/ColoredButtons";
import { DefaultModal } from "../../components/common/DefaultModal";
import { Search } from "../../components/common/Search";
import styled from "styled-components";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const SearchContainer = styled.div`
  width: 100%;
`;
const DeletePlanContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const SearchResultsScrollContainer = styled.div`
  height: 200px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
  border: 1px solid red;
  border-radius: 10px;
  overflow-y: scroll;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
`;

const Loading = styled.div`
  font-size: 10px;
  line-height: 10px;
  margin-top: 10px;
  margin-bottom: 5px;
  margin-left: 10px;
  margin-right: 10px;
`;

const NoResultContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  margin-left: 15px;
  margin-right: 30px;
`;

const LoadMoreText = styled.div`
  font-size: 10px;
  line-height: 21px;
  margin: 10px;
  color: red;
  &:hover {
    text-decoration: underline;
  }
  cursor: pointer;
`;

const NoMoreText = styled.div`
  font-size: 10px;
  line-height: 21px;
  margin: 10px;
  color: red;
`;

export interface OptionsProps<T, S> {
  item: T;
  selected: S | null;
  setSelected: (selected: S | null) => void;
  searchQuery?: string;
}

export interface AssignTemplateModalProps<S> {
  isOpen: boolean;
  closeModal: () => void;
  onClose: (selected: S, shouldDelete: boolean) => void;
}

interface GenericProps<T, S> extends AssignTemplateModalProps<S> {
  fetchList: (
    currentList: T[],
    searchQuery: string,
    page: number,
    setIsLoading: (loading: boolean) => void,
    setResponse: (response: any, newList: T[]) => void
  ) => void;
  RenderItem: FunctionComponent<OptionsProps<T, S>>;
  showDeleteOption: boolean;
  itemText: string;
}

export function GenericSearchAssignModal<T, S>({
  isOpen,
  closeModal,
  onClose,
  fetchList,
  RenderItem,
  showDeleteOption,
  itemText,
}: GenericProps<T, S>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayList, setDisplayList] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [selected, setSelected] = useState<S | null>(null);
  const [shouldDelete, setShouldDelete] = useState(false);

  const setResponse = (studentsAPI: any, nextList: T[]) => {
    setDisplayList(nextList);
    setPageNumber(studentsAPI.nextPage);
    setIsLastPage(studentsAPI.lastPage);
  };

  useEffect(() => {
    setDisplayList([]);
    fetchList([], searchQuery, 0, setIsLoading, setResponse);
  }, [searchQuery]);

  const renderStudentList = () => {
    return (
      <SearchResultsScrollContainer>
        {isLoading ? (
          <Loading>
            <LinearProgress color="secondary" />
          </Loading>
        ) : displayList.length === 0 ? (
          <NoResultContainer> No results </NoResultContainer>
        ) : (
          displayList.map(item => (
            <RenderItem
              item={item}
              selected={selected}
              setSelected={setSelected}
              searchQuery={searchQuery}
            />
          ))
        )}
        {isLastPage ? (
          <NoMoreText>No more {itemText}</NoMoreText>
        ) : (
          <LoadMoreText
            onClick={() =>
              fetchList(
                displayList,
                searchQuery,
                pageNumber,
                setIsLoading,
                setResponse
              )
            }
          >
            Load more {itemText}
          </LoadMoreText>
        )}
      </SearchResultsScrollContainer>
    );
  };

  return (
    <DefaultModal isOpen={isOpen} onClose={closeModal} title={"Assign to"}>
      <SearchContainer>
        <Search
          placeholder={`Search for ${itemText}`}
          onEnter={setSearchQuery}
          isSmall={true}
        />
      </SearchContainer>
      {renderStudentList()}
      {showDeleteOption && (
        <DeletePlanContainer>
          <Checkbox
            onChange={e => setShouldDelete(e.target.checked)}
            checkedIcon={<CheckBoxIcon style={{ color: "#EB5757" }} />}
          />{" "}
          Delete Template Plan on Assign
        </DeletePlanContainer>
      )}
      <RedColorButton
        onClick={() => {
          closeModal();
          onClose(selected!, shouldDelete);
        }}
        disabled={selected === null}
      >
        {"   Assign   "}
      </RedColorButton>
    </DefaultModal>
  );
}
