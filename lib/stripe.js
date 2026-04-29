import Stripe from "stripe";

let _stripe;

function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

const stripe = new Proxy({}, {
  get(_, prop) {
    return getStripe()[prop];
  },
});

export default stripe;
