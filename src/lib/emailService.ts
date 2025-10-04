import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_5532uqf';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_ryduhos';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'GEvK-7ZQGZAobO6pi';


// Initialize EmailJS with error handling
try {
  emailjs.init(EMAILJS_PUBLIC_KEY);
} catch (error) {
  console.error('Failed to initialize EmailJS:', error);
}

// Test function to verify EmailJS setup
export const testEmailJS = async (): Promise<boolean> => {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: 'info.akazubaflorist@gmail.com',
        from_name: 'AKAZUBA FLORIST',
        message: 'Test email from AKAZUBA FLORIST admin panel',
        reply_to: 'info.akazubaflorist@gmail.com'
      }
    );

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
    imageUrl?: string;
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
      order_items_with_images: orderData.orderItems.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price.toLocaleString('en-RW', { style: 'currency', currency: 'RWF' }),
        total: item.total.toLocaleString('en-RW', { style: 'currency', currency: 'RWF' }),
        image: item.imageUrl || ''
      })),
      admin_email: orderData.adminEmail,
      order_date: new Date().toLocaleString('en-RW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: EMAILJS_PUBLIC_KEY
      }
    );

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
