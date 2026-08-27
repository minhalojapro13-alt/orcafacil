export type QuoteStatus = 'rascunho' | 'enviado' | 'aprovado' | 'recusado';

export interface User {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  city?: string;
  pixKey?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface QuoteItem {
  id: string;
  quoteId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quote {
  id: string;
  quoteNumber: string; // e.g. "ORC-0001"
  userId: string;
  clientId: string;
  serviceTitle: string; // "Instalação Elétrica", "Pintura Externa", etc.
  serviceDescription: string;
  materials?: string;
  laborCost: number; // Valor da mão de obra
  materialsCost: number; // Valor dos materiais
  discount: number; // Desconto em R$
  subtotal: number; // laborCost + materialsCost
  total: number; // subtotal - discount
  validUntil: string; // ISO date string or YYYY-MM-DD
  executionDeadline: string; // e.g. "3 a 5 dias úteis"
  notes?: string; // Observações e condições de pagamento
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'Plano Gratuito' | 'Plano Profissional';
  status: 'active' | 'inactive';
  expiresAt?: string;
}

export type ActiveTab = 'dashboard' | 'clients' | 'quotes' | 'profile';

export type ActiveView = 
  | { type: 'tab'; tab: ActiveTab }
  | { type: 'new-quote'; preselectedClientId?: string }
  | { type: 'edit-quote'; quoteId: string }
  | { type: 'quote-detail'; quoteId: string }
  | { type: 'quote-pdf'; quoteId: string }
  | { type: 'client-detail'; clientId: string };
