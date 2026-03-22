import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <>
            <Helmet>
                <title>Privacy Policy | The Stack Guy</title>
                <meta
                    name="description"
                    content="Read The Stack Guy Privacy Policy. Understand how we handle and protect your data while using our services."
                />
            </Helmet>

            <div className="pt-32 pb-24 bg-[#0a0a0f] text-white min-h-screen">
                <div className="container-custom max-w-5xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111118] p-12 rounded-2xl shadow-lg"
                    >
                        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

                        <div className="space-y-6 text-gray-300">
                            <p>
                                At <strong>The Stack Guy</strong>, we respect your privacy and are committed to protecting your personal information. By using our website and services, you agree to the practices described in this policy.
                            </p>

                            <h2 className="text-white font-bold text-2xl mt-6">Information We Collect</h2>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Personal information you provide (name, email, contact info).</li>
                                <li>Data collected automatically via cookies and analytics tools.</li>
                                <li>Information you submit through forms or communications.</li>
                            </ul>

                            <h2 className="text-white font-bold text-2xl mt-6">How We Use Information</h2>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>To provide and improve our services.</li>
                                <li>To communicate with you regarding updates, promotions, or inquiries.</li>
                                <li>To analyze website usage and optimize user experience.</li>
                            </ul>

                            <h2 className="text-white font-bold text-2xl mt-6">Data Sharing & Security</h2>
                            <p>
                                We do not sell or rent your personal information. We implement industry-standard security measures to protect your data. However, no online system is completely secure, and you use our services at your own risk.
                            </p>

                            <h2 className="text-white font-bold text-2xl mt-6">Your Rights</h2>
                            <p>
                                You may request access, correction, or deletion of your personal data by contacting us. For privacy-related inquiries, please{' '}
                                <Link to="/contact" className="text-blue-400 hover:underline">
                                    get in touch
                                </Link>.
                            </p>

                            <h2 className="text-white font-bold text-2xl mt-6">Updates to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. We encourage you to review this page periodically to stay informed about how we protect your information.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}