export interface Calendly {
  initInlineWidget: (options: {
    url: string;
    parentElement: HTMLElement | null;
    prefill?: Record<string, any>;
    utm?: Record<string, any>;
  }) => void;
  initPopupWidget: (options: {
    url: string;
    prefill?: Record<string, any>;
    utm?: Record<string, any>;
  }) => void;
}

declare global {
  interface Window {
    Calendly?: Calendly;
  }
}
