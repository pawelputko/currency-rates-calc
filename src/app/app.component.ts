import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrencyRatesComponent, HeaderComponent } from "../components";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CurrencyRatesComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Currency rates calculator';
}
