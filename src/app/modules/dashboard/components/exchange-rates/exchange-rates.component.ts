import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ExchangeRate } from '../../models/exchange-rate';
import { DashboardService } from '../../dashboard.service';
import { tap, finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ServiceBusClient, ReceiveMode } from "@azure/service-bus";
import { async } from '@angular/core/testing';


@Component({
  selector: 'app-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.css'],
})
export class ExchangeRatesComponent
  implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ExchangeRate>;
  dataSource: MatTableDataSource<ExchangeRate>;
  loading = false;
  displayedColumns = ['flag', 'currency', 'rate'];
  private unsubscribe$ = new Subject<void>();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<ExchangeRate>();

    this.loading = true;

    const sBClient = ServiceBusClient.createFromConnectionString("Endpoint=sb://exchangedatasbus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=sRj1kyt44p0Rc82MZXKn3ISRhPkEsa7iCTa8oIfqnD4=");
    // const queueClient = sBClient.createQueueClient("ratesqueue");
    // const receiver = queueClient.createReceiver(ReceiveMode.peekLock);
    this.dashboardService
      .getExchangeRates()
      .pipe(
        tap((result) => (this.dataSource.data = result)),
        finalize(() => (this.loading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }
  //   const msgHandler = async (message) => {
      
  //   };
  //   const errHandler = (error) => {
  //     console.log(error);
  //   };

  //   receiver.registerMessageHandler(msgHandler, errHandler);

  // }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getSymbol(exchangeRate: ExchangeRate): string {
    return (
      'https://projectongoingicons.blob.core.windows.net/flags/' +
      exchangeRate.currency.toLowerCase() +
      '.png'
    );
  }
}
