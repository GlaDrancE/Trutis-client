import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Key, User2, Loader, Store } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { createClient, createGoogleClient, generateOtp, getAgents, verifyOtp } from '../../services/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OTPInput from '@/components/otpInput';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const Register = () => {
    const [email, setEmail] = useState<string>("");
    const [ownerName, setOwnerName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [logo, setLogo] = useState<string>("");
    const [ip, setIP] = useState<string>("");
    const navigate = useNavigate();
    const [isFormFilled, setIsFormFilled] = useState<boolean>(false);
    const [shopName, setShopName] = useState<string>("");
    const [contractChecked, setContractChecked] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [slide, setSlide] = useState<number>(1);
    const [otp, setOtp] = useState<string>("");
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    const [address, setAddress] = useState({
        line1: "",
        city: "",
        state: "",
        country: "",
        pincode: ""
    });
    const [pincodeError, setPincodeError] = useState<string>("");
    const autocompleteInputRef = useRef<HTMLInputElement>(null);

    const handleAddressChange = (field: keyof typeof address) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAddress(prev => ({
            ...prev,
            [field]: value
        }));

        if (field === 'pincode') {
            validatePincode(value);
        }
    };

    const validatePincode = (pincode: string) => {
        const pincodeRegex = /^\d{6}$/; // 6-digit numeric validation
        if (!pincode) {
            setPincodeError("Pincode is required");
            return false;
        } else if (!pincodeRegex.test(pincode)) {
            setPincodeError("Pincode must be a 6-digit number");
            return false;
        } else {
            setPincodeError("");
            return true;
        }
    };

    const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            parseAddress(place);
            // Update the input field value to reflect the selected street address
            if (autocompleteInputRef.current) {
                const streetAddress = place.address_components
                    ? place.address_components
                        .filter((comp: google.maps.GeocoderAddressComponent) =>
                            comp.types.includes('street_number') || comp.types.includes('route'))
                        .map((comp: google.maps.GeocoderAddressComponent) => comp.long_name)
                        .join(' ')
                    : '';
                autocompleteInputRef.current.value = streetAddress || address.line1;
            }
        }
    };

    const parseAddress = (place: google.maps.places.PlaceResult) => {
        const addressComponents = place.address_components || [];
        let line1 = '';
        let city = '';
        let state = '';
        let country = '';
        let pincode = '';

        addressComponents.forEach((component: google.maps.GeocoderAddressComponent) => {
            const types = component.types;
            if (types.includes('street_number')) {
                line1 = component.long_name;
            } else if (types.includes('route')) {
                line1 += ' ' + component.long_name;
            } else if (types.includes('locality') || types.includes('sublocality') || types.includes('administrative_area_level_2')) {
                city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
                state = component.long_name;
            } else if (types.includes('country')) {
                country = component.long_name;
            } else if (types.includes('postal_code')) {
                pincode = component.long_name;
            }
        });

        setAddress({
            line1: line1.trim(),
            city,
            state,
            country,
            pincode
        });

        if (pincode) validatePincode(pincode);
    };

    const handleFormSubmit = () => {
        // setIsFormFilled(true)

        // const clientContainer = document.querySelector("#clientContainer")
        // const registerForm = document.querySelector("#clientRegisterForm")
        // const formWidth = registerForm?.getBoundingClientRect();

        // console.log(formWidth)
        // console.log(clientContainer)
        // if (formWidth && formWidth.right && clientContainer)
        //     clientContainer.scrollLeft = formWidth?.right
        setSlide(prev => prev + 1);
    };

    useEffect(() => {
        getData();
        console.log(ip);
    }, []);

    const getData = async () => {
        const res = await axios.get("https://api.ipify.org/?format=json");
        console.log(res.data);
        setIP(res.data.ip);
    };

    const handleGenerateOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePincode(address.pincode)) {
            toast.error("Please enter a valid pincode");
            return;
        }
        if (email) {
            handleFormSubmit();
            const response: any = await generateOtp(email);
            if (response.status !== 200) {
                toast.error("Something went wrong");
            } else {
                toast.success("OTP sent to email");
                setIsFormFilled(true);
            }
        } else {
            toast.error("Please enter an email");
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const response: any = await createClient({
                email,
                owner_name: ownerName,
                password,
                logo,
                ipAddress: ip,
                line1: address.line1,
                city: address.city,
                state: address.state,
                country: address.country,
                pincode: address.pincode,
                shop_name: shopName,
                contractTime: new Date(),
                authProvider: "manual",
                maxDiscount: 0,
                couponValidity: '',
                minOrderValue: 0
            });
            setIsLoading(false);
            if (response.status !== 201) {
                toast.error('Error while creating client');
            } else {
                console.log("Client Created");
                toast.success("Client created");
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("clientId", response.data.userId);
                navigate(`/${response.data.userId}`);
            }
        } catch (error) {
            toast.error("Something went wrong");
            setIsLoading(false);
            console.error(error);
        }
    };

    const monitorScroll = (e: any) => {
        const scrollVal = e.target.scrollTop;
        const scrollHeight = e.target.scrollHeight;
        if (scrollVal >= scrollHeight) {

        }
    };

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    console.log(GOOGLE_CLIENT_ID);
    console.log("Ek min", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
    // const handleGoogleSignIn = async (crednetialsResponse: any) => {
    //     try {

    //         const decode: any = jwtDecode(crednetialsResponse.credential);
    //         console.log("Decode Information: ", decode);
    //         const response = await createGoogleClient({
    //             email: decode.email,
    //             owner_name: decode.name,
    //             logo: decode.picture,
    //             ipAddress: ip,
    //             password: decode.sub as string,
    //             contractTime: new Date(),
    //             authProvider: "google",
    //             token: crednetialsResponse.credential,
    //             maxDiscount: 0,
    //             couponValidity: '',
    //             minOrderValue: 0
    //         });
    //         if (response.status !== 201) {
    //             toast.error("Failed to create an account");
    //             return;
    //         }
    //         localStorage.setItem('token', crednetialsResponse.credential);
    //         navigate(`/${response.data.userId}`);

    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Failed to create account");
    //     }
    // };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 h-full">
            <div className='max-w-md w-full flex h-full overflow-hidden' style={{ scrollBehavior: "smooth" }} id='clientContainer'>
                {slide === 1 && <Card className="w-full min-w-full">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center text-blue-600">
                            Create an Account
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
                            <div>
                                <GoogleLogin
                                    onSuccess={handleGoogleSignIn}
                                    onError={() => console.log("Login failed")}
                                    theme="outline"
                                    size="large"
                                    shape="circle"
                                    locale="en-US"
                                    text="signin_with"
                                    context="signup"
                                />
                            </div>
                        </GoogleOAuthProvider> */}

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={handleGenerateOtp}>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Store className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
                                <input
                                    type="text"
                                    placeholder="Shop Name"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <Key className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
                                <input
                                    type="text"
                                    placeholder="Password"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {/* Address Section with Autocomplete */}
                            <div className="space-y-4">
                                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['places']}>
                                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} options={{ types: ['address'] }}>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
                                            <input
                                                type="text"
                                                placeholder="Search for your address"
                                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                ref={autocompleteInputRef}
                                                value={address.line1}
                                                onChange={handleAddressChange('line1')}
                                            />
                                        </div>
                                    </Autocomplete>
                                </LoadScript>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
                                        <input
                                            type="text"
                                            placeholder="City"
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            value={address.city}
                                            onChange={handleAddressChange('city')}
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
                                        <input
                                            type="text"
                                            placeholder="State"
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            value={address.state}
                                            onChange={handleAddressChange('state')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
                                        <input
                                            type="text"
                                            placeholder="Country"
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            value={address.country}
                                            onChange={handleAddressChange('country')}
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
                                        <input
                                            type="text"
                                            placeholder="Pincode"
                                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${pincodeError ? 'border-red-500' : ''}`}
                                            value={address.pincode}
                                            onChange={handleAddressChange('pincode')}
                                            required
                                        />
                                        {pincodeError && (
                                            <p className="text-red-500 text-xs mt-1">{pincodeError}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div> */}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"

                                disabled={!!pincodeError}
                            >
                                Register
                            </button>
                        </form>
                        <p className='mx-auto text-center'>
                            Already have account?
                            <Link to={'/login'} className='text-blue-500 ml-2'>Login</Link>
                        </p>
                    </CardContent>
                </Card>}
                {slide === 2 && <OTPInput value={otp} email={email} setOtp={setOtp} handleFormSubmit={handleFormSubmit} />}
                {slide === 3 && <div id='clientRegisterForm' className='min-w-full relative h-full min-h-lg'>
                    <Card className='overflow-y-auto w-full min-w-full h-full'>
                        <CardHeader>
                            <strong>Terms and Conditions</strong>
                        </CardHeader>
                        {isFormFilled &&
                            <CardContent>
                                <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-12">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Co‑Ownership of Data Agreement</h1>
                                    <p className="mb-4"><span className="font-semibold">Effective Date:</span> [Effective Date]</p>
                                    <p className="mb-4">This Agreement is made between <span className="font-semibold">Cosie (Friends Colony)</span> (Party A) and <span className="font-semibold">{ownerName}</span> (Party B) (collectively, the “Co‑Owners”).</p>

                                    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">1. Definitions</h2>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                        <li><strong>Data:</strong> Any information, records, or digital files created or maintained by the Co‑Owners.</li>
                                        <li><strong>Co‑Owned Data:</strong> Data jointly owned by both parties.</li>
                                    </ul>

                                    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">2. Co‑Ownership & Rights</h2>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                        <li><strong>Joint Ownership:</strong> Each party holds an equal, undivided interest.</li>
                                        <li><strong>Rights to Use:</strong> Each may access, modify, and distribute the Data for lawful purposes.</li>
                                        <li><strong>No Unilateral Transfer:</strong> No party may transfer its interest without the other's written consent.</li>
                                    </ul>

                                    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">3. Data Management & Security</h2>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                        <li>The Co‑Owners shall jointly maintain data accuracy and integrity.</li>
                                        <li>Both parties will implement measures to safeguard the Data against unauthorized access.</li>
                                    </ul>

                                    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">4. Use & Licensing</h2>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                        <li>Each grants a non‑exclusive, royalty‑free license to use, modify, and distribute the Data.</li>
                                        <li>Use is limited to lawful purposes only.</li>
                                    </ul>

                                    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">5. Confidentiality</h2>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                        <li>The Data and related processes are confidential.</li>
                                        <li>Disclosure requires prior written consent, except as required by law.</li>
                                    </ul>

                                    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">6. Dispute Resolution</h2>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                        <li>Disputes shall first be resolved via good‑faith negotiations.</li>
                                        <li>If unresolved within [30] days, mediation and then binding arbitration shall apply.</li>
                                    </ul>

                                    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">7. Term & Termination</h2>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                        <li>This Agreement is effective from the Effective Date until terminated by mutual agreement.</li>
                                        <li>Either party may terminate with [60] days’ written notice; accrued rights remain.</li>
                                    </ul>

                                    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">8. Miscellaneous</h2>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                        <li>This document is the entire agreement and supersedes all prior understandings.</li>
                                        <li><strong>Governing Law:</strong> [Jurisdiction].</li>
                                        <li>If any provision is invalid, the remainder stays in effect.</li>
                                    </ul>

                                    <div className="mt-8 border-t pt-4">
                                        <p className="mb-2 font-semibold">IN WITNESS WHEREOF, the Co‑Owners have executed this Agreement as of [Effective Date].</p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p><strong>Party A:</strong> Cosie (Friends Colony)</p>
                                                <p>Date: {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                            </div>
                                            <div>
                                                <p><strong>Party B:</strong> {ownerName}</p>
                                                <p>Date: {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-8 text-xs italic text-gray-600">Disclaimer: This sample contract is provided for informational purposes only and does not constitute legal advice. Consult a qualified attorney before use.</p>
                                </div>
                                <Checkbox id='terms-conditions' checked={contractChecked} onClick={() => { setContractChecked(prev => !prev) }} />
                                <label htmlFor="terms-conditions" className='ml-4'>I have read all the <strong>Terms & Conditions</strong></label>
                            </CardContent>
                        }
                        <div className='flex justify-end'>
                            <Button variant="default" className='mb-4 mx-6 w-32' disabled={!contractChecked || contractChecked && isLoading} onClick={handleSubmit}>
                                {isLoading ? <Loader className='animate-spin' /> : "Submit"}
                            </Button>
                        </div>
                    </Card>
                </div>}
            </div>
        </div>
    );
};

export default Register;