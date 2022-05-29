require("./dotenv");
const request = require("supertest");
const server = require("../server");
const fs = require("fs");
describe('serve static content', () => {
    it("loads index.html page by default",async()=>{
        const response = await request(server).get("/");
        let indexStr = fs.readFileSync(process.env.STATIC_CONTENT_PATH + "/index.html").toString();
        expect(response.text).toEqual(indexStr);
     })
     it("loads index.html page as fallback",async()=>{
        const response = await request(server).get("/nonexistent route");
        let indexStr = fs.readFileSync(process.env.STATIC_CONTENT_PATH + "/index.html").toString();
        expect(response.text).toEqual(indexStr);
     })
   })
