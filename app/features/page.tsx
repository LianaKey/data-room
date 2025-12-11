"use client";

import GetStartedButton from "../components/GetStartedButton";

export default function FeaturesPage() {
  const features = [
    {
      icon: "📁",
      title: "Unlimited Data Rooms",
      description:
        "Create as many secure data rooms as you need. Organize your projects, deals, and collaborations without restrictions.",
    },
    {
      icon: "🔒",
      title: "End-to-End Encryption",
      description:
        "Military-grade 256-bit encryption ensures your files are protected both in transit and at rest.",
    },
    {
      icon: "👥",
      title: "Granular Access Control",
      description:
        "Set precise permissions for each user. Control who can view, download, or manage specific files and folders.",
    },
    {
      icon: "📊",
      title: "Detailed Analytics",
      description:
        "Track every interaction with comprehensive audit logs. Know exactly who accessed what and when.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast Uploads",
      description:
        "Drag and drop large files with ease. Our optimized infrastructure handles files of any size efficiently.",
    },
    {
      icon: "🌐",
      title: "Access Anywhere",
      description:
        "Work from any device, anywhere in the world. Your secure data rooms are always accessible.",
    },
    {
      icon: "📥",
      title: "Bulk Operations",
      description:
        "Download multiple files or entire folders as ZIP archives. Efficient bulk actions save you time.",
    },
    {
      icon: "🎨",
      title: "Beautiful Interface",
      description:
        "Intuitive design with dark mode support. Professional appearance meets exceptional usability.",
    },
    {
      icon: "🔍",
      title: "Smart Search",
      description:
        "Find files instantly with powerful search capabilities. Navigate large document collections with ease.",
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small teams and individual professionals",
      features: [
        "5 Data Rooms",
        "50 GB Storage",
        "Basic Access Controls",
        "Email Support",
        "Audit Logs (30 days)",
        "Mobile Access",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Ideal for growing businesses and enterprises",
      features: [
        "Unlimited Data Rooms",
        "500 GB Storage",
        "Advanced Permissions",
        "Priority Support",
        "Full Audit Trail",
        "2FA Authentication",
        "Custom Branding",
        "API Access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with specific needs",
      features: [
        "Unlimited Everything",
        "Dedicated Storage",
        "SSO Integration",
        "24/7 Phone Support",
        "Compliance Features",
        "Dedicated Account Manager",
        "Custom Integrations",
        "SLA Guarantee",
      ],
      popular: false,
    },
  ];

  const benefits = [
    {
      icon: "💼",
      title: "M&A Transactions",
      description:
        "Securely share due diligence documents with potential buyers or investors while maintaining complete control and visibility.",
    },
    {
      icon: "⚖️",
      title: "Legal Discovery",
      description:
        "Organize and share sensitive legal documents with clients and opposing counsel in a secure, auditable environment.",
    },
    {
      icon: "🏢",
      title: "Board Communications",
      description:
        "Share board materials, meeting minutes, and confidential documents with directors in a secure portal.",
    },
    {
      icon: "🤝",
      title: "Client Collaboration",
      description:
        "Work seamlessly with clients by sharing project files, deliverables, and updates in dedicated secure rooms.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-zinc-900 dark:via-black dark:to-zinc-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 mb-6">
            <span className="text-5xl">✨</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-blue-700 dark:text-white mb-6">
            Powerful Features
          </h1>
          <p className="text-xl text-zinc-700 dark:text-zinc-300 max-w-3xl mx-auto mb-8">
            Everything you need to securely share, manage, and track your
            confidential documents. Built for professionals who demand the best.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center text-zinc-800 dark:text-white mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={`feature-${idx}`}
                className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-zinc-800 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center text-zinc-800 dark:text-white mb-4">
            Built for Your Industry
          </h2>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
            Trusted by professionals across industries for secure document
            sharing and collaboration.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={`benefit-${idx}`}
                className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-semibold text-zinc-800 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-zinc-800 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core
            security features and can be upgraded anytime.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <div
                key={`plan-${idx}`}
                className={`rounded-2xl p-8 shadow-xl border-2 transition-all hover:shadow-2xl hover:-translate-y-1 ${
                  plan.popular
                    ? "border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 dark:border-blue-500 relative"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-blue-700 dark:text-blue-400">
                    {plan.price}
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {plan.period}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li
                      key={`plan-${idx}-feature-${fIdx}`}
                      className="flex items-start gap-2"
                    >
                      <span className="text-green-600 dark:text-green-400 text-xl">
                        ✓
                      </span>
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who trust us with their most
            sensitive documents. Start your secure data room today.
          </p>
          <GetStartedButton />
        </div>
      </div>
    </div>
  );
}
