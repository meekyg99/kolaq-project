# 🛒 Checkout Flow Testing - kolaqbitters.com

## Test Date: 2025-11-17
## Tester: _________________
## Environment: Production (kolaqbitters.com)
## Backend: kolaq-project-production.up.railway.app

---

## ✅ PRE-TEST CHECKLIST

- [ ] Backend API is healthy: https://kolaq-project-production.up.railway.app/health
- [ ] Products are loading on /shop page
- [ ] Frontend is live on kolaqbitters.com
- [ ] Browser console is open (F12) to catch any errors

---

## 🧪 TEST SUITE 1: CART FUNCTIONALITY

### Test 1.1: Add Single Product to Cart
**Steps:**
1. Visit https://kolaqbitters.com/shop
2. Click on any product card
3. Click "Add to Cart" button
4. Verify cart icon badge shows "1"
5. Click cart icon to view cart page

**Expected Result:**
- ✅ Product appears in cart
- ✅ Correct product name, image, and price
- ✅ Quantity shows "1"
- ✅ Subtotal calculated correctly
- ✅ Shipping fee: ₦4,500 (NGN) or $18 (USD)
- ✅ Total = Subtotal + Shipping

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 1.2: Add Multiple Products
**Steps:**
1. Navigate back to /shop
2. Add 3 different products to cart
3. View cart page

**Expected Result:**
- ✅ All 3 products appear in cart
- ✅ Cart badge shows "3"
- ✅ Each product has correct details
- ✅ Subtotal sums all products correctly

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 1.3: Increase Quantity
**Steps:**
1. On cart page, click "+" button on first item
2. Observe quantity and price changes

**Expected Result:**
- ✅ Quantity increases by 1
- ✅ Item price updates (qty × unit price)
- ✅ Subtotal recalculates
- ✅ Total recalculates
- ✅ Cart badge increases

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 1.4: Decrease Quantity
**Steps:**
1. Click "-" button on an item with qty > 1
2. Observe changes

**Expected Result:**
- ✅ Quantity decreases by 1
- ✅ Prices recalculate correctly
- ✅ Cart badge decreases

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 1.5: Remove Item
**Steps:**
1. Click "Remove" button on one item
2. Observe cart updates

**Expected Result:**
- ✅ Item disappears from cart
- ✅ Cart badge updates
- ✅ Prices recalculate
- ✅ If last item removed, shows "Your cart is empty" message

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 1.6: Clear Cart
**Steps:**
1. Add multiple items to cart
2. Click "Clear Cart" button
3. Observe results

**Expected Result:**
- ✅ All items removed
- ✅ "Your cart is empty" message displays
- ✅ Cart badge shows "0" or disappears
- ✅ "Browse Products" button appears

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 1.7: Currency Switch in Cart
**Steps:**
1. Add items to cart in NGN
2. Switch currency to USD
3. Observe price changes

**Expected Result:**
- ✅ All prices convert to USD
- ✅ Shipping changes to $18
- ✅ Total recalculates in USD

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

## 🧪 TEST SUITE 2: CHECKOUT PROCESS

### Test 2.1: Navigate to Checkout
**Steps:**
1. With items in cart, click "Proceed to Checkout" button
2. Observe checkout page loads

**Expected Result:**
- ✅ Redirects to /checkout
- ✅ Order summary shows all cart items
- ✅ Correct subtotal, shipping, and total
- ✅ Contact form displays
- ✅ Delivery details form displays
- ✅ Payment preferences section displays

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 2.2: Empty Cart Checkout Attempt
**Steps:**
1. Clear cart completely
2. Navigate directly to /checkout

**Expected Result:**
- ✅ Shows "Your cart is waiting" message
- ✅ "Browse Products" button appears
- ✅ Cannot proceed with checkout

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 2.3: Form Validation - Required Fields
**Steps:**
1. Add product to cart, go to checkout
2. Click "Place Order" without filling any fields
3. Observe validation

**Expected Result:**
- ✅ Form does not submit
- ✅ Required fields highlighted:
  - First name
  - Last name
  - Email
  - Phone
  - Address
  - City
  - State
  - Country

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 2.4: Form Validation - Email Format
**Steps:**
1. Fill form with invalid email (e.g., "test@")
2. Try to submit

