export interface Schedule {
	classes: ClassMap
	semesters: SemesterMap
}

export interface ClassMap {
	[id: string]: Class
}

export interface Class {
	id: string
	title: string
}

export interface SemesterMap {
	[id: string]: Semester
}

export interface Semester {
	id: string
	title: string
	classIds: string[]
}
