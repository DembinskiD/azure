import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WeatherConditions } from './models/weather-conditions';
import { ExchangeRate } from './models/exchange-rate';
import { parseString } from 'xml2js';
import { StockItemRaw } from './models/stock-item-raw';
import { environment } from 'src/environments/environment';
import { StockItem } from './models/stock-item';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  getWeatherConditions(city: string): Observable<WeatherConditions> {
    const params = new HttpParams()
      // .set('key', environment.weatherKey)
      .set('city', city);

      // return this.http.get<WeatherConditions>(environment.weatherUrl);

    return this.http.get<WeatherConditions>(environment.weatherUrl, {
      params: params,
    });
  }

  getExchangeRates(): Observable<ExchangeRate[]> {
    return this.http
      .get(environment.currencyExchangeUrl, { responseType: 'text' })
      .pipe(map((response) => this.extractExchangeRates(response)));
  }

  getStockItem(symbol: string): Observable<StockItem> {
    const params = new HttpParams()
      // .set('token', environment.stockKey)
      .set('symbol', symbol);

    return this.http
      .get<StockItemRaw>(environment.stockUrl, { params: params })
      .pipe(
        map((response) => ({
          ...response,
          s: symbol,
          d: response.c - response.pc,
        }))
      );
  }

  private extractExchangeRates(content: string): ExchangeRate[] {
    var exchangeRates: ExchangeRate[] = [];
    parseString(content, function (err, result) {
      var cubes = result['gesmes:Envelope'].Cube[0].Cube[0].Cube;
      for (var cube of cubes) {
        exchangeRates.push({
          currency: cube.$.currency,
          rate: cube.$.rate,
        });
      }
    });

    return exchangeRates;
  }
}
