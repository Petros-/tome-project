import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ArtworkDetails from '../art-pages/ArtworkDetails';
import { BrowserRouter as Router, navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';


// mock the firebase dependencies
vi.mock('firebase/firestore', () => ({
    ...vi.importActual('firebase/firestore'),
    deleteDoc: vi.fn(),
    doc: vi.fn(() => ({ id: 'mockDocRef' })),
    getFirestore: vi.fn(() => ({})),
}));

// mock the auth portion of the code
vi.mock('../FirebaseConfig', () => ({
    auth: {
        currentUser: { uid: 'fakeUserId' },
        onAuthStateChanged: vi.fn((callback) => {
            callback({uid: 'fakeUserId'});
            return vi.fn();
        }),
    },
    db: {},
}));

// mock the context for useArtworks
vi.mock('../art-pages/ArtworksContext', () => ({
    useArtworks: () => ({
        artworks: [{ id: 'fakeArtworkId', image: 'fakeImageUrl', title: 'Fake title', medium: 'Fake medium', createdAt: { toDate: () => new Date() } }],
    }),
}));

// mock the react router dom hooks
vi.mock("react-router-dom", () => ({
    useParams: () => ({ id: 'fakeArtworkId' }),
    Link: ({ children }) => children,
    useNavigate: vi.fn(() => vi.fn()),
    BrowserRouter: ({children}) => children,

}));

test('when the delete button is clicked the artwork should be deleted', async () => {

    render(
        <Router>
            <ArtworkDetails />
        </Router>
    );

    // find the delete button and click it
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // wait for the delete function to be called
    await waitFor(() => expect(vi.mocked(deleteDoc)).toHaveBeenCalled());

    // make sure it was called with the right parameters
    expect(vi.mocked(doc)).toHaveBeenCalledWith(expect.anything(), 'accounts', 'fakeUserId', 'artworks', 'fakeArtworkId');
    expect(vi.mocked(deleteDoc)).toHaveBeenCalledWith({ id: 'mockDocRef' });

    // Ensure navigate was called after deletion
    // expect(navigate).toHaveBeenCalledWith('/');
})