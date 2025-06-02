# Tome
An application for artists to store, download, and organize their artworks.

## Synopsis
This is an extension of my winter project where I created a web app that allows authenticated users to upload images and add metadata to them and view those artworks by metadata. Artists need to keep records of artworks they've created. There are other platforms out on the market that do this, but not in a cost-effective and modern way.

## Proof of Concept update May 21 2025
I have been able to implement the signup and login functions of my app, but have not proceeded very far beyond that. I have js files stubbed in for artworks which is the next big thing that I need to tackle.

## Project Plan
- [x] Create the API and database connection for creating users and logging in
- [x] Enable a user to change their password
- [x] Create the API and database connection for Creating, Reading, updating and deleting artworks
- [x] Utilize authentication so a user can only see their own artworks and tags
- [x] Combine the backend and frontend projects into one folder system
- [x] Bang around and break stuff; see what is and is not working
- [x] Point the POST routes to write to MongoDB (is this already done?)
- [x] Point the POST artworks route to write the image to Cloudinary
- [x] Remove the old frontend test with all of the mocking stuff that I did for winter quarter
- [x] Check the coverage for tests with npm test -- --coverage
- [ ] Write more tests so that the coverage is 80%+
- [ ] Deploy the app to some public place using either railway or firebase
- [ ] Add some sort of query

### Things I probably won't get to
- [ ] Resolve all the broken things that you find
- [ ] Create a model, daos, and routes for tags
- [ ] Modify the .pdf creation so that it brings in images and the right content from the database
- [ ] Perform other cleanup operations to tidy up all the files

## Schedule
* Tuesday, May 20 — Backend set up and all major functions completable in Postman/Compass
* Tuesday, May 27 — Front end react app hooked up to backend
* Tuesday, June 3 — Testing of 80% completed and possible deployment — Project due

## Reflection 

### Reflection assignment language
"Your project README should have a self-evaluation of your approach and results, what you learned, and what you would like to do differently or improve upon. Explain what worked well and what didn't. The expectation is that this will not be a brief statement."


### My summary
My approach for this project was to take a frontend application I created in the last quarter using React and Firebase and to put that in a "client" project folder and then build a custom backend for it in another folder ("server") using the techniques we learned this quarter for authentication, requests, and responses. It took me quite awhile to work through all of the places where I was calling Firebase from within the React app and to get them using the custom backend instead. As of two days before I turn in this project, which is when I'm writing this self-evalutation, I think that my process was pretty messy and rather dissatisfying. Feels like I had a working react app, a house, and all I really did was to switch around some pipes underneath the house. I'm not sure that I quite understand how this is better than what I had a few months ago.

### What went well
- Using Compass to see whether or not things were actually getting written to the database
- Using Postman to test my backend routes manually
- Uploading images seemed pretty daunting at first, but it ended up not being as hard as I thought it would

### What didn't go well
- Figuring out where package.json files should be, and which folder to check into .git
- There was a lot of confusion on my part about which files should be imported where and in what order
- I started with a full-fledged frontend and built out the backend. It would have been better to build each of these up together side by side instead

### What did I learn
- I learned how to combine frontend and backend code into a single project
- I learned how to employ a token generated on the backend to control access on a frontend

### What would I do differently next time
I think next time I would develop the frontend and backend more in parallel instead of one after the other. It would be nice to think of these two parts of the puzzle working more seamlessly together. My current implementation feels fairly disjointed.
