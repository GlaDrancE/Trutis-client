import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useClient from '@/hooks/client-hook';
import { updateClient } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { Loader, Loader2, Upload, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from './ui/card';

interface ShopDetails {
    logo: File | null;
    name: string;
    line1: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    googleReviewLink: string;
}

export function ShopDetailsModal() {
    const { client } = useClient();
    const { id } = useParams();
    const [step, setStep] = useState<'details' | 'terms'>('details');
    const [agreed, setAgreed] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [shopDetails, setShopDetails] = useState<ShopDetails>({
        logo: null,
        name: '',
        line1: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        googleReviewLink: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailsEmpty, setIsDetailsEmpty] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (client) {
            timeout = setTimeout(() => {
                const isDetailsEmpty = !client?.shop_name || !client?.line1 || !client?.city ||
                    !client?.state || !client?.country || !client?.pincode ||
                    !client?.googleAPI;
                setIsDetailsEmpty(isDetailsEmpty);
            }, 2000);
        }
        return () => {
            clearTimeout(timeout)

        }
    }, [client]);

    const handleInputChange = (field: keyof ShopDetails) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (field === 'logo') {
            const file = e.target.files?.[0];
            if (file) {
                setShopDetails(prev => ({
                    ...prev,
                    logo: file
                }));
                // Create preview URL
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

    const handleDetailsSubmit = () => {
        // Validate all fields are filled
        const isValid = Object.values(shopDetails).every(value =>
            value !== null && (typeof value === 'string' ? value.trim() !== '' : true)
        );
        if (isValid) {
            setStep('terms');
        } else {
            toast.error('Please fill all the fields');
        }
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
                });
                toast.success('Shop details updated successfully');
                setIsOpen(false);
            } catch (error) {
                console.error('Error updating shop details:', error);
                toast.error('Error updating shop details');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Dialog open={isDetailsEmpty && isOpen} onOpenChange={() => setIsOpen(false)} modal>
            <Toaster />
            <DialogContent className={`${step === 'details' ? 'sm:max-w-[500px]' : 'max-w-[calc(100vw-2rem)] overflow-auto h-content'}`}>

                <DialogHeader>
                    <DialogTitle>
                        {step === 'details' ? 'Complete Your Shop Details' : 'Terms & Conditions'}
                    </DialogTitle>
                </DialogHeader>

                {step === 'details' ? (
                    <div className="space-y-4 py-4 h-[calc(100vh-100px)] overflow-y-auto no-scrollbar ">
                        {/* Image Preview Section */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
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
                            <Label htmlFor="name">Shop Name</Label>
                            <Input
                                id="name"
                                value={shopDetails.name}
                                onChange={handleInputChange('name')}
                                placeholder="Enter your shop name"
                            />
                        </div>
                        <div className="space-y-2 px-1">
                            <Label htmlFor="line1">Address Line 1</Label>
                            <Input
                                id="line1"
                                value={shopDetails.line1}
                                onChange={handleInputChange('line1')}
                                placeholder="Enter your address"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 px-1">
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
                        <div className="grid grid-cols-2 gap-4 px-1">
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
                                    value={shopDetails.pincode}
                                    onChange={handleInputChange('pincode')}
                                    placeholder="Enter pincode"
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
                        </div>
                        <Button className="w-full" onClick={handleDetailsSubmit}>
                            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Continue'}
                        </Button>
                    </div>
                ) : (
                    <Card className='overflow-y-auto w-full min-w-full h-screen'>
                        <CardHeader>
                            <strong>Terms and Conditions</strong>
                        </CardHeader>
                        <CardContent>
                            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-12">
                                <h1 className="text-2xl font-bold text-gray-800 mb-4">Co‑Ownership of Data Agreement</h1>
                                <p className="mb-4"><span className="font-semibold">Effective Date:</span> [Effective Date]</p>
                                <p className="mb-4">This Agreement is made between <span className="font-semibold">Cosie (Friends Colony)</span> (Party A) and <span className="font-semibold">{client?.owner_name}</span> (Party B) (collectively, the “Co‑Owners”).</p>

                                <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">1. Definitions</h2>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li><strong>Data:</strong> Any information, records, or digital files created or maintained by the Co‑Owners.</li>
                                    <li><strong>Co‑Owned Data:</strong> Data jointly owned by both parties.</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">2. Co‑Ownership & Rights</h2>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li><strong>Joint Ownership:</strong> Each party holds an equal, undivided interest.</li>
                                    <li><strong>Rights to Use:</strong> Each may access, modify, and distribute the Data for lawful purposes.</li>
                                    <li><strong>No Unilateral Transfer:</strong> No party may transfer its interest without the other's written consent.</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">3. Data Management & Security</h2>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>The Co‑Owners shall jointly maintain data accuracy and integrity.</li>
                                    <li>Both parties will implement measures to safeguard the Data against unauthorized access.</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">4. Use & Licensing</h2>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>Each grants a non‑exclusive, royalty‑free license to use, modify, and distribute the Data.</li>
                                    <li>Use is limited to lawful purposes only.</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">5. Confidentiality</h2>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>The Data and related processes are confidential.</li>
                                    <li>Disclosure requires prior written consent, except as required by law.</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">6. Dispute Resolution</h2>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>Disputes shall first be resolved via good‑faith negotiations.</li>
                                    <li>If unresolved within [30] days, mediation and then binding arbitration shall apply.</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">7. Term & Termination</h2>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>This Agreement is effective from the Effective Date until terminated by mutual agreement.</li>
                                    <li>Either party may terminate with [60] days’ written notice; accrued rights remain.</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">8. Miscellaneous</h2>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>This document is the entire agreement and supersedes all prior understandings.</li>
                                    <li><strong>Governing Law:</strong> [Jurisdiction].</li>
                                    <li>If any provision is invalid, the remainder stays in effect.</li>
                                </ul>

                                <div className="mt-8 border-t pt-4">
                                    <p className="mb-2 font-semibold">IN WITNESS WHEREOF, the Co‑Owners have executed this Agreement as of [Effective Date].</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p><strong>Party A:</strong> Cosie (Friends Colony)</p>
                                            <p>Date: {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                        </div>
                                        <div>
                                            <p><strong>Party B:</strong> {client?.owner_name}</p>
                                            <p>Date: {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-8 text-xs italic text-gray-600">Disclaimer: This sample contract is provided for informational purposes only and does not constitute legal advice. Consult a qualified attorney before use.</p>
                            </div>
                            <Checkbox id='terms-conditions' checked={agreed} onClick={() => { setAgreed(prev => !prev) }} />
                            <label htmlFor="terms-conditions" className='ml-4'>I have read all the <strong>Terms & Conditions</strong></label>
                        </CardContent>
                        <div className='flex justify-end'>
                            <Button variant="default" className='mb-4 mx-6 w-32' disabled={!agreed || agreed && isLoading} onClick={handleFinalSubmit}>
                                {isLoading ? <Loader className='animate-spin' /> : "Submit"}
                            </Button>
                        </div>
                    </Card>
                )}
            </DialogContent>
        </Dialog>
    );
} 