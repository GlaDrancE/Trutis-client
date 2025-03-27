import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    useClientStore,
    useCouponStore,
    useCustomerStore
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

    useEffect(() => {
        if (id) {
            loadClient(id)
            loadCoupons(id)
            loadCustomers(id)
        }
    }, [id])

    return {
        client,
        coupons,
        customers,
        isLoading: {
            client: clientLoading,
            coupons: couponsLoading,
            customers: customersLoading
        }
    }
}

export default useClient