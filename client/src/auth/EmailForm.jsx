import React, { useState } from 'react';
import TomeDiamondSvg from '../assets/TomeWithDiamond.svg';
import { useUser } from '../contexts/UserContext'

function EmailForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [suggestSignIn, setSuggestSignIn] = useState(false);

    const { login } =  useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuggestSignIn(false);

        if (!email.trim() || !password.trim()) {
            setErrorMessage("Error: Email and password cannot be empty.");
            return;
        }

        try {

            const response = await fetch(`http://localhost:3000/auth/${isSignUp ? 'signup' : 'login'}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Unknown error');
            }

            localStorage.setItem('token', data.token);
            console.log("Authorization was successful");

            window.location.reload();
        
        } catch(error) {
            setErrorMessage(`Whoops, there was a problem: ${error.message}`);
            if(error.message.includes("already exists")) {
                setSuggestSignIn(true);
            }
        }

    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[url(././assets/Dec022023Photoshoot-009.jpg)] bg-cover bg-center w-full h-svh">
            <div className="shadow-md rounded-t-lg border-gray-300 bg-clip-border overflow-hidden">
                <div className="flex items-center justify-center w-full h-40 bg-blue-200">
                    <img src={TomeDiamondSvg} alt="Tome Logo" className="sm" />
                </div>
                <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4 bg-white rounded-b-lg">
                    <h2 className="text-xl font-semibold pt-4 pb-8">
                        {isSignUp ? "Store your artworks" : "Sign into an existing account"}
                    </h2>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            data-form-type="other"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            data-form-type="other"
                            placeholder="6+ character password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {errorMessage && (
                        <div className="text-sm border border-red-300 text-red-700 bg-red-50 p-4 rounded-md mb-4">
                            {errorMessage}
                            {suggestSignIn && (
                        <p className="mt-2">
                            Did you mean to{" "}
                            <button
                                type="button"
                                onClick={() => setIsSignUp(false)}
                                className="text-blue-400"
                            >
                                sign in 
                            </button>
                            {" "}instead?
                            </p>
                        )}
                        </div>
                    )}
                    

                    <div className="flex items-center justify-between gap-8">
                        <p className="text-sm">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                            <button type="button" className="text-blue-500 hover:underline ml-1" onClick={() => setIsSignUp(!isSignUp)}>
                                {isSignUp ? "Sign In" : "Create one"}
                            </button>
                        </p>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            {isSignUp ? "Create account" : "Sign in"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default EmailForm;
