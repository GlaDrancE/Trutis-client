import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useClient from '@/hooks/client-hook';
import { logOutClient, updateClient } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { TermsConditionModal } from './TermsConditionModal';
import { getIpData } from '@/lib/getIp';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import entugo_logo_dark from '../assets/entugo_logo_dark.png';
import entugo_logo_light from '../assets/entugo_logo_light.png';
import { useTheme } from '@/context/theme-context';

interface ShopDetails {
    logo: File | null;
    name: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    googleReviewLink: string;
    activeDays: string[];
    ipAddress: string | undefined;
}

export function ShopDetailsModal() {
    const { client } = useClient();
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState<'basic' | 'logoReview' | 'terms'>('basic');
    const [agreed, setAgreed] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [ip, setIp] = useState<string | undefined>(undefined);
    const [shopDetails, setShopDetails] = useState<ShopDetails>({
        logo: null,
        name: '',
        phone: client?.phone || '',
        line1: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        activeDays: [],
        ipAddress: ip || undefined,
        googleReviewLink: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailsEmpty, setIsDetailsEmpty] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubscriptionPopupOpen, setIsSubscriptionPopupOpen] = useState(false);
    const [hasShownSubscriptionPopup, setHasShownSubscriptionPopup] = useState(
        sessionStorage.getItem('hasShownSubscriptionPopup') === 'true'
    );
    const { theme } = useTheme();

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (client) {
            if (!client.ipAddress) {
                getIpData().then(ip => {
                    setIp(ip);
                });
            }
            timeout = setTimeout(() => {
                const isDetailsEmpty = !client?.shop_name || !client?.line1 || !client?.city ||
                    !client?.state || !client?.country || !client?.pincode;
                setIsDetailsEmpty(isDetailsEmpty);

                if (isDetailsEmpty) {
                    setIsOpen(true);
                } else if (!client.isActive && !hasShownSubscriptionPopup) {
                    setIsSubscriptionPopupOpen(true);
                    setHasShownSubscriptionPopup(true);
                    sessionStorage.setItem('hasShownSubscriptionPopup', 'true');
                }
            }, 2000);
            setShopDetails({
                ...shopDetails,
                name: client?.shop_name || '',
                line1: client?.line1 || '',
                city: client?.city || '',
                phone: client?.phone || '',
                activeDays: client?.activeDays || [],
                state: client?.state || '',
                country: client?.country || '',
                pincode: client?.pincode || '',
                googleReviewLink: client?.googleAPI || '',
                ipAddress: ip || undefined
            });
        }
        return () => {
            clearTimeout(timeout);
        };
    }, []);

    const handleInputChange = (field: keyof ShopDetails) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (field === 'logo') {
            const file = e.target.files?.[0];
            if (file) {
                setShopDetails(prev => ({
                    ...prev,
                    logo: file
                }));
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setShopDetails(prev => ({
                ...prev,
                [field]: e.target.value
            }));
        }
    };

    const handleRemoveImage = () => {
        setShopDetails(prev => ({
            ...prev,
            logo: null
        }));
        setPreviewUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSelectActiveDays = (day: string) => {
        if (shopDetails.activeDays.includes(day)) {
            setShopDetails(prev => ({
                ...prev,
                activeDays: prev.activeDays.filter(d => d !== day)
            }));
        } else {
            setShopDetails(prev => ({
                ...prev,
                activeDays: [...prev.activeDays, day]
            }));
        }
    };

    const handleBasicSubmit = () => {
        if (shopDetails.pincode.length !== 6) {
            toast.error("Please Enter Correct PinCode!");
            return;
        }
        const requiredFields = {
            name: shopDetails.name,
            phone: shopDetails.phone,
            line1: shopDetails.line1,
            city: shopDetails.city,
            state: shopDetails.state,
            country: shopDetails.country,
            pincode: shopDetails.pincode,
            activeDays: shopDetails.activeDays.length > 0
        };

        const isValid = Object.values(requiredFields).every(value =>
            typeof value === 'string' ? value.trim() !== '' : value
        );

        if (isValid) {
            setStep('logoReview');
        } else {
            toast.error('Please fill all required fields');
        }
    };

    const handleLogoReviewSubmit = () => {
        setStep('terms');
    };

    const handleFinalSubmit = async () => {
        if (agreed) {
            try {
                setIsLoading(true);
                await updateClient(id as string, {
                    shop_name: shopDetails.name,
                    logo: shopDetails.logo,
                    line1: shopDetails.line1,
                    city: shopDetails.city,
                    state: shopDetails.state,
                    country: shopDetails.country,
                    pincode: shopDetails.pincode,
                    phone: shopDetails.phone,
                    email: client?.email,
                    owner_name: client?.owner_name,
                    googleAPI: shopDetails.googleReviewLink,
                    ipAddress: ip || undefined,
                    activeDays: shopDetails.activeDays
                });
                toast.success('Shop details updated successfully');
                setIsOpen(false);
                setIsDetailsEmpty(false);
                if (!client?.isActive && !hasShownSubscriptionPopup) {
                    setIsSubscriptionPopupOpen(true);
                    setHasShownSubscriptionPopup(true);
                    sessionStorage.setItem('hasShownSubscriptionPopup', 'true');
                }
            } catch (error) {
                console.error('Error updating shop details:', error);
                toast.error('Error updating shop details');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBuySubscription = () => {
        setIsSubscriptionPopupOpen(false);
        navigate(`/${id}/subscription-plans`);
    };

    const handleCloseShopDetailsModal = () => {
        setIsOpen(false);
        setStep("basic");
        if (!client?.isActive && !hasShownSubscriptionPopup) {
            setIsSubscriptionPopupOpen(true);
            setHasShownSubscriptionPopup(true);
            sessionStorage.setItem('hasShownSubscriptionPopup', 'true');
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleCloseShopDetailsModal} modal>
                <Toaster />
                <DialogContent className="sm:max-w-[1000px] max-h-[100vh]">
                    <div className={`grid ${step === 'terms' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4 h-full`}>
                        {step !== 'terms' && (
                            <div className="col-span-1 bg-whitebackground p-4 rounded-lg flex flex-col justify-center items-center">
                                <div className="mb-4">
                                    <div className="w-full h-w-full rounded-2xl overflow-hidden flex items-center justify-center">
                                        <img
                                            src={theme === "dark" ? entugo_logo_dark : entugo_logo_light}
                                            alt="Branch Information Logo"
                                            className="w-full h-full object-contain"
                                            style={{ background: 'transparent' }}
                                        />
                                    </div>
                                </div>
                                {/* <h2 className="text-xl font-bold mb-2">Branch Information</h2> */}
                                <p className="text-sm text-gray-600 text-center">
                                    Fill the business information of your branch
                                </p>
                            </div>
                        )}
                        <div className="col-span-1 md:col-span-2 md:px-1 overflow-y-auto max-h-[70vh]">
                            {step === 'basic' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Contact Information</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Shop Email</Label>
                                        <Input
                                            id="email"
                                            value={client?.email}
                                            placeholder="Enter your shop email"
                                            disabled={client?.email ? true : false}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ownerName">Owner Name</Label>
                                        <Input
                                            id="ownerName"
                                            value={client?.owner_name}
                                            placeholder="Enter your shop owner name"
                                            disabled={client?.owner_name ? true : false}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={client?.phone ? client.phone : shopDetails.phone}
                                            onChange={handleInputChange('phone')}
                                            placeholder="Enter your shop phone number"
                                            disabled={client?.phone ? true : false}
                                        />
                                    </div>
                                    <Separator />
                                    <h3 className="text-lg font-semibold">Shop Details</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="shopName">Shop Name</Label>
                                        <Input
                                            id="shopName"
                                            value={shopDetails.name}
                                            onChange={handleInputChange('name')}
                                            placeholder="Enter your shop name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="activeDays" className="mb-2 block">Active Days</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
                                                <div key={index}>
                                                    <Checkbox
                                                        id="activeDays"
                                                        checked={shopDetails.activeDays.includes(day)}
                                                        className="hidden"
                                                    />
                                                    <Button
                                                        variant={`${shopDetails.activeDays.includes(day) ? 'default' : 'outline'}`}
                                                        className="w-full"
                                                        onClick={() => handleSelectActiveDays(day)}
                                                    >
                                                        {day}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Separator />
                                    <h3 className="text-lg font-semibold">Address</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="line1">Address Line 1</Label>
                                        <Input
                                            id="line1"
                                            value={shopDetails.line1}
                                            onChange={handleInputChange('line1')}
                                            placeholder="Enter your address"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={shopDetails.city}
                                                onChange={handleInputChange('city')}
                                                placeholder="Enter city"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Input
                                                id="state"
                                                value={shopDetails.state}
                                                onChange={handleInputChange('state')}
                                                placeholder="Enter state"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="country">Country</Label>
                                            <Input
                                                id="country"
                                                value={shopDetails.country}
                                                onChange={handleInputChange('country')}
                                                placeholder="Enter country"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pincode">Pincode</Label>
                                            <Input
                                                id="pincode"
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                value={shopDetails.pincode}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (/^\d{0,6}$/.test(val)) {
                                                        handleInputChange('pincode')(e);
                                                    }
                                                }}
                                                placeholder="Enter 6-digit pincode"
                                            />

                                        </div>
                                    </div>
                                    <div>
                                        <Button className="w-full" onClick={handleBasicSubmit}>
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {step === 'logoReview' && (
                                <div className="space-y-4 mt-2">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                                {previewUrl ? (
                                                    <img
                                                        src={client?.logo ? client?.logo as string : previewUrl}
                                                        alt="Shop logo preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Upload className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>
                                            {previewUrl && (
                                                <button
                                                    onClick={handleRemoveImage}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-2 w-full px-1">
                                            <Label htmlFor="logo">Shop Logo</Label>
                                            <Input
                                                ref={fileInputRef}
                                                id="logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleInputChange('logo')}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 px-1">
                                        <Label htmlFor="googleReview">Google Review Link</Label>
                                        <Input
                                            id="googleReview"
                                            value={shopDetails.googleReviewLink}
                                            onChange={handleInputChange('googleReviewLink')}
                                            placeholder="Enter your Google Review link"
                                        />
                                        <a
                                            href="https://support.google.com/business/answer/7035772"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm ml-2 text-blue-500 hover:underline"
                                        >
                                            How to get Google Review link?
                                        </a>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button className="w-full" onClick={handleLogoReviewSubmit}>
                                            Next
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full text-gray-500 hover:text-gray-700"
                                            onClick={handleLogoReviewSubmit}
                                        >
                                            Skip
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {step === 'terms' && (
                                <TermsConditionModal
                                    client={client}
                                    agreed={agreed}
                                    setAgreed={setAgreed}
                                    isLoading={isLoading}
                                    handleFinalSubmit={handleFinalSubmit}
                                />
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isSubscriptionPopupOpen} onOpenChange={setIsSubscriptionPopupOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Subscription Required</DialogTitle>
                        <DialogDescription>
                            Your account is not active. Please buy a subscription plan to continue.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleBuySubscription}>Buy Subscription</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}