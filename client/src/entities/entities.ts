//types 
export interface PeripheralDevice {
  uid: number;
  vendor: string;
  created: Date;
  status: ["online", "offline"];
  _id: string;
}

export interface Gateway {
  serialNumber: string;
  name: string;
  ipAddress: string;
  devices: Array<PeripheralDevice>;
  _id: string;
}
