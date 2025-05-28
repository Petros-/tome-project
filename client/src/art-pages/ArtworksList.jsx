import React, { useState } from "react";
import { useArtworks } from "./ArtworksContext";
import { auth } from '../FirebaseConfig';
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import Truncator from "../fields/Truncator";
import Loader from "../fields/Loader";
import Toggle from "../fields/Toggle";

function ArtworksList() {
    const { artworks, isLoading, hasError } = useArtworks();
    const [showTitles, setShowTitles] = useState(false);
    const [user, loading] = useAuthState(auth);

    if (loading || isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-full min-h-screen">
                <Loader />
            </div>
        )
    }
    if (!user) return <p>Please sign in to view your artworks.</p>

    if (hasError) return <h2>There was an error, Peter. Go fix it</h2>

    return (
        <>
            <div className="grid grid-rows-auto gap-4 w-full items-center px-12 pt-4">
                <div className="flex flex-row gap-4">
                    <div className="w-72 border border-gray-200 bg-gray-50 rounded items-center justify-center">
                        <div className="flex items-center">
                            <Toggle isOn={showTitles} toggle={() => setShowTitles(prev => !prev)} />
                            <label className="ms-2 text-sm">
                                Show titles
                            </label>
                        </div>
                    </div>
                    <div className="border border-gray-200 bg-gray-50 rounded flex justify-between w-full pl-8 pr-4 items-center">
                        <div className="flex gap-2">
                            <p className="flex flex-grow">You have {artworks.length} {artworks.length === 1 ? "artwork" : "artworks"} in Tome.</p>
                            <p>
                                See them
                                <span className="text-blue-500">
                                   <Link to="/tags">{" "} by tag</Link>
                                </span>
                            </p>
                        </div>
                        <Link to="/new" >
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Add an artwork
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="grid gap-4 xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 w-full">
                    {artworks.map((artwork) => {
                        return <div key={artwork.id} className="flex flex-col gap-2 items-center border border-gray-300 w-full rounded m-auto">
                            <Link to={`/artwork/${artwork.id}`} className="w-full">
                                <div className="w-full flex flex-col flex-shrink-0">
                                    <div className="w-full h-60 flex-shrink-0">
                                        <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
                                    </div>
                                    {showTitles ? <Truncator>
                                        <div className="p-4 truncate">
                                            {artwork.title}
                                        </div>
                                    </Truncator> : ''}
                                </div>
                            </Link>

                        </div>
                    })}
                </div>
            </div>
        </>
    )
}

export default ArtworksList;