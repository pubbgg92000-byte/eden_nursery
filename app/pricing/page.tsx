import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans | EDEN Nursery",
  description: "Choose a botanical subscription plan that fits your lifestyle.",
};

const PLANS = [
  {
    name: 'Seedling',
    price: 19,
    description: 'Perfect for new plant parents.',
    features: ['1 Hardy Plant / Month', 'Basic Care Guide', 'Standard Shipping', 'Community Access']
  },
  {
    name: 'Sprout',
    price: 39,
    description: 'For growing collections.',
    features: ['2 Premium Plants / Month', 'Detailed Care Guides', 'Free Priority Shipping', 'Community Access', '10% Shop Discount'],
    recommended: true
  },
  {
    name: 'Bloom',
    price: 69,
    description: 'The ultimate botanical experience.',
    features: ['3 Rare Plants / Month', 'Expert Care Consultation', 'Free Priority Shipping', 'VIP Community Access', '25% Shop Discount', 'Early Access to New Species']
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-emerald-50/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-black text-emerald-900 mb-4 tracking-tighter">Membership Plans</h1>
          <p className="text-emerald-800/60 max-w-2xl mx-auto font-medium">
            Join the EDEN circle. Choose a subscription plan to get hand-selected plants delivered to your sanctuary every month.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 w-full max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <div 
              key={plan.name} 
              className={`flex flex-col rounded-[2.5rem] p-10 transition-all duration-300 ${
                plan.recommended 
                  ? 'bg-emerald-900 text-white shadow-2xl shadow-emerald-200 scale-105 z-10' 
                  : 'bg-white text-emerald-950 border border-emerald-100 shadow-sm hover:shadow-xl'
              }`}
            >
              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <p className={`text-sm mb-6 font-medium ${plan.recommended ? 'text-emerald-200' : 'text-emerald-800/60'}`}>
                {plan.description}
              </p>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-black">${plan.price}</span>
                <span className={`text-sm font-bold ${plan.recommended ? 'text-emerald-300' : 'text-emerald-800/40'}`}>/mo</span>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-bold">
                    <svg className={`w-5 h-5 flex-shrink-0 ${plan.recommended ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 ${
                plan.recommended 
                  ? 'bg-white text-emerald-900 hover:bg-emerald-50' 
                  : 'bg-emerald-900 text-white hover:bg-black'
              }`}>
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
