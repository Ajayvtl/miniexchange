const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (amount, currency) => {
    try {
        console.log("🔹 Creating Stripe Payment Intent...");
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency,
            payment_method_types: ["card"],
        });

        console.log("✅ Payment Intent Created:", paymentIntent.id);
        return { paymentId: paymentIntent.id, clientSecret: paymentIntent.client_secret };
    } catch (error) {
        console.error("❌ Stripe Payment Error:", error);
        throw error;
    }
};
