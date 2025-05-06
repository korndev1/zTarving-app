export interface register {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface checkEmail {
  email: string;
}

export interface MeasureData {
  createAt: string;
  id:number;
  name: string;
  short_forn: string;
  updateAt: string;
}
