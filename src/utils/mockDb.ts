import type { User, Tenant } from "@/types";
import { USER_ROLE } from "@/types";

// Key constants for LocalStorage
const KEYS = {
  PARTIES: "mill_parties",
  USERS: "mill_users",
  PURCHASES: "mill_purchases",
  SALES: "mill_sales",
  EXPENSES: "mill_expenses",
  LABOUR: "mill_labour",
  INVENTORY: "mill_inventory",
  NOTIFICATIONS: "mill_notifications",
};

// Interface definitions
export interface MockPurchase {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  supplierName: string;
  date: string;
  paymentStatus?: string;
  tenantId: string;
}

export interface MockSale {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  buyerName: string;
  date: string;
  tenantId: string;
}

export interface MockExpense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  tenantId: string;
}

export interface MockLabour {
  id: string;
  name: string;
  role: string; // e.g. Loader, Machine Operator, Driver
  dailyWage: number;
  presentDays: number;
  unpaidDues: number;
  contact: string;
  tenantId: string;
}

export interface MockInventory {
  id: string;
  itemName: string;
  category: "Raw Material" | "Finished Goods" | "Packaging" | "Byproduct";
  stockQuantity: number;
  unit: string;
  minStockAlert: number;
  tenantId: string;
}

export interface MockNotification {
  id: string;
  message: string;
  timestamp: string;
  tenantId: string;
  read: boolean;
  type: "create" | "update" | "delete" | "system";
  module: string;
  whatsappSent: boolean;
  whatsappMessageDetails?: string;
}

// Initial Seed Data
const DEFAULT_TENANTS: Tenant[] = [
  { id: "tenant-a", name: "Supreme Basmati Mills", code: "SBM-1" },
  { id: "tenant-b", name: "Golden Rice Agro", code: "GRA-2" },
];

const DEFAULT_USERS: User[] = [
  {
    id: "user-master",
    fullName: "Super Admin",
    email: "masteradmin@mill.com",
    role: USER_ROLE.MASTER_ADMIN,
    tenant: null,
  },
  {
    id: "user-admin-a",
    fullName: "Rahul Sharma",
    email: "admin@partya.com",
    role: USER_ROLE.ADMIN,
    tenant: DEFAULT_TENANTS[0],
  },
  {
    id: "user-partner-a1",
    fullName: "Amit Patel",
    email: "partner1@partya.com",
    role: USER_ROLE.PARTNER,
    tenant: DEFAULT_TENANTS[0],
  },
  {
    id: "user-partner-a2",
    fullName: "Vikram Singh",
    email: "partner2@partya.com",
    role: USER_ROLE.PARTNER,
    tenant: DEFAULT_TENANTS[0],
  },
  {
    id: "user-admin-b",
    fullName: "Sanjay Dutta",
    email: "admin@partyb.com",
    role: USER_ROLE.ADMIN,
    tenant: DEFAULT_TENANTS[1],
  },
  {
    id: "user-partner-b1",
    fullName: "Rajesh Kumar",
    email: "partner@partyb.com",
    role: USER_ROLE.PARTNER,
    tenant: DEFAULT_TENANTS[1],
  },
];

const DEFAULT_PURCHASES: MockPurchase[] = [
  {
    id: "pur-1",
    itemName: "Paddy Raw Basmati (1121)",
    quantity: 500,
    unit: "Bags",
    pricePerUnit: 2200,
    totalAmount: 1100000,
    supplierName: "Kisan Mandi Agency",
    date: "2026-07-01",
    paymentStatus: "Paid",
    tenantId: "tenant-a",
  },
  {
    id: "pur-2",
    itemName: "Sona Masuri Paddy",
    quantity: 350,
    unit: "Bags",
    pricePerUnit: 1800,
    totalAmount: 630000,
    supplierName: "Punjab Agro Farms",
    date: "2026-07-06",
    paymentStatus: "Pending",
    tenantId: "tenant-a",
  },
  {
    id: "pur-3",
    itemName: "White Rice Husk Bags",
    quantity: 1000,
    unit: "Pieces",
    pricePerUnit: 15,
    totalAmount: 15000,
    supplierName: "Unique Packaging Ltd",
    date: "2026-07-10",
    paymentStatus: "Partial",
    tenantId: "tenant-a",
  },
  {
    id: "pur-4",
    itemName: "Premium Paddy Seeds",
    quantity: 200,
    unit: "Bags",
    pricePerUnit: 2500,
    totalAmount: 500000,
    supplierName: "National Seeds Corp",
    date: "2026-07-05",
    paymentStatus: "Paid",
    tenantId: "tenant-b",
  },
];

