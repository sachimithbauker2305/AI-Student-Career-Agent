import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import MobileAppActions from '../components/MobileAppActions';
import {
  Sparkles,
  ArrowRight,
  Lightbulb,
  Award
} from 'lucide-react';

export default function Home() {
  return (
    <div className="home-page min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      <main className="home-hero flex-1 w-full px-6 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6 rise-in">
            <div className="home-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Career guidance, made practical
            </div>

            <h1 className="home-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95]">
              A little more clarity<br />
              <span>about what comes next.</span>
            </h1>

            <p className="home-copy text-base sm:text-lg leading-relaxed max-w-xl">
              Bring your interests, strengths and academic background together. Compare courses and careers, then turn the option that feels right into a plan you can actually follow.
            </p>

            <div className="flex items-center pt-2">
              <Link to="/register">
                <Button size="lg" className="home-primary-button shadow-lg">
                  Start with your profile <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <MobileAppActions />

            <div className="flex flex-wrap items-center gap-5 pt-2 text-sm font-semibold">
              <Link to="/about" className="home-text-link">See how it works <ArrowRight className="w-4 h-4 inline ml-1" /></Link>
              <Link to="/features" className="home-text-link">Explore the tools <ArrowRight className="w-4 h-4 inline ml-1" /></Link>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center rise-in rise-in-delay-2">
            <div className="home-visual relative w-full max-w-lg aspect-[4/4.25] flex items-center justify-center">
              <div className="home-visual-glow absolute inset-0 rounded-full blur-3xl" />

              <div className="home-visual-card relative rounded-[2rem] p-8 shadow-xl w-full h-full flex flex-col items-center justify-center text-center">
                <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-[1.7rem] overflow-hidden bg-white flex items-center justify-center shadow-xl shadow-[#183f35]/30">
                    <img src="/nextstep-logo.png" alt="NextStep logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -top-1 -left-4 bg-[#e86f51] text-white p-3 rounded-2xl shadow-md hero-orbit">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#80a98f] text-white p-3 rounded-2xl shadow-md hero-orbit-delayed">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Start with what you know</h3>
                <p className="text-sm text-white/75 max-w-sm leading-relaxed mb-6">
                  Answer a few questions, see the options that fit, and keep a simple plan for the next step.
                </p>

                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-2xl p-4 text-left">
                    <span className="text-[11px] font-semibold text-white/60 block uppercase">Profile progress</span>
                    <span className="text-xl font-extrabold text-[#f8c76a] mt-1 block">92% mapped</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 text-left">
                    <span className="text-[11px] font-semibold text-white/60 block uppercase">Next steps</span>
                    <span className="text-xl font-extrabold text-[#80ed99] mt-1 block">5 ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
