import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layout/Layout'
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Save, Edit2, Lock, Loader2 } from 'lucide-react';
import useClient from '@/hooks/client-hook';
import { portalSession, updateStaff } from '../../services/api';
import toast from 'react-hot-toast';
const SettingsPage = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [credentials, setCredentials] = useState<{ id: string; password: string } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCredentials, setEditedCredentials] = useState({ id: '', password: '' });
    const { client } = useClient();
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        console.log(client)
    }, [client]);

    const generateCredentials = async () => {
        try {
            if (client?.id) {
                const newId = `${client?.shop_name}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
                const newPassword = Math.random().toString(36).substr(2, 10);
                setCredentials(prev => ({ ...prev, id: newId, password: newPassword }));
                setEditedCredentials(prev => ({ ...prev, id: newId, password: newPassword }));
                await updateStaff({ client_id: client?.id, staff_id: newId, staff_password: newPassword });
                toast.success('Credentials generated successfully');
            }
        } catch (error) {
            toast.error('Failed to generate credentials');
        }
    };

    const handleEdit = async () => {
        if (client?.id) {
            setCredentials(editedCredentials);
            const saveCredentials = await updateStaff({ client_id: client?.id, staff_id: editedCredentials.id, staff_password: editedCredentials.password });
            if (saveCredentials.status === 201) {
                toast.success('Credentials saved successfully');
            } else {
                toast.error('Failed to save credentials');
            }
        }
        setIsEditing(!isEditing);
    };

    const handleSubscription = () => {
        window.location.href = '/subscription-plans';
    };

    const handlePortalSession = async () => {
        try {
            const session = await portalSession(client?.customer_id as string);
            console.log(client)
            if (session.status === 200) {
                window.location.href = session.data.url;
            } else {
                toast.error('Failed to load manage subscription page');
            }
        } catch (error) {
            toast.error('Failed to load manage subscription page');
        }
    };
    const changeStaffStatus = async () => {
        try {
            if (client?.id) {
                setIsLoading(true);
                const saveCredentials = await updateStaff({ client_id: client?.id, staffStatus: !isEnabled });
                if (saveCredentials.status === 201) {
                    toast.success('Staff status changed successfully');
                } else {
                    toast.error('Failed to change staff status');
                }
                setIsLoading(false);
                setIsEnabled(!isEnabled);
            }
        } catch (error) {
            toast.error('Failed to change staff status');
            setIsLoading(false);
        }
    }
    useEffect(() => {
        if (client) {
            if (client.staffId && client.staffPassword) {
                setCredentials({ id: client.staffId, password: client.staffPassword });
                // setIsEnabled(client.staffStatus || true);
                setEditedCredentials({ id: client.staffId, password: client.staffPassword });
            }
            setIsEnabled(client.staffStatus || false)
        }
    }, [client]);

    return (
        <div className="bg-background p-6 min-h-screen">
            <Card className="bg-card">
                <div className="max-w-full mx-auto shadow-lg p-4">
                    {/* Subscription Button */}
                    <div className="mb-6 flex justify-end">
                        {
                            !client?.isActive && !client?.customer_id ?
                                <Button
                                    variant="premium"
                                    onClick={handleSubscription}
                                >
                                    Subscriptions
                                </Button>
                                :
                                <Button
                                    variant="premium"
                                    onClick={handlePortalSession}
                                >
                                    Manage Subscription
                                </Button>
                        }
                    </div>

                    <CardHeader>
                        <CardTitle className="text-2xl text-foreground"> Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Enable/Disable Switch */}
                        <div className="flex items-center justify-between py-4 border-b">
                            <div className="space-y-1">
                                <h3 className="text-lg font-medium text-muted-foreground">Enable Staff</h3>
                            </div>
                            <Switch
                                checked={isEnabled}
                                onCheckedChange={changeStaffStatus}
                                className="data-[state=checked]:bg-primary"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Generate Button */}
                        {isEnabled && !credentials && (
                            <Button
                                onClick={generateCredentials}
                                className="w-full bg-primary hover:bg-primary/80"
                            >
                                Generate Credentials
                            </Button>
                        )}

                        {/* Credentials Display */}
                        {credentials && (
                            <div className="space-y-4 p-4 bg-secondary rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-medium text-muted-foreground">Generated Credentials</h4>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleEdit}
                                        className="text-primary hover:text-primary/80"
                                    >
                                        {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Restaurant ID</label>
                                        {isEditing ? (
                                            <Input
                                                value={editedCredentials.id}
                                                onChange={(e) => setEditedCredentials(prev => ({ ...prev, id: e.target.value }))}
                                                className="border-blue-200 focus:border-blue-400"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-2 p-2 rounded border ">
                                                <span className="text-foreground">{credentials.id}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Password</label>
                                        {isEditing ? (
                                            <Input
                                                value={editedCredentials.password}
                                                onChange={(e) => setEditedCredentials(prev => ({ ...prev, password: e.target.value }))}
                                                className="border-blue-200 focus:border-blue-400"
                                                type="password"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-2 p-2 rounded border">
                                                <Lock className="h-4 w-4 text-foreground" />
                                                <span className="text-foreground">{credentials.password}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </div>
            </Card>
        </div >
    );
};
export const Settings = () => {
    return (
        <SettingsPage />
    )
}
