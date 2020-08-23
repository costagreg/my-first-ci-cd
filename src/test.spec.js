const server = require("./server");
const request = require("supertest");

describe("server", () => {
  describe("GET /", () => {
    it("returns Hello World", (done) => {
      request(server)
      .get('/')
      .end((err, res) => {
        if (err) { return done(err); }
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Hello world v3!');
        done();
      });
    });
  });
});
