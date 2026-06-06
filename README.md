# Ali Payments Backend

Node.js/Express backend for Razorpay payment processing.

## Setup

1. `npm install`
2. Update Razorpay keys in `server.js`
3. `npm start`

## API

- `POST /create-order` — creates a Razorpay order
- `POST /verify-payment` — verifies payment signature
