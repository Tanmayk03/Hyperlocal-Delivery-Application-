# 🛒 Cart & Checkout System

Complete shopping cart and checkout implementation for the Blinkit Full Stack Clone with real-time updates, persistent storage, and multiple payment options.

## 🚀 Quick Overview

- **Real-time Cart Updates** - Add, update, remove items instantly
- **Redux State Management** - Centralized cart state with persistence
- **Dual Payment Options** - Stripe integration + Cash on Delivery
- **Cart Persistence** - Maintains cart across sessions
- **Order Management** - Complete order processing workflow

## 📋 Table of Contents

- [Cart Operations](#-cart-operations)
- [Payment Integration](#-payment-integration)
- [State Management](#-state-management)
- [API Endpoints](#-api-endpoints)
- [Frontend Components](#-frontend-components)
- [Testing](#-testing)

## 🛍️ Cart Operations

### Add to Cart
```javascript
// Add item or update quantity if exists
POST /api/cart/add
{
  "productId": "product_id_here",
  "quantity": 2
}
```

### Update Quantity
```javascript
// Update existing item quantity
PUT /api/cart/update/:productId
{
  "quantity": 5
}
```

### Remove Item
```javascript
// Remove specific item from cart
DELETE /api/cart/remove/:productId
```

### Get Cart
```javascript
// Fetch user's current cart
GET /api/cart/
// Returns: { items, totalItems, totalAmount }
```

## 💳 Payment Integration

### Stripe Checkout
```javascript
// Create Stripe payment session
POST /api/checkout/stripe-session
{
  "cartItems": [...],
  "userId": "user_id"
}
// Returns: { sessionUrl: "stripe_checkout_url" }
```

### Cash on Delivery
```javascript
// Place COD order directly
POST /api/order/cod
{
  "cartItems": [...],
  "address": {...},
  "userId": "user_id"
}
// Returns: { orderId, message }
```

## 🔄 State Management

### Redux Cart Slice
```javascript
// Cart state structure
{
  items: [
    {
      productId: "id",
      name: "Product Name",
      price: 120,
      quantity: 2,
      image: "url",
      subtotal: 240
    }
  ],
  totalItems: 5,
  totalAmount: 850,
  isLoading: false
}
```

### Key Actions
- `addItemToCart` - Add new item or update existing
- `updateItemQuantity` - Change item quantity
- `removeItemFromCart` - Remove specific item
- `clearCart` - Empty entire cart
- `calculateTotals` - Recalculate totals

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/cart/add` | Add item to cart | ✅ |
| GET | `/api/cart/` | Get user cart | ✅ |
| PUT | `/api/cart/update/:id` | Update item quantity | ✅ |
| DELETE | `/api/cart/remove/:id` | Remove item | ✅ |
| DELETE | `/api/cart/clear` | Clear entire cart | ✅ |
| POST | `/api/checkout/stripe-session` | Create Stripe session | ✅ |
| POST | `/api/order/cod` | Place COD order | ✅ |

## 🖥️ Frontend Components

### Cart Component Structure
```
Cart/
├── CartPage.jsx          # Main cart page
├── CartItem.jsx          # Individual cart item
├── CartSummary.jsx       # Total calculation
├── CheckoutButton.jsx    # Payment buttons
└── EmptyCart.jsx         # Empty state
```

### Key React Hooks
```javascript
// Cart management
const { items, totalAmount } = useSelector(state => state.cart);
const dispatch = useDispatch();

// Add to cart
const handleAddToCart = (product, quantity) => {
  dispatch(addToCartAsync({ productId: product._id, quantity }));
};

// Update quantity
const handleUpdateQuantity = (productId, newQuantity) => {
  dispatch(updateItemQuantity({ productId, quantity: newQuantity }));
};
```

## 💰 Payment Flow

### Stripe Payment
1. User clicks "Pay with Stripe"
2. Create Stripe checkout session
3. Redirect to Stripe hosted page
4. Handle success/cancel redirects
5. Webhook processes payment
6. Order created automatically

### COD Payment
1. User enters shipping address
2. Clicks "Place Order (COD)"
3. Order created immediately
4. Payment status: "Pending"
5. Cart cleared after success

## 🔒 Cart Persistence

### Local Storage Backup
```javascript
// Automatic cart backup
localStorage.setItem('blinkit_cart_backup', JSON.stringify(cartData));

// Load on app start
const savedCart = localStorage.getItem('blinkit_cart_backup');
```

### Database Storage
- Authenticated users: Cart stored in MongoDB
- Guest users: localStorage only
- Auto-sync when user logs in

## 🧪 Testing

### Cart Operations
```bash
# Test adding items
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"productId": "123", "quantity": 2}'

# Test getting cart
curl -X GET http://localhost:5000/api/cart/ \
  -H "Authorization: Bearer <token>"
```

### Stripe Testing
```javascript
// Use Stripe test card numbers
4242424242424242  // Visa
4000002500003155  // Mastercard (requires 3DS)
4000000000000002  // Card declined
```

### COD Testing
```javascript
// Test COD order
const testOrder = {
  cartItems: [
    { productId: "123", quantity: 2, price: 100 }
  ],
  address: {
    street: "123 Test St",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  }
};
```

## 🔧 Configuration

### Environment Variables
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_API_URL=http://localhost:5000/api
```

### Stripe Webhook Setup
1. Create webhook endpoint in Stripe Dashboard
2. Set URL: `https://your-domain.com/api/webhook/stripe`
3. Enable events: `checkout.session.completed`
4. Copy webhook secret to environment variables

## 📱 Mobile Responsiveness

### Cart UI Features
- Swipe to remove items (mobile)
- Quantity picker with +/- buttons
- Sticky checkout button
- Touch-friendly interfaces
- Loading states for all actions

## 🚨 Error Handling

### Common Scenarios
- **Out of stock** - Prevent adding unavailable items
- **Network errors** - Retry mechanisms with user feedback
- **Payment failures** - Clear error messages and retry options
- **Session expires** - Auto-redirect to login

### Error Messages
```javascript
const errorMessages = {
  ITEM_NOT_FOUND: "Product not available",
  INSUFFICIENT_STOCK: "Not enough items in stock",
  PAYMENT_FAILED: "Payment processing failed",
  NETWORK_ERROR: "Connection error. Please try again"
};
```

## 🔄 Future Enhancements

- [ ] **Wishlist Integration** - Save for later functionality
- [ ] **Bulk Operations** - Select multiple items
- [ ] **Price Tracking** - Notify on price changes
- [ ] **Cart Sharing** - Share cart via link
- [ ] **Advanced Coupons** - Discount code system
- [ ] **One-Click Reorder** - Repeat previous orders

## 📊 Analytics & Tracking

### Cart Metrics
- Cart abandonment rate
- Average cart value
- Most added/removed items
- Conversion by payment method

### Implementation
```javascript
// Track cart events
analytics.track('Item Added to Cart', {
  productId: product._id,
  productName: product.name,
  price: product.price,
  quantity: quantity
});
```

## 🤝 Contributing

When working on cart/checkout features:

1. **Test thoroughly** - Both payment methods
2. **Handle edge cases** - Network failures, timeouts
3. **Update documentation** - API changes
4. **Mobile testing** - Responsive design
5. **Security review** - Payment data handling

## 📞 Support

For cart and checkout related issues:

- Check browser console for errors
- Verify API endpoint responses
- Test with Stripe test cards
- Review webhook logs
- Contact: tanmaykapoor003@gmail.com

---

**Built with React, Redux Toolkit, Stripe, and Express.js**