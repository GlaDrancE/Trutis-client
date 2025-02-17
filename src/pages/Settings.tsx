import React, { useState } from 'react'
import DashboardLayout from '../layout/Layout'
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Save, Edit2, Lock } from 'lucide-react';
const SettingsPage = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [credentials, setCredentials] = useState<{ id: string; password: string } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCredentials, setEditedCredentials] = useState({ id: '', password: '' });

    const generateCredentials = () => {
        const newId = `REST${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const newPassword = Math.random().toString(36).substr(2, 10);
        setCredentials({ id: newId, password: newPassword });
        setEditedCredentials({ id: newId, password: newPassword });
    };

    const handleEdit = () => {
        if (isEditing) {
            setCredentials(editedCredentials);
        }
        setIsEditing(!isEditing);
    };

    const handleSubscription = () => {
        // Redirect to subscription page
        window.location.href = '/subscription';
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-full mx-auto bg-white shadow-lg">
                {/* Subscription Button */}
                <div className="mb-6 flex justify-end">
                    <Button
                        variant="premium"
                        onClick={handleSubscription}
                    >
                        Subscription
                    </Button>
                </div>

                <Card className="">
                    <CardHeader>
                        <CardTitle className="text-2xl text-blue-800"> Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Enable/Disable Switch */}
                        <div className="flex items-center justify-between py-4 border-b">
                            <div className="space-y-1">
                                <h3 className="text-lg font-medium text-gray-900">Generate Credentials</h3>
                                <p className="text-sm text-gray-500">Enable to generate restaurant ID and password</p>
                            </div>
                            <Switch
                                checked={isEnabled}
                                onCheckedChange={setIsEnabled}
                                className="data-[state=checked]:bg-blue-600"
                            />
                        </div>

                        {/* Generate Button */}
                        {isEnabled && !credentials && (
                            <Button
                                onClick={generateCredentials}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                Generate Credentials
                            </Button>
                        )}

                        {/* Credentials Display */}
                        {credentials && (
                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-medium text-gray-900">Generated Credentials</h4>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleEdit}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Restaurant ID</label>
                                        {isEditing ? (
                                            <Input
                                                value={editedCredentials.id}
                                                onChange={(e) => setEditedCredentials(prev => ({ ...prev, id: e.target.value }))}
                                                className="border-blue-200 focus:border-blue-400"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                                                <span className="text-gray-800">{credentials.id}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Password</label>
                                        {isEditing ? (
                                            <Input
                                                value={editedCredentials.password}
                                                onChange={(e) => setEditedCredentials(prev => ({ ...prev, password: e.target.value }))}
                                                className="border-blue-200 focus:border-blue-400"
                                                type="password"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                                                <Lock className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-800">{credentials.password}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
export const Settings = () => {
    return (
        <DashboardLayout>
            <SettingsPage />
        </DashboardLayout>
    )
}
