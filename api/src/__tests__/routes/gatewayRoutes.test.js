const server = require("../../server");
const request = require("supertest");

describe('hello world tests', () => {
    test('it returns hello world', async () => {
        const resp = await request(server).get("/api/gateways/");
        expect(resp.statusCode).toBe(200);
        expect(resp.text).toBe("Hello World");
    });
    test('it returns hello world + id', async () => {
        for(let i = 1;i < 30;i+=3){
            const resp = await request(server).get("/api/gateways/" + i);
        expect(resp.statusCode).toBe(200);
        expect(resp.text).toBe("Hello World " + i);
        }
    });
});
