import useClient from "@/hooks/client-hook";
import { createContext, useContext, useEffect, useState } from "react";

const CreditContext = createContext<{
    credits: number;
    setCredits: (credits: number) => void;
}>({
    credits: 0,
    setCredits: () => { }
})

export const CreditProvider = ({ children }: { children: React.ReactNode }) => {
    const { client } = useClient();
    const [credits, setCredits] = useState(client?.ClientsCredits?.credits || 0);

    useEffect(() => {
        setCredits(client?.ClientsCredits?.credits || 0);
    }, [client]);

    return (
        <CreditContext.Provider value={{ credits, setCredits }}>
            {children}
        </CreditContext.Provider>
    )
}

export const useCredit = () => {
    return useContext(CreditContext)
}