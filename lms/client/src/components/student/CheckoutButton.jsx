import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'YOUR_STRIPE_PUBLISHABLE_KEY');

const CheckoutForm = ({ courseTitle, coursePrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // Send amount and currency to your backend to create a PaymentIntent
    const response = await fetch('http://localhost:5000/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: coursePrice, currency: 'usd' }), // Assuming USD for now
    });
    const { clientSecret, error: backendError } = await response.json();

    if (backendError) {
      console.error(backendError.message);
      alert(`Error: ${backendError.message}`);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Jenny Rosen',
        },
      },
    });

    if (error) {
      console.error(error.message);
      navigate('/payment-failed');
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded!', paymentIntent);
      navigate('/payment-success');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-xl font-semibold mb-4">Complete Your Purchase</h3>
      <p className="text-gray-700 mb-4">Course: {courseTitle} - Price: ${coursePrice}</p>
      <div className="mb-4 p-3 border rounded-md bg-gray-50">
        <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } }, invalid: { color: '#9e2146' } } }} />
      </div>
      <button type="submit" disabled={!stripe} className="w-full bg-primary text-white py-2 px-4 rounded-md text-center font-semibold hover:bg-accent transition duration-300">
        Pay ${coursePrice}
      </button>
    </form>
  );
};

const CheckoutButton = ({ courseTitle, coursePrice }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm courseTitle={courseTitle} coursePrice={coursePrice} />
    </Elements>
  );
};

export default CheckoutButton; 