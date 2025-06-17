import Lottie from 'react-lottie';
import comingSoonAnimationblack from '../assets/coming-soon-black.json';
import comingSoonAnimationwhite from '../assets/coming-soon-white.json';
import { useTheme } from '@/context/theme-context';
import MarketingComponents from '@/components/MarketingComponents';


const MarketingPage = () => {
    const { theme } = useTheme();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: theme === "dark" ? comingSoonAnimationwhite : comingSoonAnimationblack,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
        },
    };


    return (
        <div className="bg-background min-h-[80vh] flex flex-col p-2 gap-2">
            <h2>Dashboard / Marketing</h2>
            <MarketingComponents/>
        </div>
    );
};

export default MarketingPage;