import {CurrencyService} from "./currency.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestBed} from "@angular/core/testing";
import {CurrenciesTable} from "../models";

const data: CurrenciesTable[] = [{
  effectiveDate: '',
  no: '',
  rates: [
    {code: 'EUR', mid: 4.28, currency: 'euro'}
  ],
  table: 'A',
}]

describe("Currency Service", () => {
  let currencyService: CurrencyService
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService],
    });

    currencyService = TestBed.inject(CurrencyService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("service should have created successfully", () => {
    expect(currencyService).toBeTruthy();
  });

  it("should retrieve currency rates", () => {
    //Invokes the findAllCourses method on the coursesService. This is the method being tested.
    currencyService.getCurrencyRates('').subscribe(rates => {
      expect(rates).toBeTruthy();
    });
    const apiReq = httpTestingController.expectOne('https://api.nbp.pl/api/exchangerates/tables/A/');

    expect(apiReq.cancelled).toBeFalsy();
    expect(apiReq.request.method).toBe("GET");
    expect(apiReq.request.responseType).toBe('json');

    apiReq.flush({payload: Object.values(data)});
  });

  it("should retrieve currency rates for exact date", () => {
    //Invokes the findAllCourses method on the coursesService. This is the method being tested.
    currencyService.getCurrencyRates('2024-08-23').subscribe(rates => {
      expect(rates).toBeTruthy();
    });
    const apiReq = httpTestingController.expectOne('https://api.nbp.pl/api/exchangerates/tables/A/2024-08-23');

    expect(apiReq.cancelled).toBeFalsy();
    expect(apiReq.request.method).toBe("GET");
    expect(apiReq.request.responseType).toBe('json');

    apiReq.flush({payload: Object.values(data)});
  });
});
