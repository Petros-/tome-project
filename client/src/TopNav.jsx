import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './FirebaseConfig';
import TomeInlineSvg from './assets/TomeInline.svg';
import { Link } from 'react-router-dom';

function TopNav() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                console.log('User signed out')
            })
            .catch((error) => {
                console.log('Error with signout: ', error.message)
            })
    }
    return (
        <div className="flex flex-row justify-between border-b border-gray-300 items-center p-4 pl-6 pr-6 w-full m-0 relative top-0 left-0 bg-white">
            <Link to="/"><img src={TomeInlineSvg} alt="Tome Logo" className="sm" /></Link>

                {user ? (
                    <div className="flex flex-row gap-2">
                        <p>{user.email}</p>
                        <button onClick={handleSignOut} className="text-blue-500">Sign out</button>
                    </div>
                ) : (
                    <p>Sign in</p>
                )}

        </div>
    );
}

export default TopNav