**Expected Result:**
- ✅ Form rejects invalid email format
- ✅ Browser/form shows email validation error

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 2.5: Successful Order Submission (Paystack)
**Steps:**
1. Fill out complete valid form:
   - First Name: John
   - Last Name: Doe
   - Email: test@kolaqbitters.com
   - Phone: +2348012345678
   - Company: Test Company (optional)
   - Address: 123 Test Street
   - City: Lagos
   - State: Lagos
   - Country: Nigeria
2. Select "Paystack (₦)" payment option
3. Click "Place Order"
4. Wait for response

**Expected Result:**
- ✅ Button shows "Processing..." during submission
- ✅ No console errors (check F12)
- ✅ Success page displays with:
  - Green checkmark icon
  - "Order placed successfully" message
  - Order number (e.g., ORD-20251117-XXXX)
  - "Track Order" button
  - "Continue Shopping" button
- ✅ Cart clears (badge shows 0)
- ✅ Order confirmation message mentions concierge team

**Actual Result:**
- [ ] Pass / [ ] Fail
- Order Number: _________________
- Notes: _________________

---

### Test 2.6: Successful Order Submission (Stripe)
**Steps:**
1. Add items to cart
2. Go to checkout
3. Fill form with valid data
4. Select "Stripe (USD)" payment option
5. Submit order

**Expected Result:**
- ✅ Order submits successfully
- ✅ Order number generated
- ✅ Success page displays
- ✅ Cart clears

**Actual Result:**
- [ ] Pass / [ ] Fail
- Order Number: _________________
- Notes: _________________

---

### Test 2.7: Backend Order Creation Verification
**Steps:**
1. After placing order, note the order number
2. Check backend logs (Railway dashboard)
3. Or use API: `curl https://kolaq-project-production.up.railway.app/orders/:orderNumber`

**Expected Result:**
- ✅ Order appears in backend
- ✅ All customer details saved correctly
- ✅ Order items match cart contents
- ✅ Currency is correct
- ✅ Status is "PENDING"
- ✅ Payment method saved in notes

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

## 🧪 TEST SUITE 3: ORDER TRACKING

### Test 3.1: Track Order from Success Page
**Steps:**
1. After successful order, click "Track Order" button
2. Observe tracking page

**Expected Result:**
- ✅ Redirects to /track-order?number=ORD-XXXXX
- ✅ Order details display
- ✅ Shows correct status
- ✅ Shows customer info
- ✅ Shows order items

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 3.2: Track Order via Manual Entry
**Steps:**
1. Navigate to /track-order (or home page tracking section)
2. Enter valid order number
3. Submit

**Expected Result:**
- ✅ Order loads successfully
- ✅ All details display correctly

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 3.3: Track Invalid Order Number
**Steps:**
1. Go to order tracking
2. Enter fake order number (e.g., "ORD-99999999-FAKE")
3. Submit

**Expected Result:**
- ✅ Shows "Order not found" message
- ✅ No crash or error page

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

## 🧪 TEST SUITE 4: EDGE CASES & ERROR HANDLING

### Test 4.1: Network Error Simulation
**Steps:**
1. Open DevTools (F12)
2. Go to Network tab
3. Set throttling to "Offline"
4. Try to place order
5. Restore network

**Expected Result:**
- ✅ Shows error message
- ✅ Form doesn't clear
- ✅ User can retry
- ✅ No data loss

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 4.2: Back Button During Checkout
**Steps:**
1. Fill checkout form halfway
2. Click browser back button
3. Return to checkout page

**Expected Result:**
- ✅ Cart items still present
- ✅ Can continue checkout
- ✅ No data corruption

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 4.3: Multiple Tab Checkout
**Steps:**
1. Open two browser tabs with checkout page
2. Place order in tab 1
3. Try to place order in tab 2

**Expected Result:**
- ✅ Second order either succeeds or shows appropriate error
- ✅ No duplicate orders
- ✅ Cart state synchronized

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 4.4: Page Refresh During Checkout
**Steps:**
1. Fill checkout form
2. Refresh page (F5)
3. Observe results

**Expected Result:**
- ✅ Cart persists (localStorage)
- ✅ Can continue checkout
- ✅ Form is empty (for security)

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

### Test 4.5: Very Large Order Quantity
**Steps:**
1. Add item to cart
2. Manually increase quantity to 100+
3. Try to checkout

**Expected Result:**
- ✅ Cart handles large quantities
- ✅ Prices calculate correctly
- ✅ Order submits successfully
- ✅ No overflow errors

