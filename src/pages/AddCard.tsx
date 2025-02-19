import React from "react";
import { useNavigate } from "react-router-dom";

const AddCardPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-xl font-bold mb-4">Please add a card to a plan to continue</h1>
            <button
                className="px-4 py-2 bg-white text-black border border-black rounded-md"
                onClick={() => navigate("/subscription-plans")}
            >
                Add Card
            </button>
        </div>
    );
};

export default AddCardPage;
