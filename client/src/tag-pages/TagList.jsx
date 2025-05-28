import React from 'react';
import { useArtworks } from '../art-pages/ArtworksContext';
import TopNav from '../TopNav';
import Loader from '../fields/Loader';
import { Link } from 'react-router-dom';

function TagList() {
    const { tags, taggedArtworks, isLoading, hasError } = useArtworks();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-full min-h-screen">
                <Loader />
            </div>
        )
    }

    if (hasError) return <div>Error loading tags.</div>;

    return (
        <div className="flex h-screen w-full flex-col">
            <TopNav />
            <div className="flex flex-col h-screen w-full p-20">
                <div>
                    <h1 className="flex text-2xl font-bold w-full mb-8">Tags &nbsp; <span className="text-gray-400">{tags.length} </span></h1>
                    {tags.map(tag => (
                        <Link to={`/tag/${tag.id}`} key={tag.id}>
                            <div key={tag.id} className="flex flex-row border border-gray-200 rounded p-2 my-2 w-full">
                                <h2 className="text-lg font-semibold w-48 text-left">{tag.name}</h2>
                                <div className="flex flex-row justify-center gap-2">
                                    {taggedArtworks[tag.id] && taggedArtworks[tag.id]?.length > 0 ? (
                                        taggedArtworks[tag.id].map((artwork) => (
                                            artwork ? (
                                                <div key={artwork.id}>
                                                    <img
                                                        src={artwork.image}
                                                        alt={artwork.title}
                                                        className="w-16 h-16 object-cover rounded-md shadow"
                                                    />
                                                </div>
                                            ) : null
                                        ))
                                    ) : (
                                        <p>This tag does not have any artworks</p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default TagList
