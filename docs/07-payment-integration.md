# 💳 Payment Integration

Complete payment system for Blinkit Full Stack Clone supporting **Stripe** online payments and **Cash on Delivery (COD)** with secure processing and order management.

## 🚀 Quick Overview

- **Dual Payment Methods** - Stripe + Cash on Delivery
- **Secure Processing** - PCI compliant Stripe integration
- **Webhook Handling** - Automatic order creation
- **Order Management** - Complete order lifecycle
- **Mobile Optimized** - Responsive payment flows

## 📋 Table of Contents

- [Payment Methods](#-payment-methods)
- [Stripe Integration](#-stripe-integration)
- [Cash on Delivery](#-cash-on-delivery)
- [API Endpoints](#-api-endpoints)
- [Webhook Setup](#-webhook-setup)
- [Testing](#-testing)
- [Security](#-security)

## 💰 Payment Methods

### Stripe Online Payment
- **Credit/Debit Cards** - All major cards supported
- **Real-time Processing** - Instant payment confirmation
- **Secure Checkout** - Hosted Stripe checkout page
- **International Support** - Multi-currency ready

### Cash on Delivery (COD)
- **Pay on Delivery** - No upfront payment required
- **Address Verification** - Detailed shipping information
- **Order Confirmation** - Immediate order placement
- **Flexible Payment** - Cash payment to delivery person

## 🏦 Stripe Integration

### Setup & Configuration

#### Installation
```bash
# Backend dependencies
npm install stripe

# Frontend dependencies
npm install @stripe/stripe-js @stripe/react-stripe-js
```

#### Environment Variables
```env
# Backend (.env)
STRIPE_SECRET_KEY=sk_test_51xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...
CLIENT_URL=http://localhost:3000

# Frontend (.env)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51xxx...
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend Implementation

#### Create Checkout Session
```javascript
// POST /api/checkout/stripe-session
const createStripeSession = async (req, res) => {
  const { cartItems, userId } = req.body;
  
  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: item.name,
        images: [item.image]
      },
      unit_amount: item.price * 100 // Convert to paise
    },
    quantity: item.quantity
  }));
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${CLIENT_URL}/checkout`,
    metadata: { userId }
  });
  
  res.json({ sessionUrl: session.url });
};
```

### Frontend Implementation

#### Stripe Checkout Button
```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const StripeCheckout = ({ cartItems, totalAmount }) => {
  const [loading, setLoading] = useState(false);
  
  const handleStripePayment = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/checkout/stripe-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cartItems,
          userId: user.id
        })
      });
      
      const { sessionUrl } = await response.json();
      window.location.href = sessionUrl;
      
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button 
      onClick={handleStripePayment}
      disabled={loading}
      className="stripe-btn"
    >
      {loading ? 'Processing...' : `Pay ₹${totalAmount} with Stripe`}
    </button>
  );
};
```

## 💵 Cash on Delivery

### Backend Implementation

#### COD Order Creation
```javascript
// POST /api/order/cod
const createCODOrder = async (req, res) => {
  try {
    const { cartItems, shippingAddress, userId } = req.body;
    
    // Validate cart items and calculate total
    let totalAmount = 0;
    const validatedItems = [];
    
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.name} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }
      
      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
      
      totalAmount += product.price * item.quantity;
    }
    
    // Create order
    const order = new Order({
      userId,
      items: validatedItems,
      shippingAddress,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'processing',
      totalAmount,
      orderDate: new Date(),
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    
    await order.save();
    
    // Update product stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    // Clear user's cart
    await Cart.findOneAndDelete({ userId });
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: order._id,
      estimatedDelivery: order.estimatedDelivery
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Order creation failed',
      error: error.message 
    });
  }
};
```

### Frontend Implementation

#### COD Checkout Form
```javascript
const CODCheckout = ({ cartItems, totalAmount }) => {
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  
  const handleCODOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/order/cod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cartItems,
          shippingAddress,
          userId: user.id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Clear cart and redirect
        dispatch(clearCart());
        navigate(`/order-success/${data.orderId}`);
      } else {
        setError(data.message);
      }
      
    } catch (error) {
      setError('Order placement failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleCODOrder} className="cod-form">
      <div className="address-fields">
        <input
          type="text"
          placeholder="Full Name"
          value={shippingAddress.fullName}
          onChange={(e) => setShippingAddress({
            ...shippingAddress,
            fullName: e.target.value
          })}
          required
        />
        <input
          type="text"
          placeholder="Street Address"
          value={shippingAddress.street}
          onChange={(e) => setShippingAddress({
            ...shippingAddress,
            street: e.target.value
          })}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={shippingAddress.city}
          onChange={(e) => setShippingAddress({
            ...shippingAddress,
            city: e.target.value
          })}
          required
        />
        <input
          type="text"
          placeholder="State"
          value={shippingAddress.state}
          onChange={(e) => setShippingAddress({
            ...shippingAddress,
            state: e.target.value
          })}
          required
        />
        <input
          type="text"
          placeholder="Pincode"
          value={shippingAddress.pincode}
          onChange={(e) => setShippingAddress({
            ...shippingAddress,
            pincode: e.target.value
          })}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={shippingAddress.phone}
          onChange={(e) => setShippingAddress({
            ...shippingAddress,
            phone: e.target.value
          })}
          required
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="cod-submit-btn"
      >
        {loading ? 'Placing Order...' : `Place Order - ₹${totalAmount} (COD)`}
      </button>
    </form>
  );
};
```

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/checkout/stripe-session` | Create Stripe checkout session | ✅ |
| POST | `/api/order/cod` | Place COD order | ✅ |
| POST | `/api/webhook/stripe` | Handle Stripe webhooks | ❌ |
| GET | `/api/orders/:orderId` | Get order details | ✅ |
| PUT | `/api/orders/:orderId/status` | Update order status (Admin) | ✅ |

## 🔗 Webhook Setup

### Stripe Webhook Configuration

#### 1. Create Webhook Endpoint
```javascript
// routes/webhook.js
router.post('/stripe', express.raw({type: 'application/json'}), handleStripeWebhook);

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await createOrderFromStripeSession(session);
  }
  
  res.json({received: true});
};
```

#### 2. Stripe Dashboard Setup
1. Go to **Stripe Dashboard** → **Webhooks**
2. Click **"Add endpoint"**
3. Set URL: `https://your-domain.com/api/webhook/stripe`
4. Select events: `checkout.session.completed`
5. Copy **Webhook Secret** to environment variables

### Order Creation from Webhook
```javascript
const createOrderFromStripeSession = async (session) => {
  const { userId } = session.metadata;
  
  // Retrieve session with line items
  const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
    session.id,
    { expand: ['line_items'] }
  );
  
  const order = new Order({
    userId,
    stripeSessionId: session.id,
    paymentMethod: 'stripe',
    paymentStatus: 'completed',
    orderStatus: 'processing',
    totalAmount: session.amount_total / 100, // Convert from paise
    items: sessionWithLineItems.line_items.data.map(item => ({
      name: item.description,
      quantity: item.quantity,
      price: item.price.unit_amount / 100
    }))
  });
  
  await order.save();
  
  // Clear user's cart
  await Cart.findOneAndDelete({ userId });
};
```

## 🧪 Testing

### Stripe Test Cards
```javascript
// Test card numbers (use any future expiry date and any 3-digit CVC)
const testCards = {
  success: '4242424242424242',           // Visa
  declined: '4000000000000002',          // Generic decline
  insufficientFunds: '4000000000009995', // Insufficient funds
  expiredCard: '4000000000000069',       // Expired card
  incorrectCVC: '4000000000000127'       // Incorrect CVC
};
```

### API Testing
```bash
# Test Stripe session creation
curl -X POST http://localhost:5000/api/checkout/stripe-session \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "cartItems": [
      {"productId": "123", "name": "Apple", "price": 100, "quantity": 2}
    ],
    "userId": "user123"
  }'

# Test COD order creation
curl -X POST http://localhost:5000/api/order/cod \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "cartItems": [
      {"productId": "123", "name": "Apple", "price": 100, "quantity": 2}
    ],
    "shippingAddress": {
      "fullName": "John Doe",
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "phone": "9876543210"
    },
    "userId": "user123"
  }'
```

### Frontend Testing
```javascript
// Test payment integration
describe('Payment Integration', () => {
  it('should create Stripe checkout session', async () => {
    const cartItems = [
      { productId: '123', name: 'Test Product', price: 100, quantity: 1 }
    ];
    
    const response = await createStripeSession(cartItems, 'user123');
    expect(response.sessionUrl).toContain('checkout.stripe.com');
  });
  
  it('should place COD order successfully', async () => {
    const orderData = {
      cartItems: mockCartItems,
      shippingAddress: mockAddress,
      userId: 'user123'
    };
    
    const response = await createCODOrder(orderData);
    expect(response.success).toBe(true);
    expect(response.orderId).toBeDefined();
  });
});
```

## 🔒 Security

### Payment Security Best Practices

#### Stripe Security
- Never store card details on your server
- Use HTTPS for all payment-related requests
- Validate webhook signatures
- Implement rate limiting on payment endpoints
- Log payment attempts for monitoring

#### COD Security
- Validate shipping address format
- Implement phone number verification
- Check for suspicious order patterns
- Limit COD amount for new users
- Verify delivery area coverage

### Data Protection
```javascript
// Sanitize sensitive data in logs
const sanitizeOrderData = (order) => ({
  ...order,
  // Remove sensitive fields from logs
  shippingAddress: {
    ...order.shippingAddress,
    phone: order.shippingAddress.phone.replace(/\d{6}$/, 'XXXXXX')
  }
});
```

## 📊 Order Management

### Order Status Flow
```
Processing → Confirmed → Shipped → Out for Delivery → Delivered
                    ↓
                 Cancelled (if needed)
```

### Order Tracking
```javascript
// GET /api/orders/:orderId/track
const trackOrder = async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate('items.productId', 'name image');
    
  const trackingInfo = {
    orderId: order._id,
    status: order.orderStatus,
    estimatedDelivery: order.estimatedDelivery,
    trackingUpdates: order.trackingUpdates || []
  };
  
  res.json(trackingInfo);
};
```

## 🚨 Error Handling

### Common Payment Errors
```javascript
const handlePaymentError = (error) => {
  switch (error.code) {
    case 'card_declined':
      return 'Your card was declined. Please try a different card.';
    case 'insufficient_funds':
      return 'Insufficient funds. Please try a different card.';
    case 'expired_card':
      return 'Your card has expired. Please use a different card.';
    case 'incorrect_cvc':
      return 'Incorrect security code. Please check and try again.';
    default:
      return 'Payment failed. Please try again.';
  }
};
```

### COD Validation Errors
```javascript
const validateCODOrder = (orderData) => {
  const errors = [];
  
  if (!orderData.shippingAddress.pincode.match(/^\d{6}$/)) {
    errors.push('Invalid pincode format');
  }
  
  if (!orderData.shippingAddress.phone.match(/^\d{10}$/)) {
    errors.push('Invalid phone number format');
  }
  
  if (orderData.totalAmount > 5000) {
    errors.push('COD not available for orders above ₹5000');
  }
  
  return errors;
};
```

## 🔄 Future Enhancements

- [ ] **Digital Wallets** - Add PayPal, Google Pay, Apple Pay
- [ ] **EMI Options** - Installment payment plans
- [ ] **Cryptocurrency** - Bitcoin payment support
- [ ] **Buy Now Pay Later** - BNPL integration
- [ ] **Subscription** - Recurring payment support
- [ ] **Multi-currency** - International payment support

## 📞 Support

For payment integration issues:

- **Stripe Issues** - Check Stripe Dashboard logs
- **Webhook Problems** - Verify endpoint URL and signatures
- **COD Orders** - Validate address and stock availability
- **Contact** - tanmaykapoor003@gmail.com

---

**Secure payments powered by Stripe • Built with Express.js and React**