import { getPlansAction } from "@/app/actions/plans";
import { Button } from "@/components/ui/button";
import { checkoutAction } from "@/lib/payments/actions";
import { Check, Zap } from "lucide-react";

function formatBillingInterval(interval: "monthly" | "yearly"): string {
  return interval === "monthly" ? "month" : "year";
}

export default async function PricingPage() {
  const plansResult = await getPlansAction();
  const plans = plansResult.data || [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50/30 min-h-screen">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
          Simple, Credit-Based Pricing
        </h1>
        <p className="text-xl text-gray-600">
          Scale your AI features without worrying about complex tiers. Buy what
          you need, use it whenever you want.
        </p>
      </div>

      {plans.length > 0 ? (
        <div className={`grid gap-8 max-w-4xl mx-auto ${plans.length === 1 ? "md:grid-cols-1" : plans.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              interval={formatBillingInterval(plan.billingInterval)}
              description={plan.description || `Perfect for ${plan.name.toLowerCase()} users.`}
              features={plan.features}
              planCode={plan.planCode}
              highlight={plan.isDefault || index === Math.floor(plans.length / 2)}
            />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-400 mb-2">No plans available</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Plans will appear here once available.
              </p>
            </div>
          </div>
          <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-400 mb-2">No plans available</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Plans will appear here once available.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 max-w-2xl mx-auto bg-gray-100 rounded-2xl p-8 border border-gray-200 flex items-start gap-6">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 shrink-0">
          <Zap className="w-6 h-6 text-gray-900" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            How do credits work?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Credits are used to power AI features. For example, 1 image
            generation costs 50 credits. Your monthly plan credits reset every
            period, but any <strong>purchased credit packs</strong> never
            expire.
          </p>
        </div>
      </div>
    </main>
  );
}

function PricingCard({
  name,
  price,
  interval,
  description,
  features,
  planCode,
  highlight = false,
}: {
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  planCode: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative p-8 rounded-[2rem] flex flex-col h-full transition-all duration-300 ${
        highlight
          ? "bg-white border-2 border-gray-900 shadow-xl shadow-gray-200 scale-105 z-10"
          : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
      }`}
    >
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{name}</h2>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>

      <div className="flex items-baseline mb-8">
        <span className="text-5xl font-extrabold text-gray-900">
          ${price / 100}
        </span>
        <span className="text-gray-500 ml-2 font-medium">/{interval}</span>
      </div>

      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((feature) => (
          <li key={feature} className="flex items-start">
            <div
              className={`mt-1 mr-3 rounded-full p-0.5 ${highlight ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-400"}`}
            >
              <Check className="h-3.5 w-3.5" />
            </div>
            <span className="text-gray-600 text-sm font-medium">{feature}</span>
          </li>
        ))}
      </ul>

      <form action={checkoutAction}>
        <input type="hidden" name="planCode" value={planCode} />
        <Button
          type="submit"
          className={`w-full h-14 rounded-xl text-lg font-bold transition-all duration-300 ${
            highlight
              ? "bg-gray-900 hover:bg-black text-white shadow-lg shadow-gray-300"
              : "bg-gray-900 hover:bg-black text-white"
          }`}
        >
          Get Started
        </Button>
      </form>
    </div>
  );
}
