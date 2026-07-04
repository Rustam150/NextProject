import { HERMITAGE } from './data';

const Storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

interface CartItem {
  id: string;
  qty: number;
}

interface User {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface OrderItem {
  id: string;
  name: string;
  image?: string;
  sku?: string;
  qty: number;
  price?: number;
}

interface Order {
  id: number;
  date: string;

  status:
    | 'new'
    | 'processing'
    | 'approved'
    | 'paid'
    | 'delivery'
    | 'completed'
    | 'cancelled';

  firstName: string;
  lastName: string;
  phone: string;
  email?: string;

  deliveryType?: 'pickup' | 'delivery';
  address?: string;

  comment?: string;
  managerComment?: string;

  items: OrderItem[];
}

export const Store = {
  cart: (): CartItem[] => Storage.get<CartItem[]>('hd_cart', []),
  setCart: (items: CartItem[]) => {
    Storage.set('hd_cart', items);
    Store.updateBadges();
  },
  favorites: (): string[] => Storage.get<string[]>('hd_favorites', []),
  setFavorites: (ids: string[]) => {
    Storage.set('hd_favorites', ids);
    Store.updateBadges();
  },
  user: (): User | null => Storage.get<User | null>('hd_user', null),
  setUser: (u: User | null) => Storage.set('hd_user', u),
  orders: (): Order[] => Storage.get<Order[]>('hd_orders', []),
  addOrder: (order: Omit<Order, 'id' | 'date'>) => {
    const list = Store.orders();
    list.unshift({
      ...order,
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'new'
    });
    Storage.set('hd_orders', list);
  },
  compare: (): string[] => Storage.get<string[]>('hd_compare', []),
  setCompare: (ids: string[]) => {
    Storage.set('hd_compare', ids.slice(0, 4));
    Store.updateBadges();
  },

  getProducts() {
  const hdProducts = Storage.get<any[] | null>('hd_products', null);

  if (hdProducts && hdProducts.length > 0) {
    return hdProducts;
  }

  const oldProducts = Storage.get<any[] | null>('products', null);

  if (oldProducts && oldProducts.length > 0) {
    Storage.set('hd_products', oldProducts);
    return oldProducts;
  }

  return HERMITAGE.products;
},

  setProducts(products: any[]) {
    // Сохраняем в ОБО ключа чтобы админка и каталог видели одни данные
    Storage.set('hd_products', products);
    Storage.set('products', products);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  },

  getCategories() {
  const categories = Storage.get<any[] | null>('categories', null);

  if (categories && categories.length > 0) {
    return categories;
  }

  return HERMITAGE.categories;
},

setCategories(categories: any[]) {
  Storage.set('categories', categories);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
  }
},

getBrands() {
  const brands = Storage.get<any[] | null>('brands', null);

  if (brands && brands.length > 0) {
    return brands;
  }

  return HERMITAGE.brands;
},

setBrands(brands: any[]) {
  Storage.set('brands', brands);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
  }
},

getOrders() {
  return Storage.get<Order[]>('hd_orders', []);
},

setOrders(orders: Order[]) {
  Storage.set('hd_orders', orders);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
  }
},

  updateBadges() {
    const cart = Store.cart();
    const fav = Store.favorites();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  },

  toggleFavorite(id: string): boolean {
    const fav = Store.favorites();
    const i = fav.indexOf(id);
    if (i >= 0) fav.splice(i, 1);
    else fav.push(id);
    Store.setFavorites(fav);
    return fav.includes(id);
  },

  isFavorite(id: string): boolean {
    return Store.favorites().includes(id);
  },

  addToCart(id: string, qty = 1) {
    const cart = Store.cart();
    const existing = cart.find((c) => c.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ id, qty });
    Store.setCart(cart);
  },

  removeFromCart(id: string) {
    Store.setCart(Store.cart().filter((c) => c.id !== id));
  },

  updateCartQty(id: string, qty: number) {
    const cart = Store.cart();
    const item = cart.find((c) => c.id === id);
    if (item) {
      item.qty = Math.max(1, qty);
      Store.setCart(cart);
    }
  },

  toggleCompare(id: string): boolean {
    const list = Store.compare();
    const i = list.indexOf(id);
    if (i >= 0) {
      list.splice(i, 1);
      Store.setCompare(list);
      return false;
    }
    if (list.length >= 4) return false;
    list.push(id);
    Store.setCompare(list);
    return true;
  },

  isInCompare(id: string): boolean {
    return Store.compare().includes(id);
  },

  subscribeToProducts(callback: () => void) {
    if (typeof window === 'undefined') return () => {};
    
    const handler = () => callback();
    window.addEventListener('storage', handler);
    window.addEventListener('products:update', handler);
    
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('products:update', handler);
    };
  },
};