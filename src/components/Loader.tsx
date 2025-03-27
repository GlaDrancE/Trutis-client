import React from 'react'

export const Loader = () => {
    return (
        <div className="bg-background flex items-center justify-center h-[93vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    )
}
