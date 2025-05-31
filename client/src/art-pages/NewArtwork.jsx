import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import MediumDropdown from "../fields/MediumDropdown";

function NewArtwork({ existingData }) {
    // get id from url if editing
    const { id } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [title, setTitle] = useState('');
    const [medium, setMedium] = useState('');
    const [artworkTags, setArtworkTags] = useState('');
    const [uploading, setUploading] = useState(false);

    //populate the form if editing an existing item
    useEffect(() => {
        if (existingData) {
            setTitle(existingData.title || '');
            setMedium(existingData.medium || '');
            setArtworkTags(existingData.tags || '');
            setImageURL(existingData.image || '');
        }
    }, [existingData]);

    function handleImageChange(e) {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImageURL(URL.createObjectURL(selectedFile))
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            setUploading(true);

            const artworkData = {
                title,
                medium,
                tags: artworkTags.split(",").map(tag => tag.trim().toLowerCase()),
                image: imageURL,
            };

            const token = localStorage.getItem('token');

            const response = await fetch(`${import.meta.env.VITE_API_URL}/artworks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(artworkData)
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const createdArtwork = await response.json();
            console.log("Artwork created:", createdArtwork);

            // clear the form and redirect
            setTitle('');
            setMedium('');
            setArtworkTags('');
            setFile(null);
            setImageURL(null);
            navigate('/');

        } catch (error) {
            console.error("There was a problem:", error);
        } finally {
            setUploading(false);
        }

        // const tagList = artworkTags ? artworkTags.split(",").map(tag => tag.trim().toLowerCase()) : [];

        // for (const tag of tagList) {
        //     if (!tag) continue;

        //     // const tagRef = doc(db, "accounts", user.uid, "tags", tag);
        //     // const tagDocSnap = await getDoc(tagRef);
        //     const tagDoc = tagDocSnap.data();

        //     if (tagDocSnap.exists()) {
        //         // tag exists, so update the array of artworks in it
        //         await setDoc(tagRef, {
        //             artworks: Array.from(new Set([...tagDoc.artworks, artworkId])) // this ensures uniqueness
        //         }, { merge: true });
        //     } else {
        //         // tag doesn't exist, so make a new document
        //         await setDoc(tagRef, {
        //             name: tag,
        //             artworks: [artworkId]
        //         });
        //     }
        // }

        // // go back to the list after editing the form
        // navigate("/");
}

return (
    <>
        <div className="flex items-center justify-center bg-gray-100 w-full h-svh">
            <div className="bg-white shadow-md rounded w-[80%] h-[80%] bg-clip-border overflow-hidden">
                <form onSubmit={handleSubmit} className="flex flex-row w-full h-full md:flex-row sm:flex-col xs:flex-col">
                    <div className="flex items-center flex-col justify-center w-1/2 sm:w-full h-full bg-blue-200">
                        <img src={imageURL} />
                        <button className="border border-gray-300 py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            <input type="file" onChange={handleImageChange} className="border text-blue-600 flex justify-center w-full" />
                        </button>
                    </div>
                    <div className="w-1/2 space-y-8 p-8 flex flex-col justify-between sm:w-full sm:h-1/2">
                        <div className="flex flex-col gap-x-6 gap-y-8 sm:grid-cols-1">
                            <div className="w-full space-y-6">
                                <label htmlFor="artwork-title" className="block text-gray-700 text-sm font-bold mb-2 text-left">Title</label>
                                <input type="text"
                                    id="artwork-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    data-form-type="other"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-1">
                                <div className="w-full space-y-6">
                                    <label htmlFor="artwork-medium" className="block text-gray-700 text-sm font-bold mb-2 text-left">Medium</label>
                                    <MediumDropdown selectedValue={medium} onChange={(e) => setMedium(e.target.value)} />
                                </div>
                            </div>
                            <div className="w-full space-y-6">
                                <label htmlFor="artwork-tags" className="block text-gray-700 text-sm font-bold mb-2 text-left">Tags</label>
                                <input type="text"
                                    id="artwork-tags"
                                    value={artworkTags}
                                    onChange={(e) => setArtworkTags(e.target.value)}
                                    className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    data-form-type="other"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row w-full gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    if (id) {
                                        navigate("/");
                                    } else {
                                        setTitle("");
                                        setMedium("");
                                        setArtworkTags("");
                                        setFile(null);
                                        setImageURL(null);
                                        navigate("/");
                                    }
                                }}
                                className="bg-white border border-gray-300 hover:bg-blue-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Save artwork"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div >
    </>
)
}

NewArtwork.propTypes = {
    existingData: PropTypes.shape({
        title: PropTypes.string.isRequired,
        medium: PropTypes.string,
        image: PropTypes.string,
    }),
};

export default NewArtwork;