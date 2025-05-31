import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import NewArtwork from "./NewArtwork";
// import { useUser  } from './contexts/UserContext';
import Loader from "../fields/Loader";

function EditArtwork () {
    const {id} = useParams();
    const [existingData, setExistingData] = useState(null);

    useEffect (() => {

        if (!user) {
            console.log("No authenticated user. Skipping Firestore request.");
            return; // Exit early if user is not authenticated
        }

        const fetchData = async () =>  {
            try {
                const docRef = doc(db, "accounts", user.uid, "artworks", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setExistingData(docSnap.data());
                } else {
                    console.log("No such document");
                }

            } catch (error) {
                console.error("Error fecthing document:", error);
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