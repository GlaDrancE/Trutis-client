import React, { useEffect, useState } from 'react';
import { Camera, Edit2, Loader2, Save, X, Link } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getClient, linkQRCode, updateClient, updateClientIp } from '../../services/api';
import { Client } from '../../types';
import { cn } from '@/lib/utils';
import { TermsConditionModal } from '@/components/TermsConditionModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getIpData } from '@/lib/getIp';
import useClient from '@/hooks/client-hook';

const ProfilePage = () => {
    const { id } = useParams();
    const { client, isLoading, loadClient } = useClient();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<Client | undefined>(client);
    const [file, setFile] = useState<File | null>(null);
    const [tempProfile, setTempProfile] = useState<Client | undefined>(client);
    const [termsShow, setTermsShow] = useState<boolean>(false);
    const [agreed, setAgreed] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [qrDialogOpen, setQrDialogOpen] = useState<boolean>(false);
    const [qrCode, setQrCode] = useState<string>('');
    const [qrLoading, setQrLoading] = useState<boolean>(false);

    useEffect(() => {
        if (client) {

            const updatedClient = {
                ...client,
                maxDiscount: client.maxDiscount ?? 15,
                couponValidity: client.couponValidity ?? 21,
                coinRatio: client.coinRatio ?? 8,
            };
            setProfile(updatedClient);
            setTempProfile(updatedClient);
        }
    }, [client]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (!tempProfile) return;

        if (name === 'coinRatio') {
            const numValue = Number(value);
            if (numValue < 0 || numValue > 100) {
                toast.error("Tugo Coin Percentage must be between 0 and 100");
                return;
            }
        }

        setTempProfile(prev => ({
            ...prev!,
            [name]: type === "radio" || name === 'minOrderValue' || name === 'couponValidity' || name === 'coinRatio'
                ? parseInt(value)
                : value,
        }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const file = e.target.files[0];
        setFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setTempProfile(prev => prev ? {
                ...prev,
                logo: reader.result as string
            } : undefined);
        };
        reader.readAsDataURL(file);
    };

    const handleSelectActiveDays = (day: string) => {
        if (!tempProfile) return;

        if (tempProfile.activeDays?.includes(day)) {
            setTempProfile(prev => ({
                ...prev!,
                activeDays: prev!.activeDays!.filter(d => d !== day)
            }));
        } else {
            setTempProfile(prev => ({
                ...prev!,
                activeDays: [...prev!.activeDays!, day]
            }));
        }
    };

    const handleTerms = async () => {
        const ip_address = await getIpData();
        try {
            const response = await updateClientIp(client?.id as string, ip_address);
            if (response.status === 200) {
                loadClient(client?.id as string);
                setTermsShow(false);
            } else {
                toast.error("Failed to update profile, Try again");
            }
        } catch (error) {
            toast.error("Failed to update profile, Try again");
        }
    };

    const handleSave = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!id) {
            toast.error("Failed to load id, try again");
            return;
        }

        if (!tempProfile) {
            toast.error("Please fill all details");
            return;
        }

        try {
            console.log("tempProfile.activeDays ", tempProfile.activeDays);
            const response = await updateClient(id, {
                ...tempProfile,
                logo: file,
                ipAddress: client?.ipAddress,
                activeDays: tempProfile.activeDays,
                coinRatio: tempProfile.coinRatio
            });

            if (response.status === 200) {
                setProfile(tempProfile);
                setIsEditing(false);
                setTermsShow(false);
                toast.success("Profile updated successfully");
            } else {
                toast.error("Failed to save profile, Try Again");
            }
        } catch (error: any) {
            if (error.response.data === 'Please sign the Terms & Conditions before updating profile') {
                toast.error(error.response.data);
                setTermsShow(true);
            } else {
                toast.error("Something went wrong");
            }
            console.error("Error updating profile:", error);
        }
    };

    const handleLinkQr = async () => {
        if (!tempProfile?.public_key) {
            toast.error("Failed to load public key, Make sure payment is made");
            return;
        }

        if (!qrCode) {
            toast.error("QR Code is required");
            return;
        }

        try {
            setQrLoading(true);
            const linkQR = await linkQRCode(tempProfile.public_key, qrCode);
            if (linkQR.status === 200) {
                toast.success("QR Linked successfully");
                setQrDialogOpen(false);
                setQrCode('');

                if (tempProfile.id) {
                    loadClient(tempProfile.id);
                }
            } else {
                toast.error("Failed to link QR, Try again");
            }
        } catch (error: any) {
            if (error.response?.status === 400) {
                toast.error(error.response.data.error || "Client ID and QR Code are required");
            } else if (error.response?.status === 404) {
                toast.error(error.response.data.error || "Invalid QR Code");
            } else if (error.response?.status === 500) {
                toast.error("An unexpected error occurred. Please try again later.");
            } else {
                toast.error("Failed to link QR Code, Try again");
            }
            console.error("Error linking QR:", error);
        } finally {
            setQrLoading(false);
        }
    };

    const DisplayField = ({ label, value, className }: { label: string; value?: string | number | string[]; className?: string }) => (
        <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">{label}</Label>
            <div className={cn(
                "text-base font-medium p-2 rounded-md bg-muted",
                "text-foreground",
                className
            )}>
                {Array.isArray(value) ? (value.length > 0 ? value.join(', ') : 'Not set') : (value || 'Not set')}
            </div>
        </div>
    );

    if (isLoading.client || !profile || !tempProfile) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                <Loader2 className='animate-spin text-primary' />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 relative">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl text-primary">Profile Settings</CardTitle>
                    {!isEditing && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsEditing(true)}
                            className="h-8 w-8"
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Logo Section */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <div className={`border-2 ${client?.isActive && client?.qr_id ? 'border-green-400' : 'border-red-400'}  shadow-inner p-1 rounded-full`}>
                                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                        {(isEditing ? tempProfile.logo : profile.logo) ? (
                                            <img
                                                src={isEditing ? tempProfile.logo as string : profile.logo as string}
                                                alt="Profile logo"
                                                className="w-full h-full object-cover"
                                                loading='lazy'
                                            />
                                        ) : (
                                            <Camera className="w-12 h-12 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                                {isEditing && (
                                    <label
                                        htmlFor="logo-upload"
                                        className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full cursor-pointer shadow-lg"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </label>
                                )}
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoUpload}
                                    disabled={!isEditing}
                                />
                            </div>
                            <span className="text-sm text-muted-foreground mt-2">Shop logo</span>
                        </div>

                        {profile.public_key && (
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <DisplayField
                                            label="Public Key"
                                            value={profile.public_key}
                                            className="text-primary"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setQrDialogOpen(true)}
                                            className="flex gap-2"
                                        >
                                            <Link className="w-4 h-4" />
                                            Link QR Code
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="space-y-4">
                            {isEditing ? (
                                <>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={tempProfile.email || ''}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="owner_name">Owner Name</Label>
                                        <Input
                                            id="owner_name"
                                            name="owner_name"
                                            value={tempProfile.owner_name}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="shop_name">Shop Name</Label>
                                        <Input
                                            id="shop_name"
                                            name="shop_name"
                                            value={tempProfile.shop_name}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="line1">Line 1</Label>
                                        <Input
                                            id="line1"
                                            name="line1"
                                            value={tempProfile.line1}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={tempProfile.city}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="pincode">Pincode</Label>
                                        <Input
                                            id="pincode"
                                            name="pincode"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="\d{6}"
                                            maxLength={6}
                                            value={tempProfile.pincode}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (/^\d{0,6}$/.test(val)) {
                                                    handleInputChange(e);
                                                }
                                            }}
                                            placeholder="Enter 6-digit pincode"
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State</Label>
                                        <Input
                                            id="state"
                                            name="state"
                                            value={tempProfile.state}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={tempProfile.country}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="googleAPI">Google API Key</Label>
                                        <Input
                                            id="googleAPI"
                                            name="googleAPI"
                                            value={tempProfile.googleAPI}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={tempProfile.phone}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Active Days</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
                                                const isCommon = tempProfile.activeDays?.includes(day);
                                                return (
                                                    <Button
                                                        type="button"
                                                        key={index}
                                                        variant={isCommon ? 'default' : 'outline'}
                                                        className="w-24"
                                                        onClick={() => handleSelectActiveDays(day)}
                                                    >
                                                        {day}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Max Discount</Label>
                                        <div className="flex gap-4">
                                            {[10, 15, 20].map((discount) => (
                                                <label key={discount} className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="maxDiscount"
                                                        value={discount}
                                                        checked={tempProfile.maxDiscount === discount}
                                                        onChange={handleInputChange}
                                                    />
                                                    <span>{discount}%</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Tugo Coin Percentage</Label>
                                        <div className="flex gap-4">
                                            {[5, 8, 10].map((coinRatio) => (
                                                <label key={coinRatio} className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="coinRatio"
                                                        value={coinRatio}
                                                        checked={tempProfile.coinRatio === coinRatio}
                                                        onChange={handleInputChange}
                                                    />
                                                    <span>{coinRatio}%</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    {/* <div>
                                        <Label>Minimum Order Value</Label>
                                        <Input
                                            type="number"
                                            id="minOrderValue"
                                            name="minOrderValue"
                                            value={tempProfile.minOrderValue}
                                            onChange={handleInputChange}
                                            placeholder="Enter Minimum Order Value"
                                            min="0"
                                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            required
                                        />
                                    </div> */}
                                    <div>
                                        <Label>Coupon Valid Till (Days)</Label>
                                        <select
                                            name="couponValidity"
                                            value={tempProfile.couponValidity}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        >
                                            {[2, 21, 28].map((days) => (
                                                <option key={days} value={days}>
                                                    {days} days
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <DisplayField label="Email" value={profile.email} />
                                    <DisplayField label="Owner Name" value={profile.owner_name} />
                                    <DisplayField label="Shop Name" value={profile.shop_name} />
                                    <DisplayField
                                        label="Address"
                                        value={[
                                            profile.line1,
                                            profile.city,
                                            profile.pincode,
                                            profile.state,
                                            profile.country
                                        ].filter(Boolean).join(', ')}
                                    />
                                    <div className="space-y-1">
                                        <Label className="text-sm text-muted-foreground">Google Review Link</Label>
                                        <div className={cn(
                                            "font-medium p-2 rounded-md bg-muted",
                                            "text-foreground",
                                        )}>
                                            {
                                                profile.googleAPI ?
                                                    <a href={profile.googleAPI} target='_blank' rel='noreferrer' className='text-blue-500'>
                                                        Google Review Link
                                                    </a> : "Not set"
                                            }
                                        </div>
                                    </div>
                                    <DisplayField label="Phone Number" value={profile.phone} />
                                    <div>
                                        <Label>Active Days</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
                                                const isCommon = tempProfile.activeDays?.includes(day);
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`cursor-default px-4 py-2 rounded-xl border border-1 border-black ${isCommon ? 'bg-primary text-white' : 'bg-white'}`}
                                                    >
                                                        {day}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <DisplayField
                                        label="Max Discount"
                                        value={profile.maxDiscount ? `${profile.maxDiscount}%` : undefined}
                                    />
                                    <DisplayField
                                        label="Tugo Coin Percentage"
                                        value={profile.coinRatio ? `${profile.coinRatio}%` : undefined}
                                    />
                                    {/* <DisplayField
                                        label="Min Order Value"
                                        value={profile.minOrderValue ? `${profile.minOrderValue} Orders` : undefined}
                                    /> */}
                                    <DisplayField
                                        label="Coupon Validity"
                                        value={profile.couponValidity ? `${profile.couponValidity} Days` : undefined}
                                    />
                                </>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex gap-4">
                                <Button type="submit" className="flex-1">
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setTempProfile(profile);
                                        setIsEditing(false);
                                    }}
                                    className="flex-1"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Terms & Conditions Dialog */}
            <Dialog open={termsShow} onOpenChange={() => setTermsShow(false)} modal>
                <DialogContent className='sm:max-w-[1000px] max-h-[100vh]'>
                    <div className='col-span-1 md:col-span-2 md:px-1 overflow-y-auto max-h-[70vh]'>
                        <TermsConditionModal
                            client={profile}
                            agreed={agreed}
                            setAgreed={setAgreed}
                            isLoading={submitLoading}
                            handleFinalSubmit={handleTerms}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* QR Code Link Dialog */}
            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen} modal>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Link QR Code</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="qrCode">Enter QR Code</Label>
                            <Input
                                id="qrCode"
                                value={qrCode}
                                onChange={(e) => setQrCode(e.target.value)}
                                placeholder="Enter QR code"
                                className="mt-1"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button
                                onClick={handleLinkQr}
                                disabled={qrLoading}
                                className="flex-1"
                            >
                                {qrLoading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Link className="w-4 h-4 mr-2" />
                                )}
                                {qrLoading ? 'Linking...' : 'Link QR Code'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setQrDialogOpen(false);
                                    setQrCode('');
                                }}
                                className="flex-1"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const Profile = () => {
    return (
        <ProfilePage />
    );
};

export default Profile;