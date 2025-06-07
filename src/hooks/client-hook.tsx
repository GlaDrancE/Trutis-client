import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    useClientStore,
    useCouponStore,
    useCustomerStore,
    useTugoHistoryStore
} from '../store'

const useClient = () => {
    const { id } = useParams()
    const {
        client,
        isLoading: clientLoading,
        loadClient
    } = useClientStore()

    const {
        coupons,
        isLoading: couponsLoading,
        loadCoupons
    } = useCouponStore()

    const {
        customers,
        isLoading: customersLoading,
        loadCustomers
    } = useCustomerStore()

    const {
        tugoHistory,
        isLoading: tugoHistoryLoading,
        loadTugoHistory,
        setIsLoading
    } = useTugoHistoryStore()

    useEffect(() => {
        if (id) {
            loadClient(id)
            loadCoupons(id)
            loadCustomers(id)
            loadTugoHistory(id)
        }
    }, [id])

    useEffect(() => {
        console.log(tugoHistory)
    }, [tugoHistory])

    return {
        client,
        coupons,
        customers,
        tugoHistory,
        isLoading: {
            client: clientLoading,
            coupons: couponsLoading,
            customers: customersLoading,
            tugoHistory: tugoHistoryLoading
        },
        loadClient,
        loadCoupons,
        loadCustomers,
        loadTugoHistory
    }
}

export default useClient