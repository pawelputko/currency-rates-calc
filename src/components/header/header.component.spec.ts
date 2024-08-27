import {TestBed} from "@angular/core/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {HeaderComponent} from "./header.component";

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, NoopAnimationsModule],
    }).compileComponents();
  });

  it('should create the component', () => {
    // given
    const fixture = TestBed.createComponent(HeaderComponent);
    const headerComponent = fixture.componentInstance;

    // then
    expect(headerComponent).toBeTruthy();
  });

  it(`should have the 'Currency rates calculator' title`, () => {
    // given
    const fixture = TestBed.createComponent(HeaderComponent);
    const headerComponent = fixture.componentInstance;
    headerComponent.title = 'Currency rates calculator';

    // when
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // then
    expect(compiled.querySelector('h1')?.textContent).toContain('Currency rates calculator');
  });
});
