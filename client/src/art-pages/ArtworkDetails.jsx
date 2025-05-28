import React, { useState } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, deleteDoc } from "firebase/firestore";
import { auth, db } from '../FirebaseConfig';
import { useArtworks } from "./ArtworksContext";
import TopNav from "../TopNav";
import Fullscreen from "./Fullscreen";

function ArtworkDetails() {
    const user = auth.currentUser;
    const { id } = useParams();
    const { artworks } = useArtworks();
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
    const navigate = useNavigate();

    const artwork = artworks.find(a => a.id === id);
    if (!artwork) return <p>Me no find any artworks.</p>

    const handleDelete = async () => {

        if (!user) return;
        await deleteDoc(doc(db, "accounts", user.uid, "artworks", id));
        navigate("/");
    }

    const currentIndex = artworks.findIndex(a => a.id === id);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < artworks.length - 1;

    const onPrevious = () => hasPrevious && navigate(`/artwork/${artworks[currentIndex - 1].id}`);
    const onNext = () => hasNext && navigate(`/artwork/${artworks[currentIndex + 1].id}`);

    return (
        <>
            <div className="flex flex-col min-h-screen w-full p-0">
                <TopNav />
                <div className="flex flex-row gap-8 h-full p-20">
                    <div className="">
                        <img
                            src={artwork.image}
                            alt={`An artwork titled ${artwork.title} done in ${artwork.medium}`}
                            className="object-contain h-full"
                        />
                    </div>
                    <div className="flex flex-col gap-4 w-1/2">
                        <h1 className="text-4xl">{artwork.title}</h1>
                        <p>{artwork.medium}</p>
                        <p>{`Added ${artwork.createdAt?.toDate().toLocaleString()}`}</p>
                        <h3>Tags</h3>
                        <p>{artwork.tags}</p>
                        <div className="flex flex-col items-center justify-center w-full">
                            <div className="w-full flex flex-row gap-2 p-2 justify-center">
                                <Link to={`/edit/${artwork.id}`}>
                                    <button
                                        className="border border-gray-400 hover:bg-blue-200 text-gray-800 py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Edit
                                    </button>
                                </Link>
                                <button
                                    onClick={() => handleDelete()}
                                    className="border border-gray-400 hover:bg-blue-200 text-gray-800 py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setIsFullscreenOpen(true)}
                                    className="border border-gray-400 hover:bg-blue-200 text-gray-800 py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Fullscreen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Fullscreen
                isOpen={isFullscreenOpen}
                onClose={() => setIsFullscreenOpen(false)}
                onNext={onNext}
                onPrevious={onPrevious}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
            >
                <img src={artwork.image} alt="Fullscreen artwork" className="w-full h-full object-contain" />
            </Fullscreen>
        </>
    )
}

export default ArtworkDetails;