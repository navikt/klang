interface IIdentifikator {
  type: string;
  identifikasjonsnummer: string;
}

export interface IName {
  fornavn?: string;
  etternavn?: string;
}

export interface IUser {
  navn: IName;
  folkeregisteridentifikator?: IIdentifikator;
}