**Actual Result:**
- [ ] Pass / [ ] Fail
- Notes: _________________

---

## 🧪 TEST SUITE 5: MOBILE RESPONSIVENESS

### Test 5.1: Mobile Cart Experience
**Steps:**
1. Open site on mobile device or responsive mode (F12 → Toggle device toolbar)
2. Add items to cart
3. View cart page

**Expected Result:**
- ✅ Cart displays properly on mobile
- ✅ All buttons are accessible
- ✅ Quantity controls work
- ✅ Text is readable

**Actual Result:**
- [ ] Pass / [ ] Fail
- Device: _________________
- Notes: _________________

---

### Test 5.2: Mobile Checkout Form
**Steps:**
1. On mobile, go to checkout
2. Fill out form
3. Submit order

**Expected Result:**
- ✅ Form fields are easy to tap
- ✅ Keyboard types correct for each field (email, tel, etc.)
- ✅ Payment options are selectable
- ✅ Submit button is accessible
- ✅ Success page displays properly

**Actual Result:**
- [ ] Pass / [ ] Fail
- Device: _________________
- Notes: _________________

---

## 🧪 TEST SUITE 6: BROWSER COMPATIBILITY

### Test 6.1: Chrome/Edge
- [ ] Pass / [ ] Fail - Version: _____

### Test 6.2: Firefox
- [ ] Pass / [ ] Fail - Version: _____

### Test 6.3: Safari
- [ ] Pass / [ ] Fail - Version: _____

### Test 6.4: Mobile Safari (iOS)
- [ ] Pass / [ ] Fail - Version: _____

### Test 6.5: Mobile Chrome (Android)
- [ ] Pass / [ ] Fail - Version: _____

---

## 🧪 TEST SUITE 7: PERFORMANCE & UX

### Test 7.1: Checkout Load Time
**Steps:**
1. Open DevTools → Network tab
2. Clear cache
3. Navigate to /checkout with items in cart
4. Measure load time

**Expected Result:**
- ✅ Page loads in < 3 seconds
- ✅ No blocking resources
- ✅ Images load progressively

**Actual Result:**
- [ ] Pass / [ ] Fail
- Load Time: _____ seconds
- Notes: _________________

---

### Test 7.2: Form Submission Response Time
**Steps:**
1. Fill checkout form
2. Note time when clicking "Place Order"
3. Note time when success page appears

**Expected Result:**
- ✅ Response within 2-5 seconds
- ✅ User sees "Processing..." feedback
- ✅ No timeout errors

**Actual Result:**
- [ ] Pass / [ ] Fail
- Response Time: _____ seconds
- Notes: _________________

---

### Test 7.3: Console Errors Check
**Steps:**
1. Throughout all tests, monitor browser console (F12)
2. Note any errors, warnings, or network failures

**Expected Result:**
- ✅ No critical errors
- ✅ No 404s for resources
- ✅ No CORS errors
- ✅ API calls succeed (200/201 status)

**Actual Result:**
- [ ] Pass / [ ] Fail
- Errors Found: _________________

---

## 📊 SUMMARY

### Total Tests: 40
### Tests Passed: _____
### Tests Failed: _____
### Pass Rate: _____%

### Critical Issues:
1. _________________
2. _________________
3. _________________

### Minor Issues:
1. _________________
2. _________________
3. _________________

### Recommendations:
1. _________________
2. _________________
3. _________________

---

## 🚀 QUICK TEST COMMANDS

### Test Backend Health:
```bash
curl https://kolaq-project-production.up.railway.app/health
```

### Test Products Endpoint:
```bash
curl https://kolaq-project-production.up.railway.app/products
```

### Test Order Creation (manual):
```bash
curl -X POST https://kolaq-project-production.up.railway.app/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "customerPhone": "+2348012345678",
    "shippingAddress": "123 Test St, Lagos, Nigeria",
    "currency": "NGN",
    "items": [{"productId": 1, "quantity": 2}],
    "notes": "Test order"
  }'
```

### Test Order Tracking:
```bash
curl https://kolaq-project-production.up.railway.app/orders/ORD-20251117-XXXX
```

---

## ✅ SIGN-OFF

**Tester Name:** _________________
**Date:** _________________
**Signature:** _________________

**Approved By:** _________________
**Date:** _________________
**Signature:** _________________
