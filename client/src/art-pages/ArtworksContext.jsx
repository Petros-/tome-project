import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useUser } from "../contexts/UserContext";

const ArtworksContext = createContext();

export function ArtworksProvider({ children }) {
    const { user } = useUser();
    const [artworks, setArtworks] = useState([]);

    const addArtwork = (newArtwork) => {
        setArtworks(prev => [newArtwork, ...prev]);
    }

    const [tags, setTags] = useState([]);
    const [taggedArtworks, setTaggedArtworks] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        setHasError(false);
        const token = localStorage.getItem("token");
        if (!token || !user) {
            setArtworks([]);
            setTags([]);
            setTaggedArtworks([]);
            setIsLoading(false);
            return;
        }

        try {
            const [artworksRes, tagsRes] = await Promise.all([
                fetch("http://localhost:3000/artworks", {
                    headers: { Authorization: `Bearer ${token}`}
                }),
                fetch("http://localhost:3000/tags", {
                    headers: { Authorization: `Bearer ${token}`}
                })
            ]);

            const artworksData = await artworksRes.json();
            const tagsData = await tagsRes.json();

            setArtworks(artworksData.map(a => ({...a, id: a._id})));
            setTags(tagsData);

        } catch(error) {
            console.error("There was an error fetching some data:", error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [user]);

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
        <ArtworksContext.Provider value={{ artworks, tags, taggedArtworks, isLoading, hasError, addArtwork }}>
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
