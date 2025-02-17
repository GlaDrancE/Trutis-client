import { useEffect, useState } from "react";
import { getClient, getCoupons } from "../../../services/api";
import { useParams } from "react-router-dom";
import { Client, Coupon } from "../../../types";
import toast from "react-hot-toast";

const useClient = () => {
    const [client, setClient] = useState<Client | undefined>(undefined);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState<{
        client: boolean;
        coupons: boolean;
    }>({
        client: false,
        coupons: false,
    });
    const [isError, setIsError] = useState<boolean>(false);
    const { id } = useParams();

    const loadClient = async () => {
        setIsLoading(prev => ({ ...prev, client: true }));
        if (!id) {
            setIsError(true);
            setIsLoading(prev => ({ ...prev, client: false }));
            return;
        }
        const response = await getClient(id);
        console.log(response.data);
        setClient(response.data);
        setIsLoading(prev => ({ ...prev, client: false }));
    }

    const loadCoupons = async () => {
        try {
            setIsLoading(prev => ({ ...prev, coupons: true }))
            if (id) {
                const response = await getCoupons(id);
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
    return { client, isLoading, isError, coupons };
}

export default useClient;