const DEFAULT_SALES: MockSale[] = [
  {
    id: "sal-1",
    itemName: "Premium Basmati Rice XL",
    quantity: 300,
    unit: "Bags",
    pricePerUnit: 3500,
    totalAmount: 1050000,
    buyerName: "Reliance Retail Corp",
    date: "2026-07-03",
    tenantId: "tenant-a",
  },
  {
    id: "sal-2",
    itemName: "Broken Basmati Rice",
    quantity: 120,
    unit: "Bags",
    pricePerUnit: 1500,
    totalAmount: 180000,
    buyerName: "Local Grain Traders LLC",
    date: "2026-07-08",
    tenantId: "tenant-a",
  },
  {
    id: "sal-3",
    itemName: "Rice Bran Oil Grade A",
    quantity: 50,
    unit: "Barrels",
    pricePerUnit: 8000,
    totalAmount: 400000,
    buyerName: "Adani Wilmar Dist",
    date: "2026-07-11",
    tenantId: "tenant-a",
  },
  {
    id: "sal-4",
    itemName: "Golden Grain Basmati",
    quantity: 150,
    unit: "Bags",
    pricePerUnit: 3400,
    totalAmount: 510000,
    buyerName: "Metro Wholesale",
    date: "2026-07-07",
    tenantId: "tenant-b",
  },
];

const DEFAULT_EXPENSES: MockExpense[] = [
  {
    id: "exp-1",
    category: "Electricity Bill",
    amount: 75000,
    description: "Milling machine power consumption June",
    date: "2026-07-02",
    tenantId: "tenant-a",
  },
  {
    id: "exp-2",
    category: "Machine Maintenance",
    amount: 32000,
    description: "Boiler replacement gaskets & servicing",
    date: "2026-07-05",
    tenantId: "tenant-a",
  },
  {
    id: "exp-3",
    category: "Office Supplies",
    amount: 4500,
    description: "Stationery and printing invoices",
    date: "2026-07-09",
    tenantId: "tenant-a",
  },
  {
    id: "exp-4",
    category: "Generator Fuel",
    amount: 25000,
    description: "Diesel fuel purchase for backup power",
    date: "2026-07-04",
    tenantId: "tenant-b",
  },
];

const DEFAULT_LABOUR: MockLabour[] = [
  {
    id: "lab-1",
    name: "Ram Singh",
    role: "Machine Operator",
    dailyWage: 600,
    presentDays: 24,
    unpaidDues: 3600,
    contact: "+91 98765 43210",
    tenantId: "tenant-a",
  },
  {
    id: "lab-2",
    name: "Shyam Lal",
    role: "Loader / Helper",
    dailyWage: 450,
    presentDays: 22,
    unpaidDues: 1800,
    contact: "+91 98234 56789",
    tenantId: "tenant-a",
  },
  {
    id: "lab-3",
    name: "Hari Dev",
    role: "Quality Inspector",
    dailyWage: 800,
    presentDays: 26,
    unpaidDues: 0,
    contact: "+91 88776 65544",
    tenantId: "tenant-a",
  },
  {
    id: "lab-4",
    name: "Gurpreet Singh",
    role: "Operator",
    dailyWage: 650,
    presentDays: 20,
    unpaidDues: 1300,
    contact: "+91 76543 21098",
    tenantId: "tenant-b",
  },
];

