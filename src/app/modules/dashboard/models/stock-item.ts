import { StockItemRaw } from './stock-item-raw';

export interface StockItem extends StockItemRaw {
  s: string;
  d: number;
}
