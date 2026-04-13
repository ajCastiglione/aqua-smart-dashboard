export const queryKeys = {
  customerProfiles: (page: number, perPage: number) =>
    ['customerProfiles', { page, perPage }] as const,
  customerProfile: (customerNumber: string) => ['customerProfile', customerNumber] as const,
  customerRowMetrics: (customerNumber: string) => ['customerRowMetrics', customerNumber] as const,
  customerAlerts: (customerNumber: string) => ['customerAlerts', customerNumber] as const,
  customerPressure: (customerNumber: string) => ['customerPressure', customerNumber] as const,
  customerFlowRate: (customerNumber: string) => ['customerFlowRate', customerNumber] as const,
  customerTemp: (customerNumber: string) => ['customerTemp', customerNumber] as const,
  customerPumpCycles: (customerNumber: string) => ['customerPumpCycles', customerNumber] as const,
  vendorProfile: (vendorNumber: string) => ['vendorProfile', vendorNumber] as const,
  serialNumber: (serial: string) => ['serialNumber', serial] as const,
  customerCrossReferences: (customerNumber: string) =>
    ['customerCrossReferences', customerNumber] as const,
}
