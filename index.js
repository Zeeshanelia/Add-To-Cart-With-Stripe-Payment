import express from 'express'
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config(); // Load env first!

const app = express();

// server.js or app.js
app.use(express.json());
app.use(cors());
app.post('/api/makepayment', async (req, res) => {
    const { items } = req?.body;
    console.log("items", items);

    try {
        const { cartAllProduct } = req.body;
        const items = cartAllProduct;

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items?.map(item => ({
                price_data: {
                    currency: "pkr",
                    product_data: {
                        name: item?.model,
                        images: [item?.img],
                    },
                    unit_amount: item?.price * 100,
                },
                quantity: item?.count,
            })),
            mode: 'payment',
            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/cancel',
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});