const DEFAULT_INVENTORY: MockInventory[] = [
  {
    id: "inv-1",
    itemName: "Paddy Raw Basmati (1121)",
    category: "Raw Material",
    stockQuantity: 4200,
    unit: "Bags",
    minStockAlert: 1000,
    tenantId: "tenant-a",
  },
  {
    id: "inv-2",
    itemName: "Premium Basmati Rice XL",
    category: "Finished Goods",
    stockQuantity: 850,
    unit: "Bags",
    minStockAlert: 200,
    tenantId: "tenant-a",
  },
  {
    id: "inv-3",
    itemName: "Broken Basmati Rice",
    category: "Byproduct",
    stockQuantity: 1500,
    unit: "Bags",
    minStockAlert: 100,
    tenantId: "tenant-a",
  },
  {
    id: "inv-4",
    itemName: "Paddy Husk (Fuel)",
    category: "Byproduct",
    stockQuantity: 300,
    unit: "Tons",
    minStockAlert: 50,
    tenantId: "tenant-a",
  },
  {
    id: "inv-5",
    itemName: "Paddy Raw Seeds",
    category: "Raw Material",
    stockQuantity: 1200,
    unit: "Bags",
    minStockAlert: 300,
    tenantId: "tenant-b",
  },
];

const DEFAULT_NOTIFICATIONS: MockNotification[] = [
  {
    id: "not-1",
    message: "Welcome to Rice Mill ERP! Party configuration loaded successfully.",
    timestamp: "2026-07-01T10:00:00Z",
    tenantId: "tenant-a",
    read: true,
    type: "system",
    module: "system",
    whatsappSent: false,
  },
];

