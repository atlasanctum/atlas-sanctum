import React from 'react';
import type { Invoice } from '@/hooks/useSubscription';

interface InvoiceGeneratorProps {
  invoice: Invoice;
}

export function InvoiceGenerator({ invoice }: InvoiceGeneratorProps) {
  const items = (invoice.items || []) as { description: string; quantity: number; unitPrice: number; total: number }[];

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', maxWidth: '600px', margin: '0 auto', backgroundColor: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{invoice.invoice_number}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {new Date(invoice.issued_at).toLocaleDateString()}
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <div style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: invoice.status === 'paid' ? '#f0fdf4' : '#f3f4f6',
            color: invoice.status === 'paid' ? '#10b981' : '#6b7280',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {invoice.status === 'paid' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
            {invoice.status}
          </div>
        </div>
      </div>
      
      <div style={{ fontSize: '12px', color: '#6b7280' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span>{item.description}</span>
            <span>${item.total?.toFixed(2)}</span>
          </div>
        ))}
        <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', margin: '16px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '14px', color: '#111827' }}>
          <span>Total</span>
          <span style={{ color: '#10b981' }}>${invoice.amount.toFixed(2)} {invoice.currency}</span>
        </div>
      </div>
    </div>
  );
}
