import React, { FC } from 'react';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Client } from 'types';
import TermsConditions from '@/content/terms&conditions';

interface TermsConditionModalProps {
    client: Client | undefined;
    agreed: boolean;
    setAgreed: (prev: boolean) => void;
    isLoading: boolean;
    handleFinalSubmit: () => void;
}

export const TermsConditionModal: FC<TermsConditionModalProps> = ({ client, agreed, setAgreed, isLoading, handleFinalSubmit }) => {
    return (
        <Card className="w-full min-w-full h-auto px-6 bg-whitebackground  text-foreground dark:text-foreground ">
            <CardContent>
                <TermsConditions ownerName={client?.owner_name || ''} shopName={client?.shop_name || ''} shopAddress={client?.ipAddress || ''} />
                <div className="flex items-center">
                    <Checkbox
                        id="terms-conditions"
                        checked={agreed}
                        onClick={() => setAgreed(!agreed)}
                        className=" dark:border-border"
                    />
                    <label htmlFor="terms-conditions" className="ml-4 text-foreground dark:text-foreground">
                        I have read all the <strong>Terms & Conditions</strong>
                    </label>
                </div>
            </CardContent>
            <div className="flex justify-end">
                <Button
                    variant="default"
                    className="mb-4 mx-6 w-32 bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
                    disabled={!agreed || (agreed && isLoading)}
                    onClick={handleFinalSubmit}
                >
                    {isLoading ? <Loader className="animate-spin" /> : "Submit"}
                </Button>
            </div>
        </Card>
    );
};