class MockDatabase {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(KEYS.PARTIES)) {
      localStorage.setItem(KEYS.PARTIES, JSON.stringify(DEFAULT_TENANTS));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(KEYS.PURCHASES)) {
      localStorage.setItem(KEYS.PURCHASES, JSON.stringify(DEFAULT_PURCHASES));
    }
    if (!localStorage.getItem(KEYS.SALES)) {
      localStorage.setItem(KEYS.SALES, JSON.stringify(DEFAULT_SALES));
    }
    if (!localStorage.getItem(KEYS.EXPENSES)) {
      localStorage.setItem(KEYS.EXPENSES, JSON.stringify(DEFAULT_EXPENSES));
    }
    if (!localStorage.getItem(KEYS.LABOUR)) {
      localStorage.setItem(KEYS.LABOUR, JSON.stringify(DEFAULT_LABOUR));
    }
    if (!localStorage.getItem(KEYS.INVENTORY)) {
      localStorage.setItem(KEYS.INVENTORY, JSON.stringify(DEFAULT_INVENTORY));
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
    }
  }

  // Loaders
  private getList<T>(key: string): T[] {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }

  private saveList<T>(key: string, list: T[]) {
    localStorage.setItem(key, JSON.stringify(list));
  }

  // Notifications helper to push alerts & simulate WhatsApp
  private triggerPartnerNotification(
    tenantId: string,
    message: string,
    module: string,
    type: "create" | "update" | "delete",
    details: string
  ) {
    const list = this.getList<MockNotification>(KEYS.NOTIFICATIONS);
    const users = this.getList<User>(KEYS.USERS);
    const partners = users.filter((u) => u.tenant?.id === tenantId && u.role === USER_ROLE.PARTNER);

    const whatsappDestinations = partners.map((p) => p.fullName).join(", ") || "No active partners";
    const whatsappMsg = `[WhatsApp Alert to Partners (${whatsappDestinations})]: Admin made changes in ${module}: ${message}. Record payload: ${details}`;

    const newNotification: MockNotification = {
      id: "not-" + Date.now(),
      message,
      timestamp: new Date().toISOString(),
      tenantId,
      read: false,
      type,
      module,
      whatsappSent: true,
      whatsappMessageDetails: whatsappMsg,
    };

    list.unshift(newNotification);
    this.saveList(KEYS.NOTIFICATIONS, list);

    // Also dispatch a custom event so the UI can listen and show real-time WhatsApp Toast alert!
    window.dispatchEvent(
      new CustomEvent("mill_whatsapp_alert", {
        detail: {
          message,
          destinations: whatsappDestinations,
          details,
        },
      })
    );
  }

  // Parties CRUD
  getParties() {
    return this.getList<Tenant>(KEYS.PARTIES);
  }

  createParty(party: Omit<Tenant, "id">) {
    const parties = this.getParties();
    const newParty: Tenant = {
      ...party,
      id: "tenant-" + Date.now(),
    };
    parties.push(newParty);
    this.saveList(KEYS.PARTIES, parties);
    return newParty;
  }

  updateParty(id: string, updated: Partial<Tenant>) {
    const parties = this.getParties();
    const index = parties.findIndex((p) => p.id === id);
    if (index !== -1) {
      parties[index] = { ...parties[index], ...updated };
      this.saveList(KEYS.PARTIES, parties);
      return parties[index];
    }
    throw new Error("Party not found");
  }

  deleteParty(id: string) {
    let parties = this.getParties();
    parties = parties.filter((p) => p.id !== id);
    this.saveList(KEYS.PARTIES, parties);
    return { id, success: true };
  }

  // Purchases CRUD
  getPurchases(tenantId: string) {
    return this.getList<MockPurchase>(KEYS.PURCHASES).filter((p) => p.tenantId === tenantId);
  }

  createPurchase(tenantId: string, data: Omit<MockPurchase, "id" | "tenantId">) {
    const list = this.getList<MockPurchase>(KEYS.PURCHASES);
    const newRecord: MockPurchase = {
      ...data,
      id: "pur-" + Date.now(),
      tenantId,
    };
    list.push(newRecord);
    this.saveList(KEYS.PURCHASES, list);

    this.triggerPartnerNotification(
      tenantId,
      `New purchase of ${newRecord.quantity} ${newRecord.unit} of "${newRecord.itemName}" from ${newRecord.supplierName}`,
      "Purchase",
      "create",
      JSON.stringify(data)
    );

    return newRecord;
  }

  updatePurchase(tenantId: string, id: string, data: Partial<MockPurchase>) {
    const list = this.getList<MockPurchase>(KEYS.PURCHASES);
    const idx = list.findIndex((x) => x.id === id && x.tenantId === tenantId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      this.saveList(KEYS.PURCHASES, list);

      this.triggerPartnerNotification(
        tenantId,
        `Updated purchase record "${list[idx].itemName}"`,
        "Purchase",
        "update",
        JSON.stringify(data)
      );

      return list[idx];
    }
    throw new Error("Record not found");
  }

  deletePurchase(tenantId: string, id: string) {
    let list = this.getList<MockPurchase>(KEYS.PURCHASES);
    const item = list.find((x) => x.id === id && x.tenantId === tenantId);
    list = list.filter((x) => !(x.id === id && x.tenantId === tenantId));
    this.saveList(KEYS.PURCHASES, list);

    if (item) {
      this.triggerPartnerNotification(
        tenantId,
        `Deleted purchase record of "${item.itemName}"`,
        "Purchase",
        "delete",
        `ID: ${id}`
      );
    }
    return { id, success: true };
  }

  // Sales CRUD
  getSales(tenantId: string) {
    return this.getList<MockSale>(KEYS.SALES).filter((s) => s.tenantId === tenantId);
  }

  createSale(tenantId: string, data: Omit<MockSale, "id" | "tenantId">) {
    const list = this.getList<MockSale>(KEYS.SALES);
    const newRecord: MockSale = {
      ...data,
      id: "sal-" + Date.now(),
      tenantId,
    };
    list.push(newRecord);
    this.saveList(KEYS.SALES, list);

    this.triggerPartnerNotification(
      tenantId,
      `New sales record of ${newRecord.quantity} ${newRecord.unit} of "${newRecord.itemName}" to ${newRecord.buyerName}`,
      "Sales",
      "create",
      JSON.stringify(data)
    );

    return newRecord;
  }

  updateSale(tenantId: string, id: string, data: Partial<MockSale>) {
    const list = this.getList<MockSale>(KEYS.SALES);
    const idx = list.findIndex((x) => x.id === id && x.tenantId === tenantId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      this.saveList(KEYS.SALES, list);

      this.triggerPartnerNotification(
        tenantId,
        `Updated sales record "${list[idx].itemName}"`,
        "Sales",
        "update",
        JSON.stringify(data)
      );

      return list[idx];
    }
    throw new Error("Record not found");
  }

  deleteSale(tenantId: string, id: string) {
    let list = this.getList<MockSale>(KEYS.SALES);
    const item = list.find((x) => x.id === id && x.tenantId === tenantId);
    list = list.filter((x) => !(x.id === id && x.tenantId === tenantId));
    this.saveList(KEYS.SALES, list);

    if (item) {
      this.triggerPartnerNotification(
        tenantId,
        `Deleted sales record of "${item.itemName}"`,
        "Sales",
        "delete",
        `ID: ${id}`
      );
    }
    return { id, success: true };
  }

  // Expenses CRUD
  getExpenses(tenantId: string) {
    return this.getList<MockExpense>(KEYS.EXPENSES).filter((e) => e.tenantId === tenantId);
  }

  createExpense(tenantId: string, data: Omit<MockExpense, "id" | "tenantId">) {
    const list = this.getList<MockExpense>(KEYS.EXPENSES);
    const newRecord: MockExpense = {
      ...data,
      id: "exp-" + Date.now(),
      tenantId,
    };
    list.push(newRecord);
    this.saveList(KEYS.EXPENSES, list);

    this.triggerPartnerNotification(
      tenantId,
      `New expense added: "${newRecord.category}" of Rs. ${newRecord.amount}`,
      "Expenses",
      "create",
      JSON.stringify(data)
    );

    return newRecord;
  }

  updateExpense(tenantId: string, id: string, data: Partial<MockExpense>) {
    const list = this.getList<MockExpense>(KEYS.EXPENSES);
    const idx = list.findIndex((x) => x.id === id && x.tenantId === tenantId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      this.saveList(KEYS.EXPENSES, list);

      this.triggerPartnerNotification(
        tenantId,
        `Updated expense record: "${list[idx].category}"`,
        "Expenses",
        "update",
        JSON.stringify(data)
      );

      return list[idx];
    }
    throw new Error("Record not found");
  }

  deleteExpense(tenantId: string, id: string) {
    let list = this.getList<MockExpense>(KEYS.EXPENSES);
    const item = list.find((x) => x.id === id && x.tenantId === tenantId);
    list = list.filter((x) => !(x.id === id && x.tenantId === tenantId));
    this.saveList(KEYS.EXPENSES, list);

    if (item) {
      this.triggerPartnerNotification(
        tenantId,
        `Deleted expense record: "${item.category}"`,
        "Expenses",
        "delete",
        `ID: ${id}`
      );
    }
    return { id, success: true };
  }

  // Labour CRUD
  getLabour(tenantId: string) {
    return this.getList<MockLabour>(KEYS.LABOUR).filter((l) => l.tenantId === tenantId);
  }

  createLabour(tenantId: string, data: Omit<MockLabour, "id" | "tenantId">) {
    const list = this.getList<MockLabour>(KEYS.LABOUR);
    const newRecord: MockLabour = {
      ...data,
      id: "lab-" + Date.now(),
      tenantId,
    };
    list.push(newRecord);
    this.saveList(KEYS.LABOUR, list);

    this.triggerPartnerNotification(
      tenantId,
      `New labour registered: "${newRecord.name}" (${newRecord.role})`,
      "Labour",
      "create",
      JSON.stringify(data)
    );

    return newRecord;
  }

  updateLabour(tenantId: string, id: string, data: Partial<MockLabour>) {
    const list = this.getList<MockLabour>(KEYS.LABOUR);
    const idx = list.findIndex((x) => x.id === id && x.tenantId === tenantId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      this.saveList(KEYS.LABOUR, list);

      this.triggerPartnerNotification(
        tenantId,
        `Updated details for labour "${list[idx].name}"`,
        "Labour",
        "update",
        JSON.stringify(data)
      );

      return list[idx];
    }
    throw new Error("Labour not found");
  }

  deleteLabour(tenantId: string, id: string) {
    let list = this.getList<MockLabour>(KEYS.LABOUR);
    const item = list.find((x) => x.id === id && x.tenantId === tenantId);
    list = list.filter((x) => !(x.id === id && x.tenantId === tenantId));
    this.saveList(KEYS.LABOUR, list);

    if (item) {
      this.triggerPartnerNotification(
        tenantId,
        `Removed labour record for "${item.name}"`,
        "Labour",
        "delete",
        `ID: ${id}`
      );
    }
    return { id, success: true };
  }

  // Inventory CRUD
  getInventory(tenantId: string) {
    return this.getList<MockInventory>(KEYS.INVENTORY).filter((i) => i.tenantId === tenantId);
  }

  createInventory(tenantId: string, data: Omit<MockInventory, "id" | "tenantId">) {
    const list = this.getList<MockInventory>(KEYS.INVENTORY);
    const newRecord: MockInventory = {
      ...data,
      id: "inv-" + Date.now(),
      tenantId,
    };
    list.push(newRecord);
    this.saveList(KEYS.INVENTORY, list);

    this.triggerPartnerNotification(
      tenantId,
      `New inventory item created: "${newRecord.itemName}"`,
      "Inventory",
      "create",
      JSON.stringify(data)
    );

    return newRecord;
  }

  updateInventory(tenantId: string, id: string, data: Partial<MockInventory>) {
    const list = this.getList<MockInventory>(KEYS.INVENTORY);
    const idx = list.findIndex((x) => x.id === id && x.tenantId === tenantId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      this.saveList(KEYS.INVENTORY, list);

      this.triggerPartnerNotification(
        tenantId,
        `Updated stock for inventory item "${list[idx].itemName}" to ${list[idx].stockQuantity} ${list[idx].unit}`,
        "Inventory",
        "update",
        JSON.stringify(data)
      );

      return list[idx];
    }
    throw new Error("Item not found");
  }

  deleteInventory(tenantId: string, id: string) {
    let list = this.getList<MockInventory>(KEYS.INVENTORY);
    const item = list.find((x) => x.id === id && x.tenantId === tenantId);
    list = list.filter((x) => !(x.id === id && x.tenantId === tenantId));
    this.saveList(KEYS.INVENTORY, list);

    if (item) {
      this.triggerPartnerNotification(
        tenantId,
        `Deleted inventory item "${item.itemName}"`,
        "Inventory",
        "delete",
        `ID: ${id}`
      );
    }
    return { id, success: true };
  }

  // Notifications
  getNotifications(tenantId: string) {
    return this.getList<MockNotification>(KEYS.NOTIFICATIONS).filter(
      (n) => n.tenantId === tenantId
    );
  }

  markNotificationAsRead(tenantId: string, id: string) {
    const list = this.getList<MockNotification>(KEYS.NOTIFICATIONS);
    const idx = list.findIndex((n) => n.id === id && n.tenantId === tenantId);
    if (idx !== -1) {
      list[idx].read = true;
      this.saveList(KEYS.NOTIFICATIONS, list);
      return list[idx];
    }
    throw new Error("Notification not found");
  }

  // Router handler to mock API endpoints (called inside axiosBaseQuery as dynamic fallbacks)
  handleMockRequest(url: string, method: string, data: any, headers?: any) {
    const authHeader = headers?.Authorization || "";
    const token = authHeader.replace("Bearer ", "");

    // Get current logged in user from token
    const users = this.getList<User>(KEYS.USERS);
    let currentUser: User | null = null;
    if (token) {
      // Find matching mock token user (e.g. user-admin-a-token matches user-admin-a)
      const userId = token.replace("-token", "");
      currentUser = users.find((u) => u.id === userId) || null;
    }

    // Router matching:
    // Auth login
    if (url.includes("/auth/login") && method === "POST") {
      const { email } = data;
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        return {
          success: true,
          message: "Login successful",
          data: {
            accessToken: `${found.id}-token`,
            refreshToken: `${found.id}-refresh-token`,
            user: found,
          },
        };
      }
      throw { status: 401, data: { message: "Invalid credentials" } };
    }

    // Auth me
    if (url.includes("/auth/me") && method === "GET") {
      if (currentUser) {
        return {
          success: true,
          message: "User fetched successfully",
          data: currentUser,
        };
      }
      throw { status: 401, data: { message: "Unauthorized" } };
    }

    // Dashboard Stats
    if (url.includes("/dashboard/stats") && method === "GET") {
      if (!currentUser) throw { status: 401, data: { message: "Unauthorized" } };

      if (currentUser.role === USER_ROLE.MASTER_ADMIN) {
        const parties = this.getParties();
        return {
          success: true,
          data: {
            totalParties: parties.length,
            activeParties: parties.length,
            growthPercentage: 15.5,
            partiesGrowth: [
              { month: "Jan", parties: 1 },
              { month: "Feb", parties: 1 },
              { month: "Mar", parties: 1 },
              { month: "Apr", parties: 2 },
              { month: "May", parties: 2 },
              { month: "Jun", parties: parties.length },
            ],
          },
        };
      } else {
        const tenantId = currentUser.tenant?.id || "";
        const purchases = this.getPurchases(tenantId);
        const sales = this.getSales(tenantId);
        const expenses = this.getExpenses(tenantId);
        const labour = this.getLabour(tenantId);
        const inventory = this.getInventory(tenantId);

        const totalPurchase = purchases.reduce((acc, curr) => acc + curr.totalAmount, 0);
        const totalSales = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
        const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const totalLabourPay = labour.reduce((acc, curr) => acc + curr.dailyWage * curr.presentDays, 0);
        
        const netProfit = totalSales - totalPurchase - totalExpenses - totalLabourPay;

        // Sales vs Expenses Grouped by Date (grouped by month or days for chart)
        const chartData = [
          { name: "Week 1", Sales: totalSales * 0.2, Expenses: (totalExpenses + totalLabourPay) * 0.25 },
          { name: "Week 2", Sales: totalSales * 0.35, Expenses: (totalExpenses + totalLabourPay) * 0.2 },
          { name: "Week 3", Sales: totalSales * 0.15, Expenses: (totalExpenses + totalLabourPay) * 0.3 },
          { name: "Week 4", Sales: totalSales * 0.3, Expenses: (totalExpenses + totalLabourPay) * 0.25 },
        ];

        return {
          success: true,
          data: {
            summary: {
              totalPurchase,
              totalSales,
              totalExpenses: totalExpenses + totalLabourPay,
              netProfit,
              inventoryItemCount: inventory.length,
              labourCount: labour.length,
            },
            chartData,
            recentActivities: [
              ...sales.map((s) => ({ id: s.id, type: "Sale", msg: `Sold ${s.quantity} bags of ${s.itemName} for Rs.${s.totalAmount}`, date: s.date })),
              ...purchases.map((p) => ({ id: p.id, type: "Purchase", msg: `Bought ${p.quantity} bags of ${p.itemName} for Rs.${p.totalAmount}`, date: p.date })),
              ...expenses.map((e) => ({ id: e.id, type: "Expense", msg: `Paid Rs.${e.amount} for ${e.category}`, date: e.date })),
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
          },
        };
      }
    }

    // Parties endpoint (Master Admin)
    if (url.includes("/parties")) {
      if (!currentUser || currentUser.role !== USER_ROLE.MASTER_ADMIN) {
        throw { status: 403, data: { message: "Forbidden" } };
      }

      if (method === "GET") {
        return { success: true, data: this.getParties() };
      }
      if (method === "POST") {
        return { success: true, data: this.createParty(data) };
      }
      if (method === "PUT") {
        const id = url.split("/").pop() || "";
        return { success: true, data: this.updateParty(id, data) };
      }
      if (method === "DELETE") {
        const id = url.split("/").pop() || "";
        return { success: true, data: this.deleteParty(id) };
      }
    }

    // Party Modules (requires valid user and isolated by tenant)
    if (!currentUser || !currentUser.tenant) {
      throw { status: 401, data: { message: "Unauthorized or no tenant assigned" } };
    }
    const tenantId = currentUser.tenant.id;

    // Checks permission for modifications (Partner is read-only)
    const checkWritePermission = () => {
      if (currentUser?.role === USER_ROLE.PARTNER) {
        throw { status: 403, data: { message: "Partners are read-only and cannot perform CRUD actions." } };
      }
    };

    // Purchase endpoints
    if (url.includes("/purchase")) {
      if (method === "GET") {
        return { success: true, data: this.getPurchases(tenantId) };
      }
      checkWritePermission();
      if (method === "POST") {
        return { success: true, data: this.createPurchase(tenantId, data) };
      }
      if (method === "PUT") {
        const id = url.split("/").pop() || "";
        return { success: true, data: this.updatePurchase(tenantId, id, data) };
      }
      if (method === "DELETE") {
        const id = url.split("/").pop() || "";
        return { success: true, data: this.deletePurchase(tenantId, id) };
      }
    }

    // Sales endpoints
    if (url.includes("/sales")) {
      if (method === "GET") {
        return { success: true, data: this.getSales(tenantId) };
      }
      checkWritePermission();
      if (method === "POST") {
        return { success: true, data: this.createSale(tenantId, data) };
      }
      if (method === "PUT") {
        const id = url.split("/").pop() || "";
        return { success: true, data: this.updateSale(tenantId, id, data) };
      }
      if (method === "DELETE") {
        const id = url.split("/").pop() || "";
        return { success: true, data: this.deleteSale(tenantId, id) };
      }
    }

    // Expenses endpoints
    if (url.includes("/expenses")) {
      if (method === "GET") {
        return { success: true, data: this.getExpenses(tenantId) };
      }
      checkWritePermission();
      if (method === "POST") {
        return { success: true, data: this.createExpense(tenantId, data) };
      }
      if (method === "PUT") {
        const id = url.split("/").pop() || "";
        return { success: true, data: this.updateExpense(tenantId, id, data) };
      }
      if (method === "DELETE") {
        const id = url.split("/").pop() || "";
        return { success: true, data: this.deleteExpense(tenantId, id) };
      }
    }

    // Labour endpoints
    if (url.includes("/labour")) {
      if (method === "GET") {
        return { success: true, data: this.getLabour(tenantId) };
      }
      checkWritePermission();
      if (method === "POST") {
        return { success: true, data: this.createLabour(tenantId, data) };
      }
      if (method === "PUT") {
        const id = url.split("/").pop() || "";
        return { success: true, data: this.updateLabour(tenantId, id, data) };
      }
      if (method === "DELETE") {
        const id = url.split("/").pop() || "";
        return { success: true, data: this.deleteLabour(tenantId, id) };
      }
    }

    // Inventory endpoints
    if (url.includes("/inventory")) {
      if (method === "GET") {
        return { success: true, data: this.getInventory(tenantId) };
      }
      checkWritePermission();
      if (method === "POST") {
        return { success: true, data: this.createInventory(tenantId, data) };
      }
      if (method === "PUT") {
        const id = url.split("/").pop() || "";
        return { success: true, data: this.updateInventory(tenantId, id, data) };
      }
      if (method === "DELETE") {
        const id = url.split("/").pop() || "";
        return { success: true, data: this.deleteInventory(tenantId, id) };
      }
    }

    // Notification endpoints
    if (url.includes("/notifications")) {
      if (method === "GET") {
        return { success: true, data: this.getNotifications(tenantId) };
      }
      if (method === "PUT") {
        // e.g. marking as read
        const id = url.split("/").pop() || "";
        return { success: true, data: this.markNotificationAsRead(tenantId, id) };
      }
    }

    throw { status: 404, data: { message: `Not Found: ${url}` } };
  }
}

export const mockDb = new MockDatabase();
