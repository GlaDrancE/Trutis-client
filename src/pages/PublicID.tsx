import React from 'react'
import { useSearchParams } from 'react-router-dom'

export const PublicID = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const publicId = searchParams.get('public_id')
    console.log(publicId)
    return (
        <>
            <h1>
                {publicId}
            </h1>
        </>
    )
}
