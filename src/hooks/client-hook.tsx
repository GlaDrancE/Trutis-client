import { useEffect, useState } from "react";
import { createClientPublicKey, getClient, getCoupons, getCustomers } from "../../services/api";
import { useParams } from "react-router-dom";
import { Client, Coupon, CustomerData } from "../../types/index";
import toast from "react-hot-toast";

const useClient = () => {
    const [client, setClient] = useState<Client | undefined>(undefined);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [publicKey, _setPublicKey] = useState<string | undefined>(undefined);
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [isLoading, setIsLoading] = useState<{
        client: boolean;
        coupons: boolean;
        customers: boolean;
    }>({
        client: false,
        coupons: false,
        customers: false,
    });
    const [isError, setIsError] = useState<boolean>(false);
    const { id } = useParams();
    const [isClientLoad, setIsClientLoad] = useState<boolean>(false)


    const loadClient = async () => {
        setIsLoading(prev => ({ ...prev, client: true }));
        if (!id) {
            setIsError(true);
            setIsLoading(prev => ({ ...prev, client: false }));
            return;
        }
        const response = await getClient(id);
        setClient(response.data);
        _setPublicKey(response.data.public_key);
        setIsLoading(prev => ({ ...prev, client: false }));
    }

    const loadCoupons = async () => {
        try {
            setIsLoading(prev => ({ ...prev, coupons: true }))
            if (id) {
                const response = await getCoupons(id);
                setCoupons(response.data)
                console.log("coupons ", response.data)
            }
            setIsLoading(prev => ({ ...prev, coupons: false }))

        } catch (error) {
            setIsLoading(prev => ({ ...prev, coupons: false }))
            toast.error("Something went wrong")
            console.error("Something went wrong", error)
        }
    }
    const loadCustomers = async () => {
        try {
            setIsLoading(prev => ({ ...prev, customers: true }))
            const response = await getCustomers(id as string);
            console.log(response.data)
            setCustomers(response.data)
            setIsLoading(prev => ({ ...prev, customers: false }))
        } catch (error) {
            setIsLoading(prev => ({ ...prev, customers: false }))
            toast.error("Something went wrong")
            console.error("Something went wrong", error)
        }
    }

    useEffect(() => {
        if (!isClientLoad) {
            setIsClientLoad(true)
            loadClient();
            loadCoupons();
            loadCustomers();
        }
    }, [id]);
    return { client, isLoading, isError, coupons, publicKey, customers, loadCoupons };
}

export default useClient;