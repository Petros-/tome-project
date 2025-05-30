
const request = require("supertest");
let jwt = require("jsonwebtoken");
const server = require("../server");
const testUtils = require("../testing/test-utils");

const User = require("../models/user");

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

describe("/", () => {
    
    // here's a temporary little section of example database data for users
    const user0 = {
      email: "user0@mail.com",
      password: "123password",
    };
    const user1 = {
      email: "user1@mail.com",
      password: "456password",
    };
  
    describe("before signup", () => {
      describe("POST /", () => {
        it("should return 401, because you can't get in if you haven't signed up", async () => {
          const res = await request(serverInstance).post("/login").send(user0);
          expect(res.statusCode).toEqual(401);
        });
      });
  
      describe("PUT /password", () => {
        it("should return 401", async () => {
          const res = await request(serverInstance).put("/password").send(user0);
          expect(res.statusCode).toEqual(401);
        });
      });
  
      describe("POST /logout", () => {
        it("should return 404", async () => {
          const res = await request(serverInstance).post("/logout").send();
          expect(res.statusCode).toEqual(404);
        });
      });
    });
  
    // signup tests
    describe("signup ", () => {
      describe("POST /signup", () => {
        it("should return 400 if no password is provided", async () => {
          const res = await request(serverInstance).post("/signup").send({
            email: user0.email,
          });
          expect(res.statusCode).toEqual(400);
        });
  
        it("should return 400 if the password is an empty string", async () => {
          const res = await request(serverInstance).post("/signup").send({
            email: user1.email,
            password: "",
          });
          expect(res.statusCode).toEqual(400);
        });
  
        it("should return 200 if signup is successful and account is created", async () => {
          const res = await request(serverInstance).post("/signup").send(user1);
          expect(res.statusCode).toEqual(200);
        });
  
        it("should return 409 Conflict with a repeat signup", async () => {
          let res = await request(serverInstance).post("/signup").send(user0);
          expect(res.statusCode).toEqual(200);
          res = await request(serverInstance).post("/signup").send(user0);
          expect(res.statusCode).toEqual(409);
        });
  
        it("should not store raw password", async () => {
          await request(serverInstance).post("/signup").send(user0);
          const users = await User.find().lean();
          users.forEach((user) => {
            expect(Object.values(user).includes(user0.password)).toBe(false);
          });
        });
      });
    });
  
    describe.each([user0, user1])("User %#", (user) => {
      beforeEach(async () => {
        // before each of the following tests
        // create user accounts using the temp data from above
        await request(serverInstance).post("/signup").send(user0);
        await request(serverInstance).post("/signup").send(user1);
      });
  
      describe("POST /", () => {
        it("should return 400 when a password isn't provided", async () => {
          const res = await request(serverInstance).post("/login").send({
            email: user.email,
          });
          expect(res.statusCode).toEqual(400);
        });
  
        it("should return 401 when the password doesn't match our records", async () => {
          const res = await request(serverInstance).post("/login").send({
            email: user.email,
            password: "123",
          });
          expect(res.statusCode).toEqual(401);
        });
  
        it("should return 200 and a token when the correct password is provided", async () => {
          const res = await request(serverInstance).post("/login").send(user);
          expect(res.statusCode).toEqual(200);
          expect(typeof res.body.token).toEqual("string");
        });
  
        it("the token should not be stored in the user database", async () => {
          const res = await request(serverInstance).post("/login").send(user);
          const token = res.body.token;
          const users = await User.find().lean();
          users.forEach((user) => {
            expect(Object.values(user)).not.toContain(token);
          });
        });
  
        it(`should return a JWT with user's email, _id, and roles inside, but not their password`, async () => {
          const res = await request(serverInstance).post("/login").send(user);
          const token = res.body.token;
          const decodedToken = jwt.decode(token);
          expect(decodedToken.email).toEqual(user.email);
          expect(decodedToken.roles).toEqual(["viewer"]);
          expect(decodedToken._id).toMatch(
            /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i,
          ); // mongo _id regex
          expect(decodedToken.password).toBeUndefined();
        });
      });
    });
  
    describe("After both users login", () => {
      let token0;
      let token1;
  
      beforeEach(async () => {
        await request(serverInstance).post("/signup").send(user0);
        const res0 = await request(serverInstance).post("/login").send(user0);
        token0 = res0.body.token;
        await request(serverInstance).post("/signup").send(user1);
        const res1 = await request(serverInstance).post("/login").send(user1);
        token1 = res1.body.token;
      });
  
      describe("PUT /password", () => {
        it("should reject a bogus token", async () => {
          const res = await request(serverInstance)
            .put("/password")
            .set("Authorization", "Bearer BAD")
            .send({ password: "123" });
          expect(res.statusCode).toEqual(401);
        });
  
        it("should reject an empty password", async () => {
          const res = await request(serverInstance)
            .put("/password")
            .set("Authorization", "Bearer " + token0)
            .send({ password: "" });
          expect(res.statusCode).toEqual(400);
        });
  
        it("should change the password for user0", async () => {
          const res = await request(serverInstance)
            .put("/password")
            .set("Authorization", "Bearer " + token0)
            .send({ password: "123" });
          expect(res.statusCode).toEqual(200);
          let loginRes0 = await request(serverInstance).post("/login").send(user0);
          expect(loginRes0.statusCode).toEqual(401);
          loginRes0 = await request(serverInstance).post("/login").send({
            email: user0.email,
            password: "123",
          });
          expect(loginRes0.statusCode).toEqual(200);
          const loginRes1 = await request(serverInstance).post("/login").send(user1);
          expect(loginRes1.statusCode).toEqual(200);
        });
        
        it("should change the password for user1", async () => {
          const res = await request(serverInstance)
            .put("/password")
            .set("Authorization", "Bearer " + token1)
            .send({ password: "123" });
          expect(res.statusCode).toEqual(200);
          const loginRes0 = await request(serverInstance).post("/login").send(user0);
          expect(loginRes0.statusCode).toEqual(200);
          let loginRes1 = await request(serverInstance).post("/login").send(user1);
          expect(loginRes1.statusCode).toEqual(401);
          loginRes1 = await request(serverInstance).post("/login").send({
            email: user1.email,
            password: "123",
          });
          expect(loginRes1.statusCode).toEqual(200);
        });
      });
    });
  });
  