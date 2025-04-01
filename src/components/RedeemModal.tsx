import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface RedeemModalProps {
    message: string;
    onSubmit: (amount: number) => Promise<void> | void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const RedeemModal = ({ message, onSubmit, isOpen, onOpenChange }: RedeemModalProps) => {
    const [amount, setAmount] = useState<string>('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const numAmount = parseFloat(amount)
        if (!isNaN(numAmount)) {
            onSubmit(numAmount)
            setAmount('')
            onOpenChange(false)
        }
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => { }}
        >
            <DialogContent
                className="sm:max-w-[425px]"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>{message}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="billAmount" className="text-sm font-medium">
                            New Bill Amount
                        </label>
                        <Input
                            type="number"
                            id="billAmount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}