import React, { useEffect, useState } from 'react';
import { Camera, Edit2, Loader, Loader2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layout/Layout';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getClient, updateClient } from '../../../services/api';
import { Client } from '../../../types';

interface ProfileData {
    email: string;
    owner_name: string;
    shop_name: string;
    address: string;
    googleAPI: string;
    phone: string;
    logo: string;
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


    const [isEditing, setIsEditing] = useState(false);
    const [isError, setIsError] = useState(false);

    const [profile, setProfile] = useState<Client>();
    const [tempProfile, setTempProfile] = useState<Client>();

    useEffect(() => {

        loadClient();
    }, [])
    const loadClient = async () => {
        try {
            if (!id) { toast.error("failed to load id"); return }
            const response = await getClient(id)
            if (response.status !== 200) {
                toast.error("Something went wrong")
                setIsError(true)
                return;
            }
            setProfile(response.data)
            setTempProfile(response.data)
        } catch (error) {
            console.error(error)
            setIsError(true)
            toast.error("Something went wrong")
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTempProfile((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempProfile(prev => ({
                    ...prev!,
                    logo: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        try {

            e.preventDefault();
            setProfile(tempProfile);
            setIsEditing(false);
            console.log(tempProfile)


            if (!id) {
                toast.error("Failed to load id, try again")
                return;
            }
            if (!tempProfile) {
                toast.error("Please fill all details")
                return;
            }
            const response = await updateClient(id, tempProfile);
            if (response.status !== 200) {
                toast.error("Failed to save profile, Try Again")
                return
            }

            console.log(response);

        } catch (error) {
            toast.error("Something went wrong")
            console.error("Something went wrong: ", error)
        }
    };

    const handleCancel = () => {
        setTempProfile(profile);
        setIsEditing(false);
    };

    const DisplayField = ({ label, value }: { label: string; value: string }) => (
        <div className="space-y-1">
            <Label className="text-sm text-gray-500">{label}</Label>
            <div className="text-base font-medium p-2 bg-gray-50 rounded-md">{value}</div>
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
    if (!profile || !tempProfile) {
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
            <Toaster />
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl">Profile Settings</CardTitle>
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
                                            src={isEditing ? tempProfile.logo : profile.logo}
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
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={tempProfile.email}
                                            onChange={handleInputChange}
                                            className="mt-1"
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
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={tempProfile.address}
                                            onChange={handleInputChange}
                                            className="mt-1"
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
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <DisplayField label="Email" value={profile.email} />
                                    <DisplayField label="Owner Name" value={profile.owner_name} />
                                    <DisplayField label="Shop Name" value={profile.shop_name as string} />
                                    <DisplayField label="Address" value={profile.address as string} />
                                    <DisplayField label="Google API Key" value={profile.googleAPI as string} />
                                    <DisplayField label="Phone Number" value={profile.phone as string

                                    } />
                                </>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex gap-4">
                                <Button type="submit" className="flex-1">
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