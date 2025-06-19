import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Coins, User, Calendar, Search, Filter, TrendingUp, Plus, UserPlus, IndianRupee, Loader2 } from 'lucide-react';
import { useTugoHistoryStore } from '@/store/slices/tugoHistoryStore';
import { TugoHistory } from 'types';
import { useParams } from 'react-router';
import useClient from '@/hooks/client-hook';


const TugoCoinsHistory: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const { tugoHistory, isLoading } = useClient();


    // Mock data showing coins assigned and used
    const [transactions, setTransactions] = useState<TugoHistory[]>(tugoHistory);
    useEffect(() => {
        setTransactions(tugoHistory)
    }, [tugoHistory])

    // Filter transactions based on search term and selected filter
    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch =
            transaction.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.customer_code.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = selectedFilter === 'all' || transaction.historyType === selectedFilter;

        return matchesSearch && matchesFilter;
    });

    // Calculate stats
    const totalCoinsAssigned = transactions.filter(t => t.historyType === 'ASSIGNED').reduce((sum, t) => sum + t.coin, 0);
    const totalCoinsUsed = transactions.filter(t => t.historyType === 'USED').reduce((sum, t) => sum + t.coin, 0);
    const netCoins = totalCoinsAssigned - totalCoinsUsed;

    // const handleAddTransaction = () => {
    //     if (newTransaction.customerId && newTransaction.customer_name && newTransaction.coins && newTransaction.rupeeAmount && newTransaction.percentage) {
    //         const transaction: TugoTransaction = {
    //             customerId: newTransaction.customerId,
    //             customer_name: newTransaction.customer_name,
    //             coins: parseInt(newTransaction.coins),
    //             rupeeAmount: parseInt(newTransaction.rupeeAmount),
    //             percentage: parseInt(newTransaction.percentage),
    //             date: new Date().toISOString().split('T')[0],
    //             type: 'assigned',
    //             assignedBy: newTransaction.assignedBy

    //         };

    //         setTransactions([transaction, ...transactions]);
    //         setNewTransaction({
    //             customerId: '',
    //             customer_name: '',
    //             coins: '',
    //             rupeeAmount: '',
    //             percentage: '',
    //             assignedBy: 'Owner'
    //         });
    //         setShowAddForm(false);
    //     }
    // };

    return (
        <div className="min-h-screen bg-white p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                {/* <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                            <Coins className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Tugo Coins Management
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg">Track assigned and used Tugo coins for your customers</p>
                </div> */}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="text-gray-600 text-sm">Tugo Coins Added to Customers</p>
                                    <p className="text-2xl font-bold text-green-600">{totalCoinsAssigned.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <Coins className="w-8 h-8 text-red-600" />
                                <div>
                                    <p className="text-gray-600 text-sm">Tugo Coins Redeemed by Customers</p>
                                    <p className="text-2xl font-bold text-red-600">{totalCoinsUsed.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <UserPlus className="w-8 h-8 text-blue-600" />
                                    <div>
                                        <p className="text-gray-600 text-sm">Net Balance</p>
                                        <p className="text-2xl font-bold text-blue-600">{netCoins.toLocaleString()}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Assign
                                </Button>
                            </div>
                        </CardContent>
                    </Card> */}
                </div>

                {/* Add Transaction Form */}
                {/* {showAddForm && (
                    <Card className="mb-6 bg-gray-50 border-gray-200 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-gray-800">Assign Tugo Coins to Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                    placeholder="Customer ID (e.g., CUST001)"
                                    value={newTransaction.customerId}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, customerId: e.target.value })}
                                    className="bg-white border-gray-300"
                                />
                                <Input
                                    placeholder="Customer Name"
                                    value={newTransaction.customer_name}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, customer_name: e.target.value })}
                                    className="bg-white border-gray-300"
                                />
                                <select
                                    value={newTransaction.assignedBy}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, assignedBy: e.target.value })}
                                    className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="Owner">Owner</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                    type="number"
                                    placeholder="Coins amount"
                                    value={newTransaction.coins}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, coins: e.target.value })}
                                    className="bg-white border-gray-300"
                                />
                                <Input
                                    type="number"
                                    placeholder="Rupee amount"
                                    value={newTransaction.rupeeAmount}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, rupeeAmount: e.target.value })}
                                    className="bg-white border-gray-300"
                                />
                                <Input
                                    type="number"
                                    placeholder="Percentage (%)"
                                    value={newTransaction.percentage}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, percentage: e.target.value })}
                                    className="bg-white border-gray-300"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleAddTransaction}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                >
                                    Assign Coins
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAddForm(false)}
                                    className="border-gray-300 text-gray-700"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )} */}

                {/* Search and Filter Controls */}
                <Card className="mb-6 bg-white border-gray-200 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by customer name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={selectedFilter === 'all' ? 'default' : 'outline'}
                                    onClick={() => setSelectedFilter('all')}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    All
                                </Button>
                                <Button
                                    variant={selectedFilter === 'ASSIGNED' ? 'default' : 'outline'}
                                    onClick={() => setSelectedFilter('ASSIGNED')}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                >
                                    Assigned
                                </Button>
                                <Button
                                    variant={selectedFilter === 'used' ? 'default' : 'outline'}
                                    onClick={() => setSelectedFilter('used')}
                                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                                >
                                    Used
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions List */}
                <div className="space-y-4">
                    {isLoading.tugoHistory ? <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div> : (
                        filteredTransactions.map((transaction) => (
                            <Card
                                key={transaction.id}
                                className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full border ${transaction.historyType === 'ASSIGNED'
                                                ? 'bg-green-100 border-green-200'
                                                : 'bg-red-100 border-red-200'
                                                }`}>
                                                <User className={`w-6 h-6 ${transaction.historyType === 'ASSIGNED' ? 'text-green-600' : 'text-red-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">{transaction.customer_name}</h3>
                                                <p className="text-gray-600 text-sm flex items-center gap-2">
                                                    <span>ID: {transaction.customer_code}</span>
                                                    <span className="text-gray-400">•</span>
                                                    <span>{transaction.historyType === "ASSIGNED" ? 'Assigned' : 'Used'} by: {transaction.assignedBy}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="flex items-center gap-4">
                                                {transaction.historyType === "ASSIGNED" && <div className="text-center">
                                                    <p className="text-gray-500 text-xs"> Amount</p>
                                                    <p className="text-lg font-semibold text-gray-700 flex items-center">
                                                        <IndianRupee className="w-4 h-4" />
                                                        {transaction.amount.toLocaleString()}
                                                    </p>
                                                </div>}
                                                <div className="text-center">
                                                    <p className="text-gray-500 text-xs">Percentage</p>
                                                    <p className="text-lg font-semibold text-blue-600">{transaction.coinRatio}%</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-2xl font-bold ${transaction.historyType === "ASSIGNED" ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {transaction.coin} TC
                                                    </p>
                                                    <p className="text-gray-500 text-sm flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-500">
                    <p className="text-sm">Showing {filteredTransactions.length} of {transactions.length} transactions</p>
                </div>
            </div>
        </div>
    );
};

export default TugoCoinsHistory;