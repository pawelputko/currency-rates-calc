export interface CurrenciesTable {
  effectiveDate: string;
  no: string;
  rates: Currency[];
  table: 'A' | 'B';
}

export interface Currency {
  currency: string;
  code: string;
  mid: number;
}
