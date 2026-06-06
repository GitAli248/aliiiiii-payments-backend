const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: 'rzp_live_SyJz7vk9bsNR2c',
  key_secret: 'hcN5JzxvBdaz0dJO4gBT0AKV'
});

app.post('/create-order', async (req, res) => {
  try {
    const amount = req.body.amount;
    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: 'rcpt_' + Date.now()
    });
    res.json(order);
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', 'hcN5JzxvBdaz0dJO4gBT0AKV')
      .update(sign)
      .digest('hex');
    if (expectedSign === razorpay_signature) {
      res.json({ status: 'ok', payment_id: razorpay_payment_id });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server on port ' + PORT));
