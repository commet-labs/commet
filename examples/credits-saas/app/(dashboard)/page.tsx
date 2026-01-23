import { Button } from "@/components/ui/button";
import { Terminal } from "@/components/terminal";
import { ArrowRight, BarChart3, Coins, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gray-900 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-900 text-sm font-medium mb-6 w-fit mx-auto lg:mx-0">
                <Zap className="w-4 h-4" />
                <span>Powered by Commet</span>
              </div>
              <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl md:text-7xl mb-6">
                The modern way to{" "}
                <span className="underline decoration-4 underline-offset-4">
                  monetize AI.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Build your credit-based SaaS in record time. Seamlessly handle
                subscriptions, usage tracking, and credit packs with our
                ready-to-use starter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-black text-white rounded-xl h-14 px-8 text-lg"
                  asChild
                >
                  <Link href="/sign-up">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl h-14 px-8 text-lg border-gray-200"
                  asChild
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
            <div className="mt-16 lg:mt-0 lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full">
                <div className="absolute -inset-1 bg-gray-800 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <Terminal />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Features
            </h2>
            <p className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need for usage-based billing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Coins className="w-6 h-6" />}
              title="Credits Model"
              description="Flexible consumption with plan credits and purchased packs."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Real-time Tracking"
              description="Instant usage reporting and automated balance deduction."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Instant Checkout"
              description="Pre-integrated Commet checkout for plans and credit packs."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Secure Auth"
              description="Built-in authentication with Better Auth integration."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-gray-300">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold sm:text-4xl mb-6">
                Ready to launch your AI SaaS?
              </h2>
              <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
                Stop building billing from scratch. Use our template to monetize
                your product with credits in just 2 minutes.
              </p>
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-xl h-14 px-10 text-lg font-semibold shadow-lg"
                asChild
              >
                <Link href="/sign-up">Start Building Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-gray-100 text-gray-900 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
