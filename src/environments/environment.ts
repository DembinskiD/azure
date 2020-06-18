// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // weatherUrl: 'https://api.weatherapi.com/v1/current.json',
  weatherUrl: 'https://weatherfunctionforproject.azurewebsites.net/api/readWeather?code=2eYxF0Ouezkr/auK5YxLUL2JqGwzQu4gPSOHRLbghIaDmHaW5kkeGQ==',
  weatherKey: '55b16e526c4841768fd92607200506',
  currencyExchangeUrl: 'https://exchangeratesforproject.azurewebsites.net/api/getRates?code=jxPYVDVy0Uhs3TaIDOm/LSfSOxAiZMMEZwxzIKDyX8KY9spqjJaMJw==',
  currencyExchangeKey: '',
  stockUrl: 'https://stockforproject.azurewebsites.net/api/readFromDB?code=5vILXx059fFR8tXt1gsK42PfpkgS5YgaBIbuB2hcj9xXZnuG/t8n1w==',
  stockKey: 'brd13mvrh5r9c4bslc90'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
