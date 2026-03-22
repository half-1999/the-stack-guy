import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TermsAndConditions() {
    return (
        <>
            <Helmet>
                <title>Terms & Conditions | The Stack Guy</title>
                <meta
                    name="description"
                    content="Read The Stack Guy Terms & Conditions. Know the rules and guidelines of using our services."
                />
            </Helmet>

            <div className="pt-32 pb-24 bg-[#0a0a0f] text-white min-h-screen">
                <div className="container-custom max-w-5xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111118] p-12 rounded-2xl shadow-lg"
                    >
                        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>

                        <div className="space-y-6 text-gray-300">
                            <p>
                                Welcome to <strong>The Stack Guy</strong>! By using our website or services, you agree to the following terms and conditions.
                            </p>

                            <h2 className="text-white font-bold text-2xl mt-6">Use of Services</h2>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>You agree to use our services legally and ethically.</li>
                                <li>You shall not attempt to disrupt or misuse our systems.</li>
                                <li>All content provided is for informational purposes only.</li>
                            </ul>

                            <h2 className="text-white font-bold text-2xl mt-6">Intellectual Property</h2>
                            <p>
                                All content, graphics, and code on this site are the property of The Stack Guy unless otherwise stated. Unauthorized use is prohibited.
                            </p>

                            <h2 className="text-white font-bold text-2xl mt-6">Limitation of Liability</h2>
                            <p>
                                We are not liable for any damages arising from the use of our website or services. Use at your own risk.
                            </p>

                            <h2 className="text-white font-bold text-2xl mt-6">Contact Us</h2>
                            <p>
                                For any questions regarding our Terms & Conditions, please{' '}
                                <Link to="/contact" className="text-blue-400 hover:underline">
                                    get in touch
                                </Link>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}