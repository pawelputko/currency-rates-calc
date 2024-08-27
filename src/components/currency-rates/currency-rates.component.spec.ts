import {ComponentFixture, TestBed} from "@angular/core/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {CurrencyRatesComponent} from "./currency-rates.component";
import {CurrencyService} from "../../services/currency.service";
import {of} from "rxjs";
import {CurrenciesTable} from "../../models";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import moment from "moment/moment";

const data: CurrenciesTable[] = [{
  effectiveDate: '',
  no: '',
  rates: [
    {code: 'EUR', mid: 4.28, currency: 'euro'}
  ],
  table: 'A',
}];

describe('CurrencyRatesComponent', () => {
  let currencyService: CurrencyService;
  let component: CurrencyRatesComponent;
  let fixture: ComponentFixture<CurrencyRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyRatesComponent, NoopAnimationsModule],
      providers: [provideHttpClient(),provideHttpClientTesting(), CurrencyService]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyRatesComponent);
    component = fixture.componentInstance;
    currencyService = TestBed.inject(CurrencyService);
  });

  it('should set dataSource$', () => {
    // given
    spyOn(currencyService, 'getCurrencyRates').and.returnValue(of(data));

    // when
    component.ngOnInit();

    // then
    component.dataSource$.subscribe(res=> {
      expect(res).toEqual([
        {code: 'EUR', mid: 4.28, currency: 'euro'},
        {code: 'PLN', mid: 1, currency: 'polski złoty'}
      ]);
    });
  });

  it('should call getCurrencyRates method', () => {
    // given
    const spy = spyOn(currencyService, 'getCurrencyRates').and.returnValue(of(data));

    // when
    component.fetchCurrencies();

    // then
    expect(spy).toHaveBeenCalled();
  });

  it('should call getCurrencyRates with date', () => {
    // given
    const spy = spyOn(currencyService, 'getCurrencyRates').and.returnValue(of(data));
    const event = {value: new Date()} as MatDatepickerInputEvent<Date>;
    const date = moment(event.value).format('YYYY-MM-DD');

    // when
    component.fetchCurrenciesForDate(event);

    // then
    expect(spy).toHaveBeenCalledWith(date);
  });

  it('should set defaultValue to 1 if input is less than 0', () => {
    // given
    const spy = spyOn(component, 'calculateExchangeRate');
    const event: unknown = {
      target: {
        value: -123,
      }
    }

    // when
    component.avoidNegativeValue(event as Event);

    // then
    expect(component.defaultValue).toEqual(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should calculate rate for PLN/EUR', () => {
    // given
    component.inputCurrency = component.plnCurrency;
    component.outputCurrency = data[0].rates[0];
    const expectedValue = component.defaultValue / component.outputCurrency.mid;

    // when
    component.calculateExchangeRate();

    // then
    expect(component.calculatedValue).toEqual(expectedValue);
  });

  it('should calculate rate for EUR/PLN', () => {
    // given
    component.outputCurrency = component.plnCurrency;
    component.inputCurrency = data[0].rates[0];
    const expectedValue = component.defaultValue * (component.inputCurrency.mid / component.outputCurrency.mid);

    // when
    component.calculateExchangeRate();

    // then
    expect(component.calculatedValue).toEqual(expectedValue);
  });

  it('should reset all default data', () => {
    // given
    component.inputCurrency = data[0].rates[0];
    component.defaultValue = 321;
    component.calculatedValue = 123;

    // when
    component.resetExchangeRates();

    // then
    expect(component.inputCurrency).toEqual(component.plnCurrency);
    expect(component.defaultValue).toEqual(1);
    expect(component.calculatedValue).toEqual(1);
  });
});
