import { Client, Quote, QuoteStatus, Subscription, User } from '../types';

const USERS_STORAGE_KEY = 'orcafacil_users_v1';
const CURRENT_USER_KEY = 'orcafacil_current_user_v1';
const CLIENTS_STORAGE_KEY = 'orcafacil_clients_v1';
const QUOTES_STORAGE_KEY = 'orcafacil_quotes_v1';
const DEMO_SEEDED_KEY = 'orcafacil_demo_seeded_v1';

// Safe LocalStorage helpers with try/catch
function safeGetItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Erro ao ler ${key} do localStorage:`, err);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Erro ao salvar ${key} no localStorage:`, err);
  }
}

// Seed demo user
const DEMO_USER: User = {
  id: 'usr_demo_1',
  name: 'Carlos Silva',
  companyName: 'Silva Elétrica & Manutenção',
  email: 'carlos@silvaeletrical.com.br',
  phone: '(11) 98765-4321',
  city: 'São Paulo - SP',
  pixKey: '11987654321',
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
};

// Seed demo clients
const DEMO_CLIENTS: Client[] = [
  {
    id: 'cli_1',
    userId: 'usr_demo_1',
    name: 'Mariana Oliveira',
    phone: '(11) 99123-4567',
    email: 'mariana.oliveira@email.com',
    address: 'Rua das Flores, 142 - Apto 32, Jardins - SP',
    notes: 'Cliente indicada pelo condomínio. Preferência por atendimento no período da manhã.',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'cli_2',
    userId: 'usr_demo_1',
    name: 'Roberto Santos',
    phone: '(11) 98234-5678',
    email: 'roberto.santos@email.com',
    address: 'Av. Paulista, 1000 - Cj 54, Bela Vista - SP',
    notes: 'Escritório de advocacia. Manutenção de quadros de disjuntores.',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'cli_3',
    userId: 'usr_demo_1',
    name: 'Juliana Costa',
    phone: '(11) 97345-6789',
    email: 'juliana.costa@email.com',
    address: 'Rua Harmonia, 580, Vila Madalena - SP',
    notes: 'Reforma de iluminação da sala e cozinha gourmet.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

// Seed demo quotes
const DEMO_QUOTES: Quote[] = [
  {
    id: 'qte_1',
    quoteNumber: 'ORC-0001',
    userId: 'usr_demo_1',
    clientId: 'cli_1',
    serviceTitle: 'Troca de fiação e instalação de tomadas 20A',
    serviceDescription: 'Substituição completa do cabeamento do circuito da cozinha, instalação de 6 tomadas de 20A padrão novo e adequação do disjuntor bipolar no quadro geral.',
    materials: 'Cabo flexível 4mm anti-chama (50m), 6 tomadas 20A Tramontina, 1 disjuntor bipolar 32A Steck, fita isolante 3M.',
    laborCost: 650.00,
    materialsCost: 280.00,
    discount: 50.00,
    subtotal: 930.00,
    total: 880.00,
    validUntil: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    executionDeadline: '1 a 2 dias úteis',
    notes: 'Pagamento: 50% de entrada no início e 50% após a conclusão e teste dos circuitos. Garantia de 90 dias.',
    status: 'aprovado',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'qte_2',
    quoteNumber: 'ORC-0002',
    userId: 'usr_demo_1',
    clientId: 'cli_2',
    serviceTitle: 'Revisão geral do quadro elétrico e iluminação LED',
    serviceDescription: 'Aperto e balanceamento das fases no quadro principal de disjuntores, substituição de 12 lâmpadas fluorescentes por painéis de LED embutidos 18W.',
    materials: '12 painéis LED embutir 18W luz neutra, terminais ilhós, barramento de terra e neutro.',
    laborCost: 1200.00,
    materialsCost: 540.00,
    discount: 0,
    subtotal: 1740.00,
    total: 1740.00,
    validUntil: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    executionDeadline: '3 dias úteis',
    notes: 'Serviço a ser realizado no sábado para não interferir no horário de expediente do escritório.',
    status: 'enviado',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'qte_3',
    quoteNumber: 'ORC-0003',
    userId: 'usr_demo_1',
    clientId: 'cli_3',
    serviceTitle: 'Instalação de spots em sanca de gesso e fita LED',
    serviceDescription: 'Passagem de conduíte flexível na sanca, instalação de 8 spots dicroica LED e 10m de fita LED RGB com fonte blindada e controle remoto.',
    materials: '8 spots LED 5W, 10m fita LED RGB 5050 + fonte 12V 10A, perfil de alumínio para acabamento.',
    laborCost: 850.00,
    materialsCost: 420.00,
    discount: 70.00,
    subtotal: 1270.00,
    total: 1200.00,
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    executionDeadline: '2 dias úteis',
    notes: 'Garantia de 90 dias sobre a mão de obra. Materiais com garantia do fabricante.',
    status: 'rascunho',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

// Initialize storage with demo if empty
export function initStorage(): void {
  if (typeof window === 'undefined') return;

  const seeded = localStorage.getItem(DEMO_SEEDED_KEY);
  if (!seeded) {
    safeSetItem(USERS_STORAGE_KEY, [DEMO_USER]);
    safeSetItem(CURRENT_USER_KEY, DEMO_USER);
    safeSetItem(CLIENTS_STORAGE_KEY, DEMO_CLIENTS);
    safeSetItem(QUOTES_STORAGE_KEY, DEMO_QUOTES);
    localStorage.setItem(DEMO_SEEDED_KEY, 'true');
  }
}

// User / Auth storage helpers
export const authStorage = {
  getCurrentUser(): User | null {
    return safeGetItem<User | null>(CURRENT_USER_KEY, null);
  },

  setCurrentUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      safeSetItem(CURRENT_USER_KEY, user);
      const users = authStorage.getAllUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index >= 0) {
        users[index] = user;
      } else {
        users.push(user);
      }
      safeSetItem(USERS_STORAGE_KEY, users);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  getAllUsers(): User[] {
    return safeGetItem<User[]>(USERS_STORAGE_KEY, [DEMO_USER]);
  },

  login(email: string, _password?: string): User | null {
    const users = authStorage.getAllUsers();
    const found = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (found) {
      authStorage.setCurrentUser(found);
      return found;
    }
    return null;
  },

  register(userData: Omit<User, 'id' | 'createdAt'>): User {
    const users = authStorage.getAllUsers();
    const existing = users.find(u => u.email.trim().toLowerCase() === userData.email.trim().toLowerCase());
    
    if (existing) {
      // Update existing record
      const updated: User = {
        ...existing,
        ...userData,
      };
      authStorage.setCurrentUser(updated);
      return updated;
    }

    const newUser: User = {
      ...userData,
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    authStorage.setCurrentUser(newUser);
    return newUser;
  },

  updateProfile(updates: Partial<User>): User | null {
    const current = authStorage.getCurrentUser();
    if (!current) return null;
    const updated: User = { ...current, ...updates };
    authStorage.setCurrentUser(updated);
    return updated;
  },

  resetToDemo(): void {
    if (typeof window === 'undefined') return;
    const users = authStorage.getAllUsers().filter(u => u.id !== DEMO_USER.id);
    users.unshift(DEMO_USER);
    safeSetItem(USERS_STORAGE_KEY, users);
    safeSetItem(CURRENT_USER_KEY, DEMO_USER);

    // Keep other users' clients and quotes, replace demo clients & quotes
    const allClients = safeGetItem<Client[]>(CLIENTS_STORAGE_KEY, []).filter(c => c.userId !== DEMO_USER.id);
    safeSetItem(CLIENTS_STORAGE_KEY, [...DEMO_CLIENTS, ...allClients]);

    const allQuotes = safeGetItem<Quote[]>(QUOTES_STORAGE_KEY, []).filter(q => q.userId !== DEMO_USER.id);
    safeSetItem(QUOTES_STORAGE_KEY, [...DEMO_QUOTES, ...allQuotes]);

    localStorage.setItem(DEMO_SEEDED_KEY, 'true');
  },

  clearUserData(userId: string): void {
    if (typeof window === 'undefined' || !userId) return;
    const allClients = safeGetItem<Client[]>(CLIENTS_STORAGE_KEY, []).filter(c => c.userId !== userId);
    const allQuotes = safeGetItem<Quote[]>(QUOTES_STORAGE_KEY, []).filter(q => q.userId !== userId);
    safeSetItem(CLIENTS_STORAGE_KEY, allClients);
    safeSetItem(QUOTES_STORAGE_KEY, allQuotes);
  },
};

// Clients Repository
export const clientRepository = {
  async getByUserId(userId: string): Promise<Client[]> {
    const clients = safeGetItem<Client[]>(CLIENTS_STORAGE_KEY, []);
    return clients
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getById(id: string): Promise<Client | null> {
    const clients = safeGetItem<Client[]>(CLIENTS_STORAGE_KEY, []);
    return clients.find(c => c.id === id) || null;
  },

  async create(clientData: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const clients = safeGetItem<Client[]>(CLIENTS_STORAGE_KEY, []);
    const newClient: Client = {
      ...clientData,
      id: 'cli_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    clients.unshift(newClient);
    safeSetItem(CLIENTS_STORAGE_KEY, clients);
    return newClient;
  },

  async update(id: string, updates: Partial<Client>): Promise<Client | null> {
    const clients = safeGetItem<Client[]>(CLIENTS_STORAGE_KEY, []);
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) return null;
    const updated = { ...clients[index], ...updates };
    clients[index] = updated;
    safeSetItem(CLIENTS_STORAGE_KEY, clients);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const clients = safeGetItem<Client[]>(CLIENTS_STORAGE_KEY, []);
    const filtered = clients.filter(c => c.id !== id);
    safeSetItem(CLIENTS_STORAGE_KEY, filtered);
    return true;
  },
};

// Quotes Repository
export const quoteRepository = {
  async getByUserId(userId: string): Promise<Quote[]> {
    const quotes = safeGetItem<Quote[]>(QUOTES_STORAGE_KEY, []);
    return quotes
      .filter(q => q.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getByClientId(clientId: string): Promise<Quote[]> {
    const quotes = safeGetItem<Quote[]>(QUOTES_STORAGE_KEY, []);
    return quotes
      .filter(q => q.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getById(id: string): Promise<Quote | null> {
    const quotes = safeGetItem<Quote[]>(QUOTES_STORAGE_KEY, []);
    return quotes.find(q => q.id === id) || null;
  },

  async getNextQuoteNumber(userId: string): Promise<string> {
    const userQuotes = await quoteRepository.getByUserId(userId);
    let maxSequence = 0;

    for (const q of userQuotes) {
      if (q.quoteNumber) {
        const match = q.quoteNumber.match(/ORC-(\d+)/i);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxSequence) {
            maxSequence = num;
          }
        }
      }
    }

    const nextSequence = maxSequence + 1;
    return `ORC-${nextSequence.toString().padStart(4, '0')}`;
  },

  async create(quoteData: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'updatedAt' | 'subtotal' | 'total'> & { subtotal?: number; total?: number }): Promise<Quote> {
    const quotes = safeGetItem<Quote[]>(QUOTES_STORAGE_KEY, []);
    const quoteNumber = await quoteRepository.getNextQuoteNumber(quoteData.userId);
    const now = new Date().toISOString();

    const laborCost = Math.max(0, Number(Number(quoteData.laborCost || 0).toFixed(2)));
    const materialsCost = Math.max(0, Number(Number(quoteData.materialsCost || 0).toFixed(2)));
    const subtotal = Number((laborCost + materialsCost).toFixed(2));
    const discount = Math.max(0, Number(Number(quoteData.discount || 0).toFixed(2)));
    const total = Math.max(0, Number((subtotal - discount).toFixed(2)));

    const newQuote: Quote = {
      ...quoteData,
      id: 'qte_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      quoteNumber,
      laborCost,
      materialsCost,
      subtotal,
      discount,
      total,
      createdAt: now,
      updatedAt: now,
    };

    quotes.unshift(newQuote);
    safeSetItem(QUOTES_STORAGE_KEY, quotes);
    return newQuote;
  },

  async update(id: string, updates: Partial<Quote>): Promise<Quote | null> {
    const quotes = safeGetItem<Quote[]>(QUOTES_STORAGE_KEY, []);
    const index = quotes.findIndex(q => q.id === id);
    if (index === -1) return null;

    const existing = quotes[index];
    const laborCost = updates.laborCost !== undefined ? Math.max(0, Number(Number(updates.laborCost).toFixed(2))) : existing.laborCost;
    const materialsCost = updates.materialsCost !== undefined ? Math.max(0, Number(Number(updates.materialsCost).toFixed(2))) : existing.materialsCost;
    const discount = updates.discount !== undefined ? Math.max(0, Number(Number(updates.discount).toFixed(2))) : existing.discount;
    const subtotal = Number((laborCost + materialsCost).toFixed(2));
    const total = Math.max(0, Number((subtotal - discount).toFixed(2)));

    const updated: Quote = {
      ...existing,
      ...updates,
      laborCost,
      materialsCost,
      discount,
      subtotal,
      total,
      updatedAt: new Date().toISOString(),
    };

    quotes[index] = updated;
    safeSetItem(QUOTES_STORAGE_KEY, quotes);
    return updated;
  },

  async updateStatus(id: string, status: QuoteStatus): Promise<Quote | null> {
    return quoteRepository.update(id, { status });
  },

  async delete(id: string): Promise<boolean> {
    const quotes = safeGetItem<Quote[]>(QUOTES_STORAGE_KEY, []);
    const filtered = quotes.filter(q => q.id !== id);
    safeSetItem(QUOTES_STORAGE_KEY, filtered);
    return true;
  },
};

// Utilities for formatting
export function formatCurrencyBRL(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  try {
    if (dateStr.includes('-') && dateStr.length === 10) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

export function sanitizePhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('55') && digits.length >= 12) {
    return digits;
  }
  return `55${digits}`;
}

export function buildWhatsAppMessage(
  clientName: string,
  serviceTitle: string,
  total: number,
  validUntil: string,
  executionDeadline: string,
  quoteNumber?: string
): string {
  const formattedTotal = formatCurrencyBRL(total);
  const formattedDate = formatDateBR(validUntil);
  const headerRef = quoteNumber ? ` referente ao orçamento *${quoteNumber}*` : '';

  return `Olá, ${clientName}. Preparei sua proposta comercial${headerRef} para *${serviceTitle}*.

*Valor total:* ${formattedTotal}
*Validade:* ${formattedDate}
*Prazo de execução:* ${executionDeadline}

Confira os detalhes da proposta. Estou à disposição para dúvidas e aprovação!`;
}

export function getWhatsAppShareUrl(phone: string, message: string): string {
  const cleanPhone = sanitizePhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(message);
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

