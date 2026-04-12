export type CalculateNightAllowanceResult = {
  grossSalary: number
  contractualHours: number
  workedHours: number
  percentageAllowance: number
  hourValue: number
  nightHoursWorked: number
  allowanceValue: number
  rsrDsr: number
  hourWithAllowance: number
  totalAllowanceDue: number
}

export type NightAllowanceParams = {
  grossSalary: number
  contractualHours: number
  workedHours: number
  minutes: number
  percentageAllowance: number
  usefulDays: number
  holidaysAndSundays: number
  isRural: boolean
  isNighttimeWork: boolean
}
