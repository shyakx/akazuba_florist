import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_akazuba';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_order_notification';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key_here';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Test function to verify EmailJS setup
export const testEmailJS = async (): Promise<boolean> => {
  try {
    console.log('Testing EmailJS with:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY
    });

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        order_number: 'TEST-001',
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_phone: '+250 123 456 789',
        delivery_address: 'Test Address',
        delivery_city: 'Kigali',
        payment_method: 'Test Payment',
        subtotal: 'RWF 50,000',
        delivery_fee: 'RWF 2,000',
        total: 'RWF 52,000',
        notes: 'This is a test email',
        payment_proof_url: 'No payment proof uploaded',
        order_items: 'Test Product x1 - RWF 50,000',
        admin_email: 'info.akazubaflorist@gmail.com',
        order_date: new Date().toLocaleString('en-RW')
      }
    );

    console.log('Test email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Test email failed:', error);
    return false;
  }
};

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes: string;
  paymentProofUrl?: string;
  orderItems: Array<{
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  adminEmail: string;
}

export const sendOrderNotificationEmail = async (orderData: OrderEmailData): Promise<boolean> => {
  try {
    const templateParams = {
      order_number: orderData.orderNumber,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,
      delivery_address: orderData.deliveryAddress,
      delivery_city: orderData.deliveryCity,
      payment_method: orderData.paymentMethod,
      subtotal: orderData.subtotal.toLocaleString('en-RW', { style: 'currency', currency: 'RWF' }),
      delivery_fee: orderData.deliveryFee.toLocaleString('en-RW', { style: 'currency', currency: 'RWF' }),
      total: orderData.total.toLocaleString('en-RW', { style: 'currency', currency: 'RWF' }),
      notes: orderData.notes || 'No additional notes',
      payment_proof_url: orderData.paymentProofUrl || 'No payment proof uploaded',
      order_items: orderData.orderItems.map(item => 
        `${item.productName} x${item.quantity} - ${item.total.toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}`
      ).join('\n'),
      admin_email: orderData.adminEmail,
      order_date: new Date().toLocaleString('en-RW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Fallback email function using mailto link
export const sendFallbackEmail = (orderData: OrderEmailData): void => {
  const subject = `New Order #${orderData.orderNumber} - AKAZUBA FLORIST`;
  
  const body = `
New Order Received!

Order Details:
- Order Number: ${orderData.orderNumber}
- Customer: ${orderData.customerName}
- Email: ${orderData.customerEmail}
- Phone: ${orderData.customerPhone}
- Delivery Address: ${orderData.deliveryAddress}, ${orderData.deliveryCity}
- Payment Method: ${orderData.paymentMethod}

Order Items:
${orderData.orderItems.map(item => 
  `- ${item.productName} x${item.quantity} - ${item.total.toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}`
).join('\n')}

Order Summary:
- Subtotal: ${orderData.subtotal.toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}
- Delivery Fee: ${orderData.deliveryFee.toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}
- Total: ${orderData.total.toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}

Payment Proof: ${orderData.paymentProofUrl || 'No payment proof uploaded'}

Notes: ${orderData.notes || 'No additional notes'}

Order Date: ${new Date().toLocaleString('en-RW')}

---
AKAZUBA FLORIST
  `.trim();

  const mailtoLink = `mailto:${orderData.adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoLink, '_blank');
};
