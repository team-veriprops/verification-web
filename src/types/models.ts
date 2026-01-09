export enum TransactionCurrency {
  NGN = "NGN",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

export enum Language {
  ENGLISH = "en-US",
  FRENCH = "FR",
}

export class Money {
  private value: number;
  private currency: TransactionCurrency;

  constructor(value: number = 0.0, currency: TransactionCurrency) {
    this.value = value;
    this.currency = currency;
  }

  static from(obj: { value: number; currency: TransactionCurrency }): Money {
    return new Money(obj.value, obj.currency);
  }

  getValue(): number {
    return this.value;
  }

  getCurrency(): TransactionCurrency {
    return this.currency;
  }

  plus(money: Money): Money {
    this.validateCurrency(money.getCurrency());
    this.validateNegativeCredit(money.getValue());
    return new Money(this.value + money.getValue(), this.currency);
  }

  minus(money: Money): Money {
    this.validateDebitBalance(money.getValue());
    this.validateCurrency(money.getCurrency());
    this.validateNegativeDebit(money.getValue());
    return new Money(this.value - money.getValue(), this.currency);
  }

  compare(other: Money): number {
    this.validateCurrency(other.getCurrency());

    if (isNaN(this.value) || isNaN(other.getValue())) return NaN;
    if (this.value < other.getValue()) return -1;
    if (this.value > other.getValue()) return 1;
    return 0;
  }

  isLessThan(other: Money): boolean {
    return this.compare(other) < 0;
  }

  isLessThanEquals(other: Money): boolean {
    return this.compare(other) <= 0;
  }

  isGreaterThan(other: Money): boolean {
    return this.compare(other) > 0;
  }

  isGreaterThanEquals(other: Money): boolean {
    return this.compare(other) >= 0;
  }

  isEqualTo(other: Money): boolean {
    return this.compare(other) === 0;
  }

  private validateCurrency(currency: TransactionCurrency): void {
    if (this.currency !== currency) {
      throw new Error("Money exception: currency mismatch");
    }
  }

  private validateNegativeCredit(amount: number): void {
    if (amount < 0) {
      throw new Error("Money exception: negative credit amount");
    }
  }

  private validateNegativeDebit(amount: number): void {
    if (amount < 0) {
      throw new Error("Money exception: negative debit amount");
    }
  }

  private validateDebitBalance(amount: number): void {
    if (this.value < 0 || this.value < amount) {
      throw new Error("Money exception: insufficient balance");
    }
  }
}

export enum PropertyType {
  LAND = "land",
  STRUCTURE = "structure",
}

export interface Measurement {
  value: number;
  unit: MeasurementUnit;
}

export enum MeasurementUnit {
  METER = "meter",
  SQM = "sqm",
  FEET = "feet",
  SQF = "sqf",
}

export interface ExactLocation {
    address: string;
    country: string;
    state: string;
    city: string;
    grouping_city?: string;
    area: string;
    coordinates?: { lat: number; lng: number };
  };

export interface BaseQueryDto {
  id?: string;                    // Unique ID
  date_updated?: string;         // ISO Date string (e.g. 2024-07-02T12:34:56Z)
  updated_by?: string;           // Who updated the record
  deleted?: boolean;             // Whether deleted
  date_deleted?: string;         // ISO Date string
  deleted_by?: string;           // Who deleted the record
  date_created?: string;         // ISO Date string
  created_by?: string;           // Who created the record
  version?: number;              // The current version number of the record
}

export interface Page<T> {
  items: T[];               // List of items of type T
  page: number;            // Current page number
  page_size: number;       // Number of items per page
  count: number;           // Number of items returned in this page
  total: number;           // Total number of items available
  total_pages: number;     // Total number of pages for the total data
  prev_page?: number;      // Previous page number, if any
  next_page?: number;      // Next page number, if any
}

export interface PageRequest {
  page?: number;                  // Default: 0
  page_size?: number;            // Default: 10
  // total_page?: number;           // Total record pages
  query_fields?: string;         // Comma-separated list of return fields
  exact_string_values?: boolean; // Default: true
  order_by?: string;             // e.g. "username asc, firstname desc"
  where?: string;                // e.g. "date_created >="
  query?: string;                // e.g A four bedroom duplex in enugu state
}

export interface PageDetails {
  title: string;
  description: string;
  active_tab?: string;
}
