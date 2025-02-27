import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import { UserPlus, Edit2, Trash2, Camera, Plus } from 'lucide-react';
import { Client, Plans } from '../../types';
import { createClient, getAgents, getClients, getPlans, updateClient } from '../../services/api';

export const Register = () => {
    const [plans, setPlans] = useState<Plans[]>([]);
    const [agents, setAgents] = useState<any>([]);// TODO: Create Agent Interface
    const [profile, setProfile] = useState('');
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<Client>({
        shop_name: '',
        owner_name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        plan_id: '',
        plan_title: '',
        agent_id: '',
        googleAPI: '',
        logo: null,
    });
    const [editingId, setEditingId] = useState<string | null | undefined>(null);
    useEffect(() => { loadPlans(); loadAgents() }, [])

    const loadPlans = async () => {
        try {
            const response = await getPlans();
            setPlans(response.data)
        } catch (error) {
            toast.error('Failed to load subscription plans');
        }
    }
    const loadAgents = async () => {
        try {
            const response = await getAgents();
            console.log(response)
            setAgents(response.data)
        } catch (error) {
            toast.error("Failed to load agents")
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const img = e.target.files[0]
            const reader = new FileReader();
            reader.readAsDataURL(img)
            setFormData(prev => ({ ...prev, logo: img }))
            reader.onloadend = () => {
                setProfile(reader.result as string)
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData)
        setIsLoading(true)
        try {
            const createdClient = await createClient(formData);
            console.log(createdClient)
            if (createdClient.status == 201) {

                toast.success('Client created successfully');
                setIsLoading(false)

                console.log(createdClient)

                navigate(`/public_key?public_id=${createdClient.data.public_id}`)
            }
            else {
                toast.error('Client created successfully');
            }

        } catch (error) {
            toast.error(editingId ? 'Failed to update client' : 'Failed to create client');
        }
    };
    return (
        <div className='w-full h-full'>
            <header className='w-full p-6 flex justify-center bg-blue-600 text-white text-2xl text-center font-bold'>
                Trutis
            </header>

            <div className="inset-0  flex items-center justify-center">
                <div className="p-8 rounded-lg w-96  h-full overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">
                        {editingId ? 'Edit Client' : 'Add Client'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                            <label className='relative w-32 h-32 bg-gray-300 flex items-center justify-center rounded-full mx-auto cursor-pointer' htmlFor='logo'>
                                {formData.logo != '' ? <img src={profile} className='w-full h-full object-cover rounded-full' /> : <><Plus />
                                    <span className='absolute -bottom-0 -right-0 rounded-full bg-black text-white p-2'>
                                        <Camera className='w-4 h-4' />
                                    </span></>}

                            </label>
                            <input type="file" name="logo" id="logo" onChange={(e) => handleFileChange(e)} className='hidden' accept='image/*' />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Shop Name</label>
                            <input
                                type="text"
                                value={formData.shop_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, shop_name: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Owner Name</label>
                            <input
                                type="text"
                                value={formData.owner_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, owner_name: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    className="w-full p-2 border rounded pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Phone</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Address</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({ ...formData, address: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Google API</label>
                            <input
                                type="text"
                                value={formData.googleAPI}
                                onChange={(e) =>
                                    setFormData({ ...formData, googleAPI: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Subscription</label>
                            <select
                                value={formData.plan_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, plan_id: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select Employment Type</option>
                                {plans.map(plan => (
                                    <option value={plan.id}>{plan.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Agents</label>
                            <select
                                value={agents.id}
                                onChange={(e) =>
                                    setFormData({ ...formData, agent_id: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select Employment Type</option>
                                {agents.map(agent => (
                                    <option value={agent.id}>{agent.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
                            >
                                {
                                    isLoading ?
                                        <LoaderCircle className='animate-spin mx-auto' />
                                        : "Create"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}
