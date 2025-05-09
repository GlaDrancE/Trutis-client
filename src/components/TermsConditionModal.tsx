import React, { FC } from 'react';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Client } from 'types';

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
                <div className="max-w-3xl mx-auto bg-whitebackground  shadow-lg rounded-lg p-8 mb-12">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-foreground mb-4">Co‑Ownership of Data Agreement</h1>
                    <p className="mb-4 text-foreground dark:text-foreground">
                        <span className="font-semibold">Effective Date:</span> [Effective Date]
                    </p>
                    <p className="mb-4 text-foreground dark:text-foreground">
                        This Agreement is made between <span className="font-semibold">Cosie (Friends Colony)</span> (Party A) and <span className="font-semibold">{client?.owner_name}</span> (Party B) (collectively, the “Co‑Owners”).
                    </p>

                    <h2 className="text-xl font-semibold text-gray-700 dark:text-foreground mt-6 mb-2">1. Definitions</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-muted-foreground">
                        <li><strong>Data:</strong> Any information, records, or digital files created or maintained by the Co‑Owners.</li>
                        <li><strong>Co‑Owned Data:</strong> Data jointly owned by both parties.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-700 dark:text-foreground mt-6 mb-2">2. Co‑Ownership & Rights</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-muted-foreground">
                        <li><strong>Joint Ownership:</strong> Each party holds an equal, undivided interest.</li>
                        <li><strong>Rights to Use:</strong> Each may access, modify, and distribute the Data for lawful purposes.</li>
                        <li><strong>No Unilateral Transfer:</strong> No party may transfer its interest without the other's written consent.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-700 dark:text-foreground mt-6 mb-2">3. Data Management & Security</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-muted-foreground">
                        <li>The Co‑Owners shall jointly maintain data accuracy and integrity.</li>
                        <li>Both parties will implement measures to safeguard the Data against unauthorized access.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-700 dark:text-foreground mt-6 mb-2">4. Use & Licensing</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-muted-foreground">
                        <li>Each grants a non‑exclusive, royalty‑free license to use, modify, and distribute the Data.</li>
                        <li>Use is limited to lawful purposes only.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-700 dark:text-foreground mt-6 mb-2">5. Confidentiality</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-muted-foreground">
                        <li>The Data and related processes are confidential.</li>
                        <li>Disclosure requires prior written consent, except as required by law.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-700 dark:text-foreground mt-6 mb-2">6. Dispute Resolution</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-muted-foreground">
                        <li>Disputes shall first be resolved via good‑faith negotiations.</li>
                        <li>If unresolved within [30] days, mediation and then binding arbitration shall apply.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-700 dark:text-foreground mt-6 mb-2">7. Term & Termination</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-muted-foreground">
                        <li>This Agreement is effective from the Effective Date until terminated by mutual agreement.</li>
                        <li>Either party may terminate with [60] days’ written notice; accrued rights remain.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-700 dark:text-foreground mt-6 mb-2">8. Miscellaneous</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-muted-foreground">
                        <li>This document is the entire agreement and supersedes all prior understandings.</li>
                        <li><strong>Governing Law:</strong> [Jurisdiction].</li>
                        <li>If any provision is invalid, the remainder stays in effect.</li>
                    </ul>

                    <div className="mt-8 border-t border-border dark:border-border pt-4">
                        <p className="mb-2 font-semibold text-foreground dark:text-foreground">IN WITNESS WHEREOF, the Co‑Owners have executed this Agreement as of [Effective Date].</p>
                        <div className="grid grid-cols-2 gap-4 text-sm text-foreground dark:text-foreground">
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

                    <p className="mt-8 text-xs italic text-gray-600 dark:text-muted-foreground">
                        Disclaimer: This sample contract is provided for informational purposes only and does not constitute legal advice. Consult a qualified attorney before use.
                    </p>
                </div>
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