import Lottie from 'react-lottie';
import comingSoonAnimationblack from '../assets/coming-soon-black.json';
import comingSoonAnimationwhite from '../assets/coming-soon-white.json';
import { useTheme } from '@/context/theme-context';

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
        <div className="bg-background min-h-[80vh] flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-full max-w-md">
                        <Lottie
                            options={defaultOptions}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                </div>

                <p className="text-lg text-muted-foreground">
                    We're working hard to bring you the Marketing page. Stay tuned!
                </p>
            </div>
        </div>
    );
};

export default MarketingPage;