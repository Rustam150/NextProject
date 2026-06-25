'use client';

import { useEffect, useState } from 'react';
import { Store } from '@/lib/store';

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
  address?: string;
  deliveryType?: 'pickup' | 'delivery';

  comment?: string;
  managerComment?: string;

  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');
  const [search, setSearch] = useState('');
  useEffect(() => {
    const saved = localStorage.getItem('hd_orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  const deleteOrder = (id: number) => {
    if (confirm('Удалить заказ?')) {
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      localStorage.setItem('hd_orders', JSON.stringify(updated));
    }
  };

  const updateOrder = (id: number, patch: Partial<Order>) => {
    const updated = orders.map(order =>
      order.id === id
        ? { ...order, ...patch }
        : order
    );
  
    setOrders(updated);
    localStorage.setItem('hd_orders', JSON.stringify(updated));
  };

  const clearAll = () => {
    if (confirm('Удалить все заказы?')) {
      setOrders([]);
      localStorage.setItem('hd_orders', '[]');
    }
  };

  const statusLabels = {
    new: 'Новый',
    processing: 'В обработке',
    approved: 'Согласован',
    paid: 'Оплачен',
    delivery: 'В доставке',
    completed: 'Завершён',
    cancelled: 'Отменён',
  };
  
  const statusColors = {
    new: '#1976d2',
    processing: '#f57c00',
    approved: '#7b1fa2',
    paid: '#2e7d32',
    delivery: '#00838f',
    completed: '#388e3c',
    cancelled: '#c62828',
  };

const newCount = orders.filter(o => o.status === 'new').length;
const processingCount = orders.filter(o => o.status === 'processing').length;
const approvedCount = orders.filter(o => o.status === 'approved').length;
const paidCount = orders.filter(o => o.status === 'paid').length;
const deliveryCount = orders.filter(o => o.status === 'delivery').length;
const completedCount = orders.filter(o => o.status === 'completed').length;
const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

  const filteredOrders = orders.filter((order) => {
  const matchesStatus =
    filterStatus === 'all'
      ? true
      : order.status === filterStatus;

  const searchText = search.toLowerCase();

  const matchesSearch =
    `${order.firstName} ${order.lastName}`
      .toLowerCase()
      .includes(searchText) ||
    order.phone.toLowerCase().includes(searchText);

  return matchesStatus && matchesSearch;
});

  return (
    <div>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', margin: 0 }}>Заказы ({orders.length})</h1>
        {orders.length > 0 && (
          <button onClick={clearAll} style={{ padding: '12px 24px', background: '#c62828', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
            Очистить все
          </button>
        )}
      </div>

      <input
  type="text"
  placeholder="Поиск по имени или телефону..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
  }}
/>

      <div
  style={{
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  }}
>
  <button
    onClick={() => setFilterStatus('all')}
    style={{
      padding: '8px 14px',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      background: filterStatus === 'all' ? '#111' : '#eee',
      color: filterStatus === 'all' ? '#fff' : '#111',
    }}
  >
    Все ({orders.length})
  </button>

  <button
    onClick={() => setFilterStatus('new')}
    style={{
      padding: '8px 14px',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      background: filterStatus === 'new' ? '#1976d2' : '#eee',
      color: filterStatus === 'new' ? '#fff' : '#111',
    }}
  >
    Новые ({newCount})
  </button>

  <button
    onClick={() => setFilterStatus('processing')}
    style={{
      padding: '8px 14px',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      background: filterStatus === 'processing' ? '#f57c00' : '#eee',
      color: filterStatus === 'processing' ? '#fff' : '#111',
    }}
  >
    В обработке ({processingCount})
  </button>

  <button
    onClick={() => setFilterStatus('delivery')}
    style={{
      padding: '8px 14px',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      background: filterStatus === 'delivery' ? '#00838f' : '#eee',
      color: filterStatus === 'delivery' ? '#fff' : '#111',
    }}
  >
    В доставке ({deliveryCount})
  </button>

  <button
    onClick={() => setFilterStatus('completed')}
    style={{
      padding: '8px 14px',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      background: filterStatus === 'completed' ? '#388e3c' : '#eee',
      color: filterStatus === 'completed' ? '#fff' : '#111',
    }}
  >
    Завершённые ({completedCount})
  </button>

    <button
  onClick={() => setFilterStatus('cancelled')}
  style={{
    padding: '8px 14px',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    background:
      filterStatus === 'cancelled'
        ? '#111'
        : '#eee',
    color:
      filterStatus === 'cancelled'
        ? '#fff'
        : '#111'
  }}
>
  Отменённые ({cancelledCount})
</button>

<button
  onClick={() => setFilterStatus('approved')}
  style={{
    padding: '8px 14px',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    background:
      filterStatus === 'approved' ? '#111' : '#eee',
    color:
      filterStatus === 'approved' ? '#fff' : '#111'
  }}
>
  Согласованные ({approvedCount})
</button>

<button
  onClick={() => setFilterStatus('paid')}
  style={{
    padding: '8px 14px',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    background:
      filterStatus === 'paid' ? '#111' : '#eee',
    color:
      filterStatus === 'paid' ? '#fff' : '#111'
  }}
>
  Оплаченные ({paidCount})
</button>
  
</div>

      {orders.length === 0 ? (
        <div style={{ background: '#fff', padding: '40px', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
          Заказов пока нет
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.map(order => (
            <div key={order.id} style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
      marginBottom: '8px',
    }}
  >
    <h3
      style={{
        margin: 0,
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '20px',
      }}
    >
      Заказ #{order.id}
    </h3>

    <span
      style={{
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        color: '#fff',
        background: statusColors[order.status],
      }}
    >
      {statusLabels[order.status]}
    </span>
  </div>

  <p
    style={{
      margin: 0,
      fontSize: '13px',
      color: '#666',
    }}
  >
    {new Date(order.date).toLocaleString('ru-RU')}
  </p>
</div>
                <button
                  onClick={() => deleteOrder(order.id)}
                  style={{ padding: '6px 12px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Удалить
                </button>
              </div>

              {(order.firstName || order.lastName || order.phone) && (
                <div style={{ marginBottom: '16px', padding: '12px', background: '#f9f9f9', borderRadius: '4px' }}>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    <strong>Клиент:</strong> {order.firstName} {order.lastName}
                  </p>
                  {order.phone && (
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      <strong>Телефон:</strong> {order.phone}
                    </p>
                  )}

                  {order.deliveryType && (
  <p style={{ margin: '4px 0', fontSize: '14px' }}>
    <strong>Способ получения:</strong>{' '}
    {order.deliveryType === 'pickup'
      ? 'Самовывоз'
      : 'Доставка'}
  </p>
)}

{order.deliveryType === 'delivery' && order.address && (
  <p style={{ margin: '4px 0', fontSize: '14px' }}>
    <strong>Адрес доставки:</strong> {order.address}
  </p>
)}
                </div>
              )}

{order.comment && (
  <div
    style={{
      marginBottom: '16px',
      padding: '12px',
      background: '#fff8e1',
      borderRadius: '8px',
      border: '1px solid #ffe082'
    }}
  >
    <strong>Комментарий клиента:</strong>

    <div style={{ marginTop: '6px' }}>
      {order.comment}
    </div>
  </div>
)}

<div
  style={{
    marginBottom: '16px',
    padding: '12px',
    background: '#fafafa',
    borderRadius: '8px',
    border: '1px solid #eee'
  }}
>
  <p
    style={{
      margin: '0 0 8px 0',
      fontSize: '13px',
      color: '#666',
      textTransform: 'uppercase'
    }}
  >
    Статус заказа
  </p>

  <select
    value={order.status}
    onChange={(e) =>
      updateOrder(order.id, {
        status: e.target.value as Order['status']
      })
    }
    style={{
      width: '100%',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ddd'
    }}
  >
    <option value="new">Новый</option>
    <option value="processing">В обработке</option>
    <option value="approved">Согласован</option>
    <option value="paid">Оплачен</option>
    <option value="delivery">В доставке</option>
    <option value="completed">Завершён</option>
    <option value="cancelled">Отменён</option>
  </select>
</div>

              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666', textTransform: 'uppercase' }}>Товары:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f9f9f9', borderRadius: '4px', fontSize: '14px' }}>
                      <span>{item.name} {item.qty > 1 ? `(×${item.qty})` : ''}</span>
                      {item.price && <span style={{ fontWeight: 500 }}>{(item.price * item.qty).toLocaleString()} ₽</span>}
                    </div>
                  ))}
                </div>
              </div>

              

              {order.items.some(i => i.price) && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eee', textAlign: 'right', fontSize: '16px', fontWeight: 600 }}>
                  Итого: {order.items.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0).toLocaleString()} ₽
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}