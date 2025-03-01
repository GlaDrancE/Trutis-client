import React, { useEffect, useState } from 'react';
import { Camera, Edit2, Loader, Loader2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layout/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getClient, linkQRCode, updateClient, uploadToCloudinary } from '../../services/api';
import { Client } from '../../types';
import useClient from '@/hooks/client-hook';

interface ProfileData {
    email: string;
    owner_name: string;
    shop_name: string;
    address: string;
    googleAPI: string;
    phone: string;
    logo: string;
}
interface ProfileProps {
    client: Client | undefined;
}

const ProfilePage = () => {
    // Simulated existing data - replace with your actual data source
    const initialData: ProfileData = {
        email: 'shop@example.com',
        owner_name: 'John Smith',
        shop_name: 'The Best Shop',
        address: '123 Main Street, City, Country',
        googleAPI: 'AIzaSyXXXXXXXXXXXXXXX',
        phone: '+1 (555) 123-4567',
        logo: '/api/placeholder/128/128',
    };

    const { id } = useParams();


    const { client, isLoading, isError, publicKey } = useClient();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<Client | undefined>(client);
    const [file, setFile] = useState<File | null>()
    const [tempProfile, setTempProfile] = useState<Client | undefined>(client);
    const navigate = useNavigate();
    const preset = import.meta.env.VITE_UPLOAD_PRESET

    useEffect(() => {
        setProfile(client)
        setTempProfile(client)
    }, [client])


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setTempProfile((prev: any) => ({
            ...prev,
            [name]: type === "radio" || name === 'minOrderValue' || name === 'couponValidity' ? Number(value) : value,
        }));

    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {

            const file = e.target.files[0];
            // setTempProfile(prev => ({
            //     ...prev!,
            //     logo: file
            // }));
            setFile(e.target.files[0])
        }
        // if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setTempProfile(prev => ({
                ...prev!,
                logo: reader.result as string
            }));
        };
        reader.readAsDataURL(e.target.files?.[0] as File);
        // reader.readAsDataURL(file);
        // }


        // try {

        //     const uploadImage = await uploadToCloudinary({ file, upload_preset: preset })
        //     if (uploadImage.status !== 200) {
        //         toast.error("Failed to update image")
        //         return
        //     }
        //     const url = uploadImage.data().secure_url;
        //     if (url)
        //         setTempProfile({ ...tempProfile, logo: url as string } as Client)
        // } catch (error) {
        //     toast.error("Something went wrong")
        //     return;
        // }
    };

    const handleSave = async (e: React.FormEvent) => {
        try {

            e.preventDefault();
            setProfile(tempProfile);
            setIsEditing(false);


            if (!id) {
                toast.error("Failed to load id, try again")
                return;
            }

            if (!tempProfile) {
                toast.error("Please fill all details")
                return;
            }


            const response = await updateClient(id, {
                ...tempProfile,
                logo: file
            });
            if (response.status !== 200) {
                toast.error("Failed to save profile, Try Again")
                return
            }
            console.log(tempProfile)


        } catch (error) {
            toast.error("Something went wrong")
            console.error("Something went wrong: ", error)
        }
    };

    const handleCancel = () => {
        setTempProfile(profile);
        setIsEditing(false);
    };
    const handleLinkQr = async () => {
        try {
            if (!publicKey) { toast.error("Failed to load public key, Make sure payment is made"); return }
            const linkQR = await linkQRCode(publicKey, tempProfile?.qr_id as string)
            console.log("Publickey: ", publicKey)
            if (linkQR.status !== 200) {
                toast.error("Failed to link QR, Try again")
            }
            toast.success("QR Linked")
        } catch (error) {
            toast.error("Failed to link QR, Try again")
            console.error("Failed to load qr: ", error);
        }
    }

    const DisplayField = ({ label, value, className }: { label: string; value: string, className?: string }) => (
        <div className="space-y-1">
            <Label className="text-sm text-gray-500">{label}</Label>
            <div className={`text-base font-medium p-2 bg-gray-50 rounded-md ${className}`}>{value}</div>
        </div>
    );
    if (isError) {
        return (
            <div className='w-full h-screen justify-center items-center flex'>

                <h1 className="text-2xl text-black">
                    Failed to load client details
                </h1>


            </div>
        )
    }


    if (isLoading.client || !profile || !tempProfile) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>

                <div>
                    <Loader2 className='animate-spin' />
                </div>

            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl text-blue-800">Profile Settings</CardTitle>
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

                                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {(isEditing ? tempProfile.logo : profile.logo) ? (
                                        <img
                                            src={isEditing ? tempProfile.logo as string : profile.logo as string}
                                            className="w-full h-full object-cover"
                                            loading='lazy'
                                        />
                                    ) : (
                                        <Camera className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                {isEditing && (
                                    <label
                                        htmlFor="logo-upload"
                                        className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary/90"
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
                            <span className="text-sm text-gray-500 mt-2">Shop logo</span>
                        </div>
                        {/* Form Fields */}
                        <div className="space-y-4">
                            {isEditing ? (
                                <>
                                    {profile.public_key ? <div className='flex items-center justify-between'>
                                        {<DisplayField label='Public Key' value={profile.public_key as string} className='w-full' />}
                                        <div className='flex items-end justify-center'>
                                            <div className='mr-4'>
                                                <Label htmlFor="qr_id">QR</Label>
                                                <Input
                                                    id="qr_id"
                                                    name="qr_id"
                                                    type="qr_id"
                                                    value={tempProfile.qr_id}
                                                    onChange={handleInputChange}
                                                    className="mt-1 mr-4"
                                                    required
                                                />
                                            </div>
                                            <Button onClick={handleLinkQr} className='mt-1' type='button'>
                                                Link
                                            </Button>
                                        </div>
                                    </div> : <DisplayField label='QR ID' value={profile.qr_id as string} className='w-full' />}
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={tempProfile.email}
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
                                        <Label htmlFor="city">City </Label>
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
                                        <Label htmlFor="pincode">Pincode </Label>
                                        <Input
                                            id="pincode"
                                            name="pincode"
                                            value={tempProfile.pincode}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State </Label>
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
                                        <Label htmlFor="country">Country </Label>
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
                                        <Label>Max Discount</Label>
                                        <div className="flex gap-4">
                                            {[10, 20, 30].map((discount) => (
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

                                    {/* Min Order Value */}
                                    <div>
                                        <Label>Minimum Order Value</Label>
                                        <Input
                                            name="minOrderValue"
                                            type="number"
                                            value={tempProfile.minOrderValue}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Valid Till (Dropdown) */}
                                    <div>
                                        <Label>Coupon Valid Till (Days)</Label>
                                        <select
                                            name="couponValidity"
                                            value={tempProfile.couponValidity}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                        >
                                            {[7, 14, 30, 60, 90].map((days) => (
                                                <option key={days} value={days}>
                                                    {days} days
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                </>
                            ) : (
                                <>
                                    {profile.public_key && <div className='flex items-center'>
                                        <DisplayField label="Public Key" className='mr-4' value={profile.public_key as string} />
                                        <DisplayField label="QR Id" value={profile.qr_id as string} />
                                    </div>}
                                    <DisplayField label="Email" value={profile.email} />
                                    <DisplayField label="Owner Name" value={profile.owner_name} />
                                    <DisplayField label="Shop Name" value={profile.shop_name as string} />
                                    <DisplayField label="Address" value={profile.line1 as string + ', ' + profile.city as string + '-' + profile.pincode as string + ', ' + profile.state as string + ', ' + profile.country as string} />
                                    {/* <DisplayField label="City" value={profile.city as string} />
                                    <DisplayField label="State" value={profile.state as string} />
                                    <DisplayField label="Pin Code" value={profile.pincode as string} />
                                    <DisplayField label="Country" value={profile.country as string} /> */}
                                    <DisplayField label="Google API Key" value={profile.googleAPI as string} className={'overflow-hidden'} />
                                    <DisplayField label="Phone Number" value={profile.phone as string} />
                                    <DisplayField label="Max Discount" value={profile.maxDiscount?.toString() + " %"} />
                                    <DisplayField label="Min Order Value" value={profile.minOrderValue?.toString() + " Orders"} />
                                    <DisplayField label="Coupon Validity" value={profile.couponValidity as string + " Days"} />
                                </>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex gap-4">
                                <Button type="submit" className="flex-1 bg-blue-600">
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
const Profile = () => {
    return (
        <DashboardLayout>
            <ProfilePage />
        </DashboardLayout>
    )
}
export default Profile;