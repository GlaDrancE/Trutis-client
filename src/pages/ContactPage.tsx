import React, { useState } from 'react';
import { AlertCircle, Check, ChevronRight, Copy, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const ContactPage = () => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [copied, setCopied] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setTimeout(() => {
            setSubmitted(true);
            // Reset after 3 seconds
            setTimeout(() => setSubmitted(false), 3000);
        }, 500);
    };

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(''), 2000);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header with abstract design */}
            <div className="relative overflow-hidden py-20 px-6">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-20 left-10 w-40 h-40 rounded-full border border-gray-800"></div>
                    <div className="absolute top-10 right-20 w-20 h-20 rounded-full border border-gray-800"></div>
                    <div className="absolute bottom-10 left-1/4 w-60 h-60 rounded-full border border-gray-800"></div>
                    <div className="absolute -bottom-20 right-1/3 w-80 h-80 rounded-full border border-gray-800"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4 tracking-tight">Get in Touch</h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        We're here to help and answer any questions you might have. We look forward to hearing from you.
                    </p>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-6xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Contact Form */}
                    <Card className="bg-gray-950 border-gray-800">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

                            {submitted ? (
                                <Alert className="bg-gray-900 border-green-500 text-green-500 mb-6">
                                    <Check className="h-4 w-4" />
                                    <AlertTitle>Success!</AlertTitle>
                                    <AlertDescription>
                                        Your message has been sent. We'll get back to you soon.
                                    </AlertDescription>
                                </Alert>
                            ) : null}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                                        Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        value={formState.name}
                                        onChange={handleChange}
                                        className="bg-gray-900 border-gray-800 focus:border-white transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formState.email}
                                        onChange={handleChange}
                                        className="bg-gray-900 border-gray-800 focus:border-white transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
                                        Subject
                                    </label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formState.subject}
                                        onChange={handleChange}
                                        className="bg-gray-900 border-gray-800 focus:border-white transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                                        Message
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        required
                                        value={formState.message}
                                        onChange={handleChange}
                                        className="bg-gray-900 border-gray-800 focus:border-white transition-colors resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-white text-black hover:bg-gray-200 transition-colors"
                                >
                                    Send Message <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <Card className="bg-gray-950 border-gray-800">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-gray-900 p-4 rounded-lg">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium">Phone</h3>
                                            <div className="mt-2 flex items-center text-gray-400">
                                                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                                                    +1 (234) 567-890
                                                </a>
                                                <button
                                                    onClick={() => copyToClipboard('+1234567890', 'phone')}
                                                    className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
                                                    aria-label="Copy phone number"
                                                >
                                                    {copied === 'phone' ?
                                                        <Check className="h-4 w-4 text-green-500" /> :
                                                        <Copy className="h-4 w-4" />
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-gray-900 p-4 rounded-lg">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium">Email</h3>
                                            <div className="mt-2 flex items-center text-gray-400">
                                                <a href="mailto:contact@company.com" className="hover:text-white transition-colors">
                                                    contact@company.com
                                                </a>
                                                <button
                                                    onClick={() => copyToClipboard('contact@company.com', 'email')}
                                                    className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
                                                    aria-label="Copy email address"
                                                >
                                                    {copied === 'email' ?
                                                        <Check className="h-4 w-4 text-green-500" /> :
                                                        <Copy className="h-4 w-4" />
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-gray-900 p-4 rounded-lg">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium">Address</h3>
                                            <p className="mt-2 text-gray-400">
                                                123 Design Street<br />
                                                New York, NY 10001<br />
                                                United States
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-950 border-gray-800">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold mb-6">Our Hours</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Monday - Friday</span>
                                        <span>9:00 AM - 6:00 PM</span>
                                    </div>

                                    <Separator className="bg-gray-800" />

                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Saturday</span>
                                        <span>10:00 AM - 4:00 PM</span>
                                    </div>

                                    <Separator className="bg-gray-800" />

                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Sunday</span>
                                        <span>Closed</span>
                                    </div>
                                </div>

                                <Alert className="mt-6 bg-gray-900 border-gray-800">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Note</AlertTitle>
                                    <AlertDescription className="text-gray-400">
                                        Response times may be delayed during weekends and holidays.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;