import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  Rocket, 
  TrendingUp, 
  Search, 
  BarChart3, 
  Zap, 
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track funding trends and market insights with live data visualization"
    },
    {
      icon: Search,
      title: "AI-Powered Search",
      description: "Find similar startups using semantic search technology"
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence",
      description: "Discover emerging trends and investment patterns in AI startups"
    },
    {
      icon: Target,
      title: "Category Analysis",
      description: "Analyze funding distribution across AI infrastructure, dev tools, and more"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Section padding="xl" className="relative overflow-hidden">
        <Container>
          <div className="text-center space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-300">AI Funding Intelligence Platform</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
                Track the Future of
                <br />
                <span className="text-gradient">AI Startups</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Discover, analyze, and track recently funded AI companies with real-time market intelligence and advanced analytics.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/startups">
                  <Button variant="primary" size="lg">
                    <Rocket className="h-5 w-5" />
                    Explore Startups
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="secondary" size="lg">
                    <BarChart3 className="h-5 w-5" />
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Floating gradient orbs */}
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>
        </Container>
      </Section>

      {/* Features Grid */}
      <Section padding="lg">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Everything you need to track and analyze the AI startup ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card variant="gradient" hover padding="lg" className="h-full">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section padding="lg">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card variant="gradient" padding="lg" className="text-center relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="p-4 rounded-full bg-violet-500/20 w-fit mx-auto">
                  <Zap className="h-12 w-12 text-violet-400" />
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-white">
                  Ready to dive in?
                </h2>
                
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Start exploring the AI startup ecosystem today with real-time funding data and market insights.
                </p>

                <Link href="/startups">
                  <Button variant="primary" size="lg">
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-purple-600/10 to-transparent" />
            </Card>
          </motion.div>
        </Container>
      </Section>
    </Layout>
  );
}
