import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { WeatherConditions } from '../../models/weather-conditions';
import { Observable } from 'rxjs';

interface City {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  cities: City[] = [
    { viewValue: 'Washington', value: 'washington' },
    { viewValue: 'Berlin', value: 'berlin' },
    { viewValue: 'Tokyo', value: 'tokyo' },
    { viewValue: 'Shanghai', value: 'shanghai' },
    { viewValue: 'Paris', value: 'paris' },
    { viewValue: 'New York', value: 'new_york' },
    { viewValue: 'Warsaw', value: 'warsaw' },
    { viewValue: 'Wroclaw', value: 'wroclaw' },
    { viewValue: 'Poznan', value: 'poznan' },
  ];
  selectedCity: string = this.cities[0].value;
  weatherConditions$: Observable<WeatherConditions>;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.onCityChanged();
  }

  onCityChanged() {
    this.weatherConditions$ = this.dashboardService.getWeatherConditions(
      this.selectedCity
    );
  }
}
