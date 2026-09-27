import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Compass, Sparkles, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const features = [
    { title: 'Career directions', text: 'See paths that make sense for your subjects, interests and the strengths you already have.', icon: Sparkles },
    { title: 'Courses and careers', text: 'Look at related degrees and work paths side by side, so the bigger picture is easier to judge.', icon: Compass },
    { title: 'Eligibility guidance', text: 'Check admission criteria, exams and important dates before you spend time on an application.', icon: CheckCircle2 },
    { title: 'A plan you can use', text: 'Turn a direction into smaller milestones, skills and decisions that fit the rest of your life.', icon: TrendingUp },
];

export default function Features() {
    return (
        <div className="marketing-page app-surface min-h-screen">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-10 md:py-14">
                <div className="flex justify-end mb-5"><Link to="/" className="inline-flex items-center rounded-xl border border-[#d8dfd7] bg-white px-4 py-2 text-sm font-semibold text-[#27483d] hover:bg-[#f4f6f2] transition-colors">← Back to Home</Link></div>
                <div className="max-w-3xl">
                    <p className="marketing-kicker">What you can do here</p>
                    <h1 className="marketing-title">Tools for the questions you’re actually asking.</h1>
                    <p className="marketing-lead">Take one question at a time. Keep the options, notes and next steps together as your thinking changes.</p>
                </div>
                <div className="marketing-grid grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                    {features.map(({ title, text, icon: Icon }, index) => (
                        <article key={title} className="feature-page-card marketing-animate-card">
                            <div className="feature-page-icon"><Icon className="w-6 h-6" /></div>
                            <div><span className="text-xs font-bold text-[#c9654b]">0{index + 1}</span><h2 className="text-xl font-bold text-[#27483d] mt-2">{title}</h2><p className="text-sm text-[#66756d] leading-relaxed mt-2">{text}</p></div>
                        </article>
                    ))}
                </div>
                <div className="text-center mt-8"><Link to="/register"><Button size="lg">Build your profile <ArrowRight className="w-4 h-4 ml-2" /></Button></Link></div>
            </main>
        </div>
    );
}
