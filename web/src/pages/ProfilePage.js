import { motion } from 'framer-motion';
import Profile from "../components/Profile";
import Header from "../components/Header";
import Footer from "../components/Footer";

const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    },
};

const MotionWrap = ({ children }) => (
    <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
    >
        {children}
    </motion.div>
);

const ProfilePage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0A192F] to-[#020c1b] text-white">
            <Header />
            <MotionWrap>
                <Profile />
            </MotionWrap>
            <Footer />
        </div>
    );
};


export default ProfilePage;