import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TradeLinkService {

  private STORAGE_KEY = 'tradeLinkUrl';

  constructor() { }

  setTradeLinkUrl(url: string): void {
    localStorage.setItem(this.STORAGE_KEY, url);
  }

  getTradeLinkUrl(): string {
    return localStorage.getItem(this.STORAGE_KEY) ?? '';
  }

}
