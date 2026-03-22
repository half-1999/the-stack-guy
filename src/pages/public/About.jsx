import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Zap,
    Rocket,
    Code2,
    Target,
    ArrowRight,
    Sparkles,
    Brain
} from "lucide-react";
// import { Zap, Rocket, Brain, Target, ArrowRight } from "lucide-react";


const fadeUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7 },
};

export default function About() {
    return (
        <div className="bg-[#050508] text-white overflow-hidden">

            {/* 🔥 HERO - IDENTITY */}
            <section className="pt-32 pb-24 px-6 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent blur-[120px]" />

                <motion.div {...fadeUp}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest text-blue-400 mb-8">
                        <Sparkles size={14} /> The Stack Guy
                    </div>

                    <h1 className="text-4xl md:text-7xl font-black uppercase leading-[0.9] mb-6">
                        I DON'T BUILD <br />
                        <span className="gradient-text-blue">WEBSITES.</span> <br />
                        I BUILD <span className="italic font-light">SYSTEMS.</span>
                    </h1>

                    <p className="text-gray-400 max-w-2xl mx-auto text-lg italic">
                        From a confused coder → to building revenue systems for businesses.
                    </p>
                </motion.div>
            </section>

            {/* 🔥 STORY BLOCK 1 */}
            <section className="py-24 px-6">
                <div className="container-custom max-w-3xl">
                    <motion.div {...fadeUp} className="space-y-6 text-gray-300 text-lg">
                        <p>
                            It started like everyone else…
                        </p>

                        <p>
                            Watching tutorials. Copying projects. Building things that looked cool —
                            but solved nothing.
                        </p>

                        <p className="text-white font-semibold">
                            I had skills… but no direction.
                        </p>

                        <p>
                            And then I realized something brutal:
                        </p>

                        <p className="text-red-400 font-bold text-xl">
                            Businesses don’t care about code.
                        </p>

                        <p>
                            They care about results.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 🔥 BREAK MOMENT */}
            <section className="py-24 px-6 text-center bg-[#0a0a0f]/50 border-y border-white/5">
                <motion.div {...fadeUp} className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black uppercase mb-6">
                        THAT CHANGED EVERYTHING.
                    </h2>

                    <p className="text-gray-400 text-lg italic">
                        I stopped building “websites”…
                        and started building{" "}
                        <span className="text-blue-500 font-bold">business systems.</span>
                    </p>
                </motion.div>
            </section>

            <section className="py-24 px-6 text-center">
                <motion.div {...fadeUp} className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-black uppercase mb-8">
                        MY <span className="gradient-text-blue">BELIEF</span>
                    </h2>

                    <p className="text-gray-400 text-lg italic leading-relaxed">
                        “Your website should not sit idle.
                        It should work like a salesperson — 24/7 — bringing leads, closing clients,
                        and scaling your business.”
                    </p>
                </motion.div>
            </section>

            {/* 🔥 TIMELINE JOURNEY */}
            <section className="py-32 px-6">
                <div className="container-custom max-w-4xl space-y-20">

                    {[
                        {
                            year: "2023",
                            title: "Learning Phase",
                            desc: "Exploring web development, building random projects without clarity.",
                        },
                        {
                            year: "2024",
                            title: "Reality Check",
                            desc: "Realized clients don’t need websites — they need growth & leads.",
                        },
                        {
                            year: "2025",
                            title: "System Builder",
                            desc: "Started building full-stack business systems with automation.",
                        },
                        {
                            year: "2026",
                            title: "THE STACK GUY",
                            desc: "Helping businesses launch high-converting digital systems in 48 hours.",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            {...fadeUp}
                            className="flex flex-col md:flex-row gap-6 items-start"
                        >
                            <div className="text-blue-500 font-black text-xl w-24">
                                {item.year}
                            </div>

                            <div className="glass-card p-6 flex-1">
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}

                </div>
            </section>

            {/* 🔥 WHAT I DO */}
            <section className="py-24 px-6 bg-[#0a0a0f]/50">
                <div className="container-custom text-center mb-16">
                    <motion.div {...fadeUp}>
                        <h2 className="text-4xl md:text-6xl font-black uppercase mb-4">
                            WHAT I BUILD
                        </h2>
                        <p className="text-gray-500 italic">
                            Systems that actually make money.
                        </p>
                    </motion.div>
                </div>

                <div className="container-custom grid md:grid-cols-3 gap-10">
                    {[
                        {
                            icon: Code2,
                            title: "Conversion Websites",
                            desc: "Turn visitors into clients with high-converting design.",
                        },
                        {
                            icon: Rocket,
                            title: "Automation Systems",
                            desc: "Save hours with smart workflows & integrations.",
                        },
                        {
                            icon: Target,
                            title: "Lead Funnels",
                            desc: "Generate consistent leads without ads dependency.",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            {...fadeUp}
                            whileHover={{ y: -10 }}
                            className="glass-card p-8 text-center"
                        >
                            <item.icon size={32} className="text-blue-500 mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* WHO I HELP */}
            <section className="py-32 px-6">
                <motion.div {...fadeUp} className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black uppercase">
                        WHO I HELP
                    </h2>
                </motion.div>

                <div className="container-custom grid md:grid-cols-3 gap-8">
                    {[
                        "Coaching Centers",
                        "Clinics",
                        "Restaurants",
                        "Salon Businesses",
                        "Freelancers",
                        "Startup Founders"
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05, y: -8 }}
                            className="glass-card p-6 text-center"
                        >
                            <p className="font-bold">{item}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-32 px-6 bg-[#0a0a0f]/50">
                <motion.div {...fadeUp} className="max-w-6xl mx-auto">

                    <h2 className="text-4xl md:text-6xl font-black text-center mb-20 uppercase">
                        HOW IT WORKS
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: Brain,
                                title: "Understand",
                                desc: "We deeply analyze your business & audience"
                            },
                            {
                                icon: Rocket,
                                title: "Build",
                                desc: "We design & develop your system"
                            },
                            {
                                icon: Target,
                                title: "Launch",
                                desc: "Deploy and optimize for conversions"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="glass-card p-8 text-center"
                            >
                                <item.icon className="mx-auto text-blue-500 mb-4" size={28} />
                                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* STACK PHILOSOPHY */}
            <section className="py-24 px-6">
                <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">

                    <h2 className="text-4xl md:text-6xl font-black uppercase mb-10">
                        THE <span className="gradient-text-blue">STACK OS</span>
                    </h2>

                    <div className="space-y-6 text-gray-400 text-lg">
                        <p>❌ No templates</p>
                        <p>❌ No page builders</p>
                        <p>❌ No slow websites</p>

                        <p className="text-white font-semibold mt-8">
                            Only fast, scalable systems built for growth.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* 🔥 PHILOSOPHY */}


            {/* 🔥 FINAL CTA */}
            {/* <section className="py-32 px-6 text-center relative">
                <div className="absolute inset-0 bg-blue-600/5 blur-[120px]" />

                <motion.div {...fadeUp} className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-7xl font-black uppercase mb-6">
                        READY TO BUILD YOUR <br />
                        <span className="gradient-text-blue">SYSTEM?</span>
                    </h2>

                    <p className="text-gray-500 mb-10 italic">
                        Let’s turn your business into a scalable machine.
                    </p>

                    <Link
                        to="/book-call"
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        Start Now <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section> */}
        </div>
    );
}