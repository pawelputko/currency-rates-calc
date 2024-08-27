import { Component, inject, OnInit} from "@angular/core";
import {MatTableModule} from "@angular/material/table";
import {CurrencyService} from "../../services/currency.service";
import {catchError, EMPTY, finalize, Observable, of, switchMap} from "rxjs";
import {CurrenciesTable, Currency} from "../../models";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatDatepickerInputEvent, MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOption, provideNativeDateAdapter} from "@angular/material/core";
import moment from "moment";
import {MatSelect} from "@angular/material/select";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'currency-rates',
  templateUrl: './currency-rates.component.html',
  styleUrls: ['./currency-rates.component.scss'],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatTableModule, MatDatepickerModule, AsyncPipe, NgIf, MatLabel, MatHint, MatFormField, MatInputModule, MatSelect, MatOption, MatProgressSpinner]
})
export class CurrencyRatesComponent implements OnInit {
  private currencyService = inject(CurrencyService);

  dataSource$: Observable<Currency[]> = of([]);
  displayedColumns = ['symbol', 'name', 'rate'];
  maxDate = moment(new Date()).toDate();
  minDate = moment(new Date('2002-01-02')).toDate();
  plnCurrency: Currency = {code: 'PLN', mid: 1, currency: 'polski złoty'};
  inputCurrency = this.plnCurrency;
  outputCurrency = this.plnCurrency;
  calculatedValue = 1;
  defaultValue = 1;
  isError = false;
  isLoading = false;

  ngOnInit(): void {
    this.dataSource$ = this.fetchCurrencies('');
  }

  fetchCurrencies(date?: string): Observable<Currency[]> {
    this.isLoading = true;
    return this.currencyService.getCurrencyRates(date).pipe(
      switchMap((tableA: CurrenciesTable[]) => {
        return of([...tableA[0].rates, this.plnCurrency]);
      }),
      catchError(() => {
        this.isError = true;
        this.isLoading = false;
        return EMPTY;
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  fetchCurrenciesForDate(event: MatDatepickerInputEvent<Date>): void {
    this.resetExchangeRates();
    const date = moment(event.value).format('YYYY-MM-DD');
    this.dataSource$ = this.fetchCurrencies(date);
  }

  avoidNegativeValue(event: Event): void {
    this.defaultValue = Number((event.target as HTMLInputElement).value);
    if (this.defaultValue <= 0) {
      this.defaultValue = 1;
      this.calculateExchangeRate()
    }
  }

  calculateExchangeRate(event?: Event): void {
    if (event) {
      this.defaultValue = Number((event.target as HTMLInputElement).value);
    }
    if (this.inputCurrency.code === 'PLN') {
      this.calculatedValue = this.defaultValue / this.outputCurrency.mid;
      return;
    }
    this.calculatedValue = this.defaultValue * (this.inputCurrency.mid / this.outputCurrency.mid);
  }

  resetExchangeRates(): void {
    this.inputCurrency = this.outputCurrency = this.plnCurrency;
    this.defaultValue = 1;
    this.calculatedValue = 1;
  }
}
