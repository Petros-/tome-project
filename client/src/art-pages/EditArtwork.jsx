import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import NewArtwork from "./NewArtwork";
import { useUser  } from '../contexts/UserContext';
import Loader from "../fields/Loader";

function EditArtwork () {
    const { user } = useUser();
    const {id} = useParams();
    const [existingData, setExistingData] = useState(null);

    useEffect (() => {

        if (!user) {
            console.log("No authenticated user. Skipping Firestore request.");
            return; // Exit early if user is not authenticated
        }

        const fetchData = async () =>  {
            try {
                const response = await fetch('/artworks/${id}', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error("Artwork fetch failed");
                const data = await response.json();
                setExistingData(data);

            } catch (error) {
                console.error("Error fecthing details:", error);
            }
        };

        fetchData();
    }, [user, id])

    console.log(existingData);

    return (
        <>
            {existingData ? <NewArtwork existingData={existingData} /> : 
            <div className="flex items-center justify-center w-full h-full min-h-screen">
                <Loader />
            </div>}
        </>
    )
}

export default EditArtwork;