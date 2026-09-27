import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, MessageCircle, Route } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const steps = [
    { number: '01', title: 'Tell us your context', text: 'Share your subjects, strengths, interests, and the kind of future you are considering.', icon: MessageCircle },
    { number: '02', title: 'See the landscape', text: 'Compare career directions, courses, and admission requirements with reasoning you can follow.', icon: Compass },
    { number: '03', title: 'Take the next step', text: 'Turn one promising direction into a realistic plan with milestones and progress you can revisit.', icon: Route },
];

export default function About() {
    return (
        <div className="marketing-page app-surface min-h-screen">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-10 md:py-14">
                <div className="flex justify-end mb-5"><Link to="/" className="inline-flex items-center rounded-xl border border-[#d8dfd7] bg-white px-4 py-2 text-sm font-semibold text-[#27483d] hover:bg-[#f4f6f2] transition-colors">← Back to Home</Link></div>
                <div className="max-w-3xl">
                    <p className="marketing-kicker">About the platform</p>
                    <h1 className="marketing-title">Make the next decision with a little more context.</h1>
                    <p className="marketing-lead">NextStep gives you one place to think through your subjects, interests and possible paths — without pretending that you need every answer today.</p>
                </div>
                <div className="marketing-grid grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                    {steps.map(({ number, title, text, icon: Icon }) => (
                        <article key={number} className="marketing-card marketing-animate-card">
                            <span className="marketing-number">{number}</span>
                            <Icon className="w-6 h-6 text-[#c9654b] mt-8" />
                            <h2 className="text-lg font-bold text-[#27483d] mt-5">{title}</h2>
                            <p className="text-sm text-[#66756d] leading-relaxed mt-2">{text}</p>
                        </article>
                    ))}
                </div>
                <div className="marketing-callout marketing-animate-card mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div><p className="marketing-kicker">Start with what you know</p><h2 className="text-2xl font-bold text-[#27483d] mt-2">A useful next step is better than a perfect answer.</h2></div>
                    <Link to="/register"><Button size="lg">Build your profile <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
                </div>
            </main>
        </div>
    );
}
