# 🚨 CRITICAL SETUP GUIDE - Fix All Issues

## 🔍 **Current Issues Identified:**

1. **Backend Environment Missing**: No `backend/.env` file
2. **Frontend Environment Missing**: No `.env.local` file  
3. **Port Conflicts**: Multiple servers running on different ports
4. **Payment API**: Need to configure MTN MoMo API
5. **Static Files 404**: Next.js files not serving properly

---

## 🔧 **STEP 1: Create Backend Environment File**

Create `backend/.env` with this content:

```env
DATABASE_URL="postgresql://postgres:0123@localhost:5434/akazuba_florist"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRES_IN=30d
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxx
ADMIN_EMAIL=admin@akazubaflorist.com
ADMIN_PASSWORD=akazuba2024
```

---

## 🔧 **STEP 2: Create Frontend Environment File**

Create `.env.local` in the root directory with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# MTN MoMo API Configuration
NEXT_PUBLIC_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
NEXT_PUBLIC_MOMO_API_KEY=your-momo-api-key
NEXT_PUBLIC_MOMO_API_USER=your-momo-api-user
NEXT_PUBLIC_MOMO_ENVIRONMENT=sandbox
```

---

## 🔧 **STEP 3: Get MTN MoMo API Keys**

1. **Sign up**: https://momodeveloper.mtn.com/
2. **Create app**: Register your application
3. **Get API Keys**: Copy your API key and user ID
4. **Set environment**: Use 'sandbox' for testing, 'live' for production
5. **Replace keys**: Update the placeholders in `.env.local`

### **MTN MoMo API v2.0 Benefits:**
- ✅ **Direct Integration**: No third-party fees
- ✅ **Real USSD Prompts**: Direct MTN MoMo integration
- ✅ **Lower Fees**: Better rates than payment gateways
- ✅ **Local Support**: MTN Rwanda support
- ✅ **Compliance**: Meets Rwandan regulations
- ✅ **Latest API**: v2.0 with enhanced features
- ✅ **Better Performance**: Improved response times

---

## 🔧 **STEP 4: Get Flutterwave API Keys (for Bank Transfers)**

1. **Sign up**: https://dashboard.flutterwave.com/
2. **Verify account**: Complete business verification
3. **Get API Keys**: Go to Settings → API Keys
4. **Copy keys**: Replace placeholders in `backend/.env`

---

## 🔧 **STEP 5: Kill All Running Processes**

```bash
# Kill all Node.js processes
taskkill /F /IM node.exe
```

---

## 🔧 **STEP 6: Start Backend Server**

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Akazuba Florist API server running on port 5000
📚 API Documentation: http://localhost:5000/api-docs
🏥 Health Check: http://localhost:5000/health
```

---

## 🔧 **STEP 7: Start Frontend Server**

```bash
# In a new terminal (from root directory)
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.2.31
- Local:        http://localhost:3000
```

---

## 🔧 **STEP 8: Test Everything**

### **Backend Tests:**
- Health Check: http://localhost:5000/health
- API Docs: http://localhost:5000/api-docs
- Payment Endpoint: http://localhost:5000/api/v1/payments/initiate

### **Frontend Tests:**
- Home Page: http://localhost:3000
- Checkout: http://localhost:3000/checkout
- Cart: http://localhost:3000/cart

---

## 🧪 **STEP 9: Test Payment Flow**

### **MTN MoMo Payment:**
1. **Go to**: http://localhost:3000/checkout
2. **Fill in**: Customer details
3. **Select**: MTN MoMo payment
4. **Enter**: MTN Rwanda phone number (+250 788 123 456)
5. **Click**: "Pay with MTN MoMo"
6. **Expected**: USSD prompt on phone (no CORS error)

### **Bank Transfer:**
1. **Go to**: http://localhost:3000/checkout
2. **Fill in**: Customer details
3. **Select**: Bank transfer
4. **Enter**: Account details
5. **Click**: "Proceed to Bank Transfer"
6. **Expected**: Redirect to Flutterwave payment page

---

## ✅ **Expected Results:**

### **No More Errors:**
- ❌ No "Invalid authorization key"
- ❌ No "404 Not Found" for static files
- ❌ No CORS errors
- ❌ No port conflicts

### **Working Features:**
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ MTN MoMo API working (direct integration)
- ✅ Bank transfer API working (Flutterwave)
- ✅ Checkout page loading
- ✅ Payment flows working

---

## 🆘 **Troubleshooting:**

### **If Backend Won't Start:**
- Check if PostgreSQL is running on port 5434
- Verify `backend/.env` file exists
- Check Flutterwave API keys are valid

### **If Frontend Won't Start:**
- Check if port 3000 is available
- Verify `.env.local` file exists
- Clear Next.js cache: `Remove-Item -Recurse -Force .next`

### **If MTN MoMo Payment Fails:**
- Check MTN MoMo API keys in `.env.local`
- Verify phone number format (2507xxxxxxxx)
- Test with MTN MoMo sandbox numbers
- Check MTN MoMo developer portal for errors

### **If Bank Transfer Fails:**
- Check Flutterwave API keys in `backend/.env`
- Verify Flutterwave account is verified
- Test with Flutterwave test account details

---

## 🎯 **Success Indicators:**

1. **Backend**: `http://localhost:5000/health` returns OK
2. **Frontend**: `http://localhost:3000` loads without errors
3. **MTN MoMo v2.0**: Payment modal opens and sends USSD prompt
4. **Bank Transfer**: Redirects to Flutterwave payment page
5. **No Console Errors**: Browser console shows no CORS or 404 errors

---

## 🏦 **Payment Architecture:**

### **MTN MoMo v2.0 (Direct Integration):**
```
Frontend → MTN MoMo API v2.0 → Customer Phone (USSD) → Payment Complete
```

### **Bank Transfer (Flutterwave):**
```
Frontend → Backend → Flutterwave → Customer → Payment Complete
```

---

**🚀 Follow these steps exactly and both payment methods will work!**