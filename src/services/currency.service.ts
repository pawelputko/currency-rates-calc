import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CurrenciesTable} from "../models";

const NBP_API_URL = 'https://api.nbp.pl/api/exchangerates/tables'

@Injectable({providedIn: 'root'})
export class CurrencyService {
  private httpClient = inject(HttpClient);

  getCurrencyRates(date?: string): Observable<CurrenciesTable[]> {
    return this.httpClient.get<CurrenciesTable[]>(`${NBP_API_URL}/A/${date}`);
  }
}
