import { useEffect, useState } from "react";
import { createClientPublicKey, getClient, getCoupons } from "../../services/api";
import { useParams } from "react-router-dom";
import { Client, Coupon } from "../../../types";
import toast from "react-hot-toast";

const useClient = () => {
    const [client, setClient] = useState<Client | undefined>(undefined);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [publicKey, _setPublicKey] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<{
        client: boolean;
        coupons: boolean;
    }>({
        client: false,
        coupons: false,
    });
    const [isError, setIsError] = useState<boolean>(false);
    const clientId = localStorage.getItem("clientId") as string;


    const loadClient = async () => {
        setIsLoading(prev => ({ ...prev, client: true }));
        if (!clientId) {
            setIsError(true);
            setIsLoading(prev => ({ ...prev, client: false }));
            return;
        }
        const response = await getClient(clientId);
        console.log(response.data);
        setClient(response.data);
        _setPublicKey(response.data.public_key);
        setIsLoading(prev => ({ ...prev, client: false }));
    }

    const loadCoupons = async () => {
        try {
            setIsLoading(prev => ({ ...prev, coupons: true }))
            if (clientId) {
                const response = await getCoupons(clientId);
                setCoupons(response.data)
            }
            setIsLoading(prev => ({ ...prev, coupons: false }))

        } catch (error) {
            setIsLoading(prev => ({ ...prev, coupons: false }))
            toast.error("Something went wrong")
            console.error("Something went wrong", error)
        }
    }

    useEffect(() => {
        loadClient();
        loadCoupons();
    }, []);
    return { client, isLoading, isError, coupons, publicKey };
}

export default useClient;