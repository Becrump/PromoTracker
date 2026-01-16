
export enum PromotionStatus {
  APPROVED = 'APPROVED',
  WAITING = 'WAITING',
  DENIED = 'DENIED',
  NONE = 'NONE'
}

export interface PromoEntry {
  pkg: string;
  cost: string;
  srp: string;
  notes: string;
  status: PromotionStatus;
}

export type Month = 'JANUARY' | 'FEBRUARY' | 'MARCH' | 'APRIL' | 'MAY' | 'JUNE' | 'JULY' | 'AUGUST' | 'SEPTEMBER' | 'OCTOBER' | 'NOVEMBER' | 'DECEMBER';

export const MONTHS: Month[] = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

export interface ChainConfig {
  id: string;
  name: string;
}

export interface ChainPromotion {
  id: string;
  months: {
    [month: string]: PromoEntry;
  };
}

export interface PromoState {
  [chainId: string]: ChainPromotion[];
}

export interface LibraryPromotion {
  id: string;
  name: string;
  pkg: string;
  cost: string;
  srp: string;
}

export interface SavedSession {
  id: string;
  timestamp: number;
  name: string;
  data: PromoState;
}
