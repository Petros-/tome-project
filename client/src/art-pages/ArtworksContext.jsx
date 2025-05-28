import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { auth, db } from '../FirebaseConfig';
import PropTypes from "prop-types";

const ArtworksContext = createContext();

export function ArtworksProvider({ children }) {
    const [artworks, setArtworks] = useState([]);
    const [tags, setTags] = useState([]);
    const [taggedArtworks, setTaggedArtworks] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        // get the artworks
        const artworksQuery = query(collection(db, "accounts", user.uid, "artworks"), orderBy("createdAt", "asc"));
        const unsubscribeArtworks = onSnapshot(artworksQuery, (snapshot) => {
            const artworksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setArtworks(artworksData);
            setIsLoading(false);
        }, (error) => {
            console.error("Uh oh, I couldn't get the artworks. The error was: ", error);
            setHasError(true);
        });

        // get the tags too
        const tagsQuery = collection(db, "accounts", user.uid, "tags");
        const unsubscribeTags = onSnapshot(tagsQuery, (snapshot) => {
            const tagsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTags(tagsData);

        }, (error) => {
            console.error("Error fetching tags:", error);
            setHasError(true);
        });

        return () => {
            unsubscribeArtworks();
            unsubscribeTags();
        }
    }, [auth.currentUser]);

    // update the mapping whenever a tag or artwork changes
    useEffect(() => {
        const tagMap = {};
        tags.forEach(tag => {
            if (Array.isArray(tag.artworks)) {
                tagMap[tag.id] = tag.artworks
                .map(artworkId => artworks.find(a => a.id === artworkId))
                .filter(Boolean);
            } else {
                tagMap[tag.id] = [];
            }
        });
        setTaggedArtworks(tagMap);
    }, [artworks, tags])

    return (
        <ArtworksContext.Provider value={{ artworks, tags, taggedArtworks, isLoading, hasError }}>
            {children}
        </ArtworksContext.Provider>
    );
}

export function useArtworks() {
    return useContext(ArtworksContext);
}

ArtworksProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
