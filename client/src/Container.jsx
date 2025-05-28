import React from 'react'
import TopNav from './TopNav'
import ArtworksList from './art-pages/ArtworksList'

function Container() {

    return (
        <div className="flex flex-col min-h-screen w-full p-0 border-red-500">
            <TopNav className="w-full"/>
            <div className="flex-grow w-full">
                <ArtworksList className="w-full" />
            </div>
        </div>
    )
}

export default Container;
