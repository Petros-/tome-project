import React, { useState, } from 'react';
import { useArtworks } from '../art-pages/ArtworksContext';
import TopNav from '../TopNav';
import Loader from '../fields/Loader';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";

function TagDetails() {
    const { id } = useParams();
    const { tags, taggedArtworks, isLoading } = useArtworks();
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

    if (loading || isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-full min-h-screen">
                <Loader />
            </div>
        )
    }

    // Use a query to find the tag by id
    const tag = tags.find(tag => tag.id === id);

    if (!tag) {
        return <div className="text-center text-red-500 mt-10">Tag not found</div>;
    }


    

    // PDF generation function
    const generatePDF = async () => {
        const doc = new jsPDF();

        // Add Tag name
        doc.setFontSize(20);
        doc.text(tag.name, 20, 20);

        // Add Artworks
        let yOffset = 30;
        if (taggedArtworks[tag.id] && taggedArtworks[tag.id].length > 0) {
            for (const artwork of taggedArtworks[tag.id]) {
                if (artwork) {
                    doc.setFontSize(12);
                    doc.text(artwork.title, 20, yOffset);

                    // Convert image URL to Base64 before adding it
                    try {
                        const base64Image = await convertImageToBase64(artwork.image);
                        doc.addImage(base64Image, 'JPEG', 20, yOffset + 5, 50, 50);
                    } catch (error) {
                        console.error("Error loading image:", error);
                        doc.text("Image could not be loaded", 20, yOffset + 10);
                    }

                    // Add the image using the image URL (or Base64 data)
                    doc.addImage(imageUrl, 'JPEG', xPos, yPos, imgWidth, imgHeight);
                    yOffset += 20;
                }
            };
        } else {
            doc.setFontSize(12);
            doc.text("No artworks available for this tag.", 20, yOffset);
        }

        // Save the PDF
        doc.save(`${tag.name}_artworks.pdf`);
    };

    // Helper function to convert image URL to Base64
    const convertImageToBase64 = async (imageUrl) => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    return (
        <div className="flex flex-col min-h-screen w-full p-0">
            <TopNav />
            <div className="flex flex-col gap-8 p-20">
                <Link to="/tags" className="text-blue-500 text-left">All tags</Link>
                <h1 className="text-3xl text-left">{tag.name}</h1>
                <div className="grid grid-rows-auto gap-4 w-full items-center px-12 pt-4">
                    <div className="grid gap-4 xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 w-full">
                        {taggedArtworks[tag.id] && taggedArtworks[tag.id].length > 0 ? (
                            taggedArtworks[tag.id].map((artwork) => (
                                artwork ? (
                                    <div key={artwork.id} className="relative group">
                                        <img
                                            src={artwork.image}
                                            alt={artwork.title}
                                            className="w-full h-48 object-cover rounded-md shadow"
                                        />
                                        <p className="text-center mt-2">{artwork.title}</p>
                                    </div>
                                ) : null
                            ))
                        ) : (
                            <p className="text-gray-500">No artworks available for this tag.</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={generatePDF}
                    className="mt-6 p-2 bg-blue-500 text-white rounded-md"
                >
                    Download PDF
                </button>
            </div>

        </div>
    )
}

export default TagDetails
