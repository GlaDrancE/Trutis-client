import Lottie from 'react-lottie';
import comingSoonAnimationblack from '../assets/coming-soon-black.json';
import comingSoonAnimationwhite from '../assets/coming-soon-white.json';
import { useTheme } from '@/context/theme-context';
import MarketingComponents from '@/components/MarketingComponents';
import { useCustomerStore } from '@/store';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { CustomerData } from 'types';
import EmailTemplateEditor from '@/components/EmailTemplateEditor';
import { getCampaigns, getMarketingHistory, getTemplates } from '../../services/api';


const MarketingPage = () => {
    const { id } = useParams();
    const { theme } = useTheme();
    const [newCustomers, setNewCustomers] = useState<CustomerData[]>([]);
    const [oldCustomers, setOldCustomers] = useState<CustomerData[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [marketingHistory, setMarketingHistory] = useState<any[]>([]);

    const handleTemplates = () => {
        getTemplates(id ?? '')
            .then((resp: any) => setTemplates(resp.data.templates))
            .catch((err: any) => console.error(err));
    }

    const handleMarketingHistory = () => {
        getMarketingHistory(id ?? '')
            .then((resp: any) => setMarketingHistory(() => { return resp.data.marketingHistory }))
            .catch((err: any) => console.error(err));
    }
    const handleFetchCampaigns = () => {
        getCampaigns()
            .then((resp: any) => setCampaigns(resp.data.campaigns))
            .catch((err: any) => console.error(err));
    }


    useEffect(() => {
        if (id) {
            handleTemplates()
            handleMarketingHistory()
            handleFetchCampaigns()
        }
    }, [id])
    useEffect(() => {
        if (marketingHistory.length > 0) {
            setMarketingHistory(marketingHistory)
            console.log("Marketing history updated", marketingHistory.length)
        }
    }, [marketingHistory.length])


    const customerStore = useCustomerStore();


    // useEffect(() => {
    //     if (id) {
    //         customerStore.loadCustomers(id)

    //         setNewCustomers(customerStore.customers.filter(customer => customer.isLoyalCustomer === false))
    //         setOldCustomers(customerStore.customers.filter(customer => customer.isLoyalCustomer === true))
    //     }
    //     console.log(newCustomers, oldCustomers)
    // }, [id])


    // const defaultOptions = {
    //     loop: true,
    //     autoplay: true,
    //     animationData: theme === "dark" ? comingSoonAnimationwhite : comingSoonAnimationblack,
    //     rendererSettings: {
    //         preserveAspectRatio: 'xMidYMid meet',
    //     },
    // };


    return (
        <div className=" min-h-[80vh] flex flex-col p-2 gap-2">
            <MarketingComponents templates={templates} handleTemplates={handleTemplates} handleMarketingHistory={handleMarketingHistory} marketingHistory={marketingHistory} campaigns={campaigns} handleFetchCampaigns={handleFetchCampaigns} setCampaigns={setCampaigns} />
        </div>
    );
};

export default MarketingPage;