"use client";

import Link from "next/link";
import GetStartedButton from "../components/GetStartedButton";

export default function SecurityPage() {
  const features = [
    {
      icon: "🔒",
      title: "End-to-End Encryption",
      description:
        "Your files are encrypted in transit and at rest using industry-standard AES-256 encryption, ensuring maximum security.",
    },
    {
      icon: "🛡️",
      title: "Access Control",
      description:
        "Granular permission management lets you control exactly who can view, download, or manage your sensitive documents.",
    },
    {
      icon: "📊",
      title: "Audit Trails",
      description:
        "Complete visibility into all file activities with detailed logs of every access, download, and modification.",
    },
    {
      icon: "🔐",
      title: "Two-Factor Authentication",
      description:
        "Add an extra layer of security with 2FA to protect your account from unauthorized access.",
    },
    {
      icon: "☁️",
      title: "Secure Cloud Storage",
      description:
        "Enterprise-grade infrastructure hosted on secure servers with 99.9% uptime guarantee.",
    },
    {
      icon: "⚡",
      title: "Real-Time Monitoring",
      description:
        "24/7 security monitoring and instant alerts for any suspicious activity on your data rooms.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, TechVentures Inc.",
      company: "TechVentures",
      image: "👩‍💼",
      rating: 5,
      text: "The security features are outstanding. We've been using this platform for our M&A transactions and the peace of mind it provides is invaluable. The encryption and access controls are exactly what we needed.",
    },
    {
      name: "Michael Rodriguez",
      role: "Legal Partner, Rodriguez & Associates",
      company: "Rodriguez & Associates",
      image: "👨‍⚖️",
      rating: 5,
      text: "As a law firm handling sensitive client data, security is our top priority. This data room solution exceeds our expectations with comprehensive audit trails and bulletproof encryption.",
    },
    {
      name: "Emily Watson",
      role: "Investment Director, Capital Partners",
      company: "Capital Partners",
      image: "👩‍💻",
      rating: 5,
      text: "We've evaluated numerous data room providers, and this is by far the most secure and user-friendly. The granular permissions and real-time monitoring give us complete control over our confidential documents.",
    },
  ];

  const stats = [
    { value: "256-bit", label: "AES Encryption" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "24/7", label: "Security Monitoring" },
    { value: "SOC 2", label: "Compliant" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-zinc-900 dark:via-black dark:to-zinc-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
            <span className="text-5xl">🔐</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-blue-700 dark:text-white mb-6">
            Bank-Level Security
          </h1>
          <p className="text-xl text-zinc-700 dark:text-zinc-300 max-w-3xl mx-auto mb-8">
            Your data deserves the highest level of protection. We use
            military-grade encryption and enterprise security standards to keep
            your sensitive information safe.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <GetStartedButton className="rounded-lg bg-blue-700 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-800 transition">
              Get Started
            </GetStartedButton>
            <Link
              href="#features"
              className="rounded-lg bg-white dark:bg-zinc-800 px-8 py-4 text-lg font-semibold text-blue-700 dark:text-blue-400 shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition border border-zinc-200 dark:border-zinc-700"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-xl p-6 text-center shadow-lg border border-zinc-200 dark:border-zinc-700"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div id="features" className="mb-20">
          <h2 className="text-4xl font-bold text-center text-zinc-800 dark:text-white mb-12">
            Enterprise-Grade Security Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
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

        {/* Testimonials Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-zinc-800 dark:text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients say about
            our security and reliability.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="text-5xl mr-4">{testimonial.image}</div>
                  <div>
                    <h4 className="font-semibold text-zinc-800 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xl">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Compliant & Certified</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            We meet the highest industry standards for data security and
            privacy, ensuring your business stays compliant with regulations.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 font-semibold">
              SOC 2 Type II
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 font-semibold">
              GDPR Compliant
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 font-semibold">
              ISO 27001
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 font-semibold">
              HIPAA Ready
            </div>
          </div>
          <GetStartedButton className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-700 shadow-lg hover:bg-zinc-100 transition">
            Start Secure File Sharing
          </GetStartedButton>
        </div>
      </div>
    </div>
  );
}
