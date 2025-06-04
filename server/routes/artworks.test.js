jest.setTimeout(15000);
require('dotenv').config();
const request = require("supertest");
let jwt = require("jsonwebtoken");
const server = require("../server");
const testUtils = require("../testing/test-utils");

const User = require("../models/user");
const Artwork = require("../models/artwork");

let serverInstance;

beforeAll(async () => {
  await testUtils.connectDB();
  // temporary port so I can isolate test problems
  serverInstance = server.listen(0);
});

afterAll(async () => {
  await testUtils.stopDB();
  if (serverInstance) {
    // shut down the server after the tests
    serverInstance.close();
  }
});

// after each test, clear the database
afterEach(testUtils.clearDB);

// here are the actual tests
describe("/artworks", () => {

    // my little array of artworks for testing
    const artwork0 = { title: "Artwork number one", medium: `Oil on canvas`};
    const artwork1 = { title: "Second artwork", medium: `Oil on paper` };

    // tests on stuff that could happen before login
    describe("Before login", () => {
        describe("POST /", () => {
          it(`should send 401 if the request doesn't include a token`, async () => {
            const res = await request(serverInstance).post("/artworks").send(artwork0);
            expect(res.statusCode).toEqual(401);
          });
    
          it("should send 401 with a bad token", async () => {
            const res = await request(serverInstance)
              .post("/artworks")
              .set("Authorization", "Bearer BAD")
              .send(artwork0);
            expect(res.statusCode).toEqual(401);
          });
        });
    
        describe("GET /", () => {
          it("should send 401 without a token", async () => {
            const res = await request(serverInstance).get("/artworks").send(artwork0);
            expect(res.statusCode).toEqual(401);
          });
    
          it("should send 401 with a bad token", async () => {
            const res = await request(serverInstance)
              .get("/artworks")
              .set("Authorization", "Bearer BAD")
              .send();
            expect(res.statusCode).toEqual(401);
          });
        });
    
        describe("GET /artwork/:id", () => {
          it("should send 401 without a token", async () => {
            const res = await request(serverInstance).get("/artworks/123").send(artwork0);
            expect(res.statusCode).toEqual(401);
          });
    
          it("should send 401 with a bad token", async () => {
            const res = await request(serverInstance)
              .get("/artworks/456")
              .set("Authorization", "Bearer BAD")
              .send();
            expect(res.statusCode).toEqual(401);
          });
        });
      });
    
});