/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	AbuseReport = "abuse_report",
	CompanyProfile = "company_profile",
	Contact = "contact",
	Jobs = "jobs",
	ResumeEducation = "resume_education",
	ResumeExperience = "resume_experience",
	Resumes = "resumes",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated: IsoAutoDateString
}

export type MfasRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	method: string
	recordRef: string
	updated: IsoAutoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated: IsoAutoDateString
}

export type SuperusersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type AbuseReportRecord = {
	created: IsoAutoDateString
	description?: string
	id: string
	job_id?: RecordIdString
	reason: string
	updated: IsoAutoDateString
}

export type CompanyProfileRecord = {
	company_description?: string
	company_name: string
	created: IsoAutoDateString
	facebook?: string
	id: string
	instagram?: string
	linkedin?: string
	logo?: FileNameString
	updated: IsoAutoDateString
	user_id: RecordIdString
	website?: string
}

export type ContactRecord = {
	created: IsoAutoDateString
	email: string
	id: string
	message: string
	name: string
	updated: IsoAutoDateString
}

export enum JobsStatusOptions {
	"ACTIVE" = "ACTIVE",
	"PENDING" = "PENDING",
	"PAUSED" = "PAUSED",
	"FINALIZED" = "FINALIZED",
}
export type JobsRecord = {
	application_type: string
	application_value: string
	category: string
	company_name?: string
	company_profile?: RecordIdString
	company_user_id: RecordIdString
	created: IsoAutoDateString
	description: HTMLString
	employment_type: string
	expires_at: IsoDateString
	id: string
	location?: string
	salary: string
	status: JobsStatusOptions
	title: string
	updated: IsoAutoDateString
	url?: string
	work_mode: string
}

export type ResumeEducationRecord<Teducations = unknown> = {
	created: IsoAutoDateString
	educations?: null | Teducations
	id: string
	resume: RecordIdString
	updated: IsoAutoDateString
}

export type ResumeExperienceRecord<Texperiences = unknown> = {
	created: IsoAutoDateString
	experiences?: null | Texperiences
	id: string
	resume: RecordIdString
	updated: IsoAutoDateString
}

export type ResumesRecord<Tlanguages = unknown, Tlayout = unknown, Tskills = unknown, TsocialLinks = unknown> = {
	created: IsoAutoDateString
	email: string
	headline: string
	id: string
	isDefault?: boolean
	isPublic?: boolean
	languages?: null | Tlanguages
	layout?: null | Tlayout
	location?: string
	name: string
	phone: string
	photo?: FileNameString
	skills?: null | Tskills
	socialLinks?: null | TsocialLinks
	summary: string
	title?: string
	updated: IsoAutoDateString
	user: RecordIdString
}

export enum UsersRoleOptions {
	"company" = "company",
	"candidate" = "candidate",
}
export type UsersRecord = {
	avatar?: FileNameString
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	role: UsersRoleOptions
	tokenKey: string
	updated: IsoAutoDateString
	username: string
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AbuseReportResponse<Texpand = unknown> = Required<AbuseReportRecord> & BaseSystemFields<Texpand>
export type CompanyProfileResponse<Texpand = unknown> = Required<CompanyProfileRecord> & BaseSystemFields<Texpand>
export type ContactResponse<Texpand = unknown> = Required<ContactRecord> & BaseSystemFields<Texpand>
export type JobsResponse<Texpand = unknown> = Required<JobsRecord> & BaseSystemFields<Texpand>
export type ResumeEducationResponse<Teducations = unknown, Texpand = unknown> = Required<ResumeEducationRecord<Teducations>> & BaseSystemFields<Texpand>
export type ResumeExperienceResponse<Texperiences = unknown, Texpand = unknown> = Required<ResumeExperienceRecord<Texperiences>> & BaseSystemFields<Texpand>
export type ResumesResponse<Tlanguages = unknown, Tlayout = unknown, Tskills = unknown, TsocialLinks = unknown, Texpand = unknown> = Required<ResumesRecord<Tlanguages, Tlayout, Tskills, TsocialLinks>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	abuse_report: AbuseReportRecord
	company_profile: CompanyProfileRecord
	contact: ContactRecord
	jobs: JobsRecord
	resume_education: ResumeEducationRecord
	resume_experience: ResumeExperienceRecord
	resumes: ResumesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	abuse_report: AbuseReportResponse
	company_profile: CompanyProfileResponse
	contact: ContactResponse
	jobs: JobsResponse
	resume_education: ResumeEducationResponse
	resume_experience: ResumeExperienceResponse
	resumes: ResumesResponse
	users: UsersResponse
}

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
	// Omit AutoDate fields
	[K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
		// Convert FileNameString to File
		T[K] extends infer U ? 
			U extends (FileNameString | FileNameString[]) ? 
				U extends unknown[] ? File[] : File 
			: U
		: never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString
	email: string
	emailVisibility?: boolean
	password: string
	passwordConfirm: string
	verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string
	emailVisibility?: boolean
	oldPassword?: string
	password?: string
	passwordConfirm?: string
	verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>
} & PocketBase
