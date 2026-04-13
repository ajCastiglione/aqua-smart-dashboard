/** Laravel-style pagination wrapper from list GET responses */
export type PaginatedResponse<T> = {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type PaginationParams = {
  page?: number
  per_page?: number
}

export type CustomerAlert = {
  CustomerNumber: string
  DateTime: string
  'Sequence#'?: string | null
  Status?: string | null
  Alert?: string | null
}

export type CustomerCrossReference = {
  SerialNumber: string
  Customer_Number: string
  DateTime?: string
}

export type CustomerFlowRateData = {
  CustomerNumber: string
  DateTime: string
  SequenceNumber?: string | null
  Pump_Status?: string | null
  Flow_Rate?: string | null
}

export type CustomerPressureData = {
  CustomerNumber: string
  DateTime: string
  'Sequence#'?: string | null
  Pressure_Reading?: string | null
}

export type CustomerProfile = {
  CustomerNumber: string
  FirstName: string
  LastName: string
  Email?: string | null
  Street: string
  City: string
  State: string
  ZipCode: string
  EmailAddress: string
  PhoneNumber: string
  VendorNumber: string
  VendorName: string
  TechName: string
  SerialNumber: string
  RegistrationDate?: string
  InstallDate?: string
  UpdateDate?: string
  IPAddress: string
}

export type AmPm = 'AM' | 'PM'

export type CustomerProfilePumpCycle = {
  CustomerNumber: string
  SequenceNumber: string
  TimeZone: string
  DayofWeek: string
  StartTime: string
  'Start-AM-PM': AmPm
  EndTime: string
  'End-AM-PM': AmPm
  CleaningCycle: 'Y' | 'N'
  updatedate?: string
}

export type CustomerTempData = {
  Customer_Number: string
  Date: string
  Time: string
  Sequence_Number: string
  Temp_Reading?: string | null
}

export type SerialNumberRecord = {
  SerialNumber: string
  CustomerNumber: string
  DateCreated?: string
  DateRegistered?: string
}

export type VendorProfile = {
  VendorNumber: string
  VendorName: string
  Street: string
  City: string
  State: string
  ZipCode: string
  EmailAddress: string
  PhoneNumber: string
  UpdateDate?: string
}
