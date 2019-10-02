import React from 'react'
import './App.css'
import SemesterBlock from './components/SemesterBlock'
import { DragDropContext } from 'react-beautiful-dnd'
import { mockData } from './data/mockData'
import { Semester, Schedule } from './models'
import styled from 'styled-components'
import { Year } from './components/Year/Year'

const Container = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: start;
	align-items: start;
	margin: 30px;
	background-color: '#ff76ff';
`

const ButtonWrapper = styled.div`
	display: flex;
	flex-direction: row;
	margin-bottom: 12px;
`

const Button = styled.button`
	width: 100px;
	border 1px solid black;
	padding: 8px;
	margin-right: 20px;
`

const ButtonText = styled.div`
	text-align: center;
`

interface AppState {
	schedule: Schedule
}

export default class App extends React.Component<{}, AppState> {
	constructor(props: any) {
		super(props)

		this.state = { schedule: mockData }
	}

	onDragEnd = (result: any) => {
		const { destination, source, draggableId } = result

		if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
			return
		}

		const startSemester = this.state.schedule.semesters[source.droppableId]
		const finishSemester = this.state.schedule.semesters[destination.droppableId]

		if (startSemester === finishSemester) {
			const newClassOrder = Array.from(startSemester.classIds)
			newClassOrder.splice(source.index, 1)
			newClassOrder.splice(destination.index, 0, draggableId)

			const newSemester: Semester = {
				...startSemester,
				classIds: newClassOrder
			}

			const newState: AppState = {
				...this.state,
				schedule: {
					...this.state.schedule,
					semesters: {
						...this.state.schedule.semesters,
						[newSemester.id]: newSemester
					}
				}
			}

			this.setState(newState)
			return
		}

		const startClassIds = Array.from(startSemester.classIds)
		startClassIds.splice(source.index, 1)
		const newStartSemester: Semester = {
			...startSemester,
			classIds: startClassIds
		}

		const finishClassIds = Array.from(finishSemester.classIds)
		finishClassIds.splice(destination.index, 0, draggableId)
		const newFinishSemester: Semester = {
			...finishSemester,
			classIds: finishClassIds
		}

		const newState: AppState = {
			...this.state,
			schedule: {
				...this.state.schedule,
				semesters: {
					...this.state.schedule.semesters,
					[newStartSemester.id]: newStartSemester,
					[newFinishSemester.id]: newFinishSemester
				}
			}
		}

		this.setState(newState)
	}

	render() {
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<Container>
					<div>
						<h2>Plan Of Study</h2>
					</div>
					<ButtonWrapper>
						<Button onClick={() => {}}>
							<ButtonText>Add a class</ButtonText>
						</Button>
						<Button onClick={() => {}}>
							<ButtonText>Search</ButtonText>
						</Button>
					</ButtonWrapper>
					<Year index={0} schedule={this.state.schedule}></Year>
					<Year index={1} schedule={this.state.schedule}></Year>
					{/* <Year index={2} schedule={this.state.schedule}></Year>
					<Year index={3} schedule={this.state.schedule}></Year> */}
				</Container>
			</DragDropContext>
		)
	}
}
