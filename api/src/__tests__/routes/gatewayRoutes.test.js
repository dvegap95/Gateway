const path = require('path');
require('dotenv').config({path:path.resolve(process.cwd(),"test.env")});
const request = require("supertest");
const server = require("../../server");

const gatewayData = {
  name: "gatewayTest",
  serialNumber: "123",
  ipAddress: "10.10.10.10",
  devices: [
    { uid: 1, vendor: "vendor1", status: "online" },
    { uid: 2, vendor: "vendor2", status: "offline" },
    { uid: 3, vendor: "vendor3", status: "online" },
  ],
};

describe("gateways routes", () => {
  // it("creates a gateway",()=>{
  //     const resp = await request(server).post("/api/gateways/",{body:gatewayData});
  //     expect(resp.statusCode).toBe(201);
  //     expect(resp.text).toBe("Hello World");
  // })
  it("fetches all gateways", async () => {
    const resp = await request(server).get("/api/gateways/");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.length).toBeGreaterThanOrEqual(0);
  });
  test("gateways CRUD", async () => {
    let response = await request(server)
      .post("/api/gateways/")
      .send(gatewayData); //creates gateway

    expect(response.statusCode).toBe(201);
    let gateway = response.body; //actual gateway data
    expect(!!gateway._id).toBe(true);

    console.log(gateway);
    for (const key in gatewayData) {
      if (Object.hasOwnProperty.call(gatewayData, key)) {
        if (!Array.isArray(gateway[key])) {
          expect(gateway[key]).toBe(gatewayData[key]);
        } else {
          gateway[key].forEach((el, index) => {
            expect(el.id).toBe(gatewayData[key][index].id);
          });
        }
      }
    }

    let response2 = await request(server).get("/api/gateways/" + gateway._id);

    expect(response2.statusCode).toBe(200);
    let gateway2 = response2.body;

    for (const key in gateway2) {
      if (Object.hasOwnProperty.call(gateway2, key)) {
        expect(gateway[key]).toStrictEqual(gateway2[key]);
      }
    }

    let response3 = await request(server)
      .patch("/api/gateways/" + gateway._id)
      .send({ name: "gateway name changed" });

    expect(response3.statusCode).toBe(200);
    let gateway3 = response3.body;

    for (const key in gateway2) {
      if (Object.hasOwnProperty.call(gateway2, key)) {
        if (key === "name") {
          expect(gateway3[key]).toBe("gateway name changed");
        } else {
          expect(gateway3[key]).toStrictEqual(gateway2[key]);
        }
      }
    }

    let response4 = await request(server).delete(
      "/api/gateways/" + gateway._id
    );
    expect(response4.statusCode).toBe(200);
    const gateway4 = response4.body;

    for (const key in gateway4) {
      if (Object.hasOwnProperty.call(gateway4, key)) {
        expect(gateway3[key]).toStrictEqual(gateway4[key]);
      }
    }

    response4 = await request(server).delete("/api/gateways/" + gateway._id);
    expect(response4.statusCode).toBe(404);
  });

  it("returns 404 when not found", async () => {
    let response = await request(server).get("/api/gateways/" + "random-id");
    expect(response.statusCode).toBe(404);
    response = await request(server)
      .patch("/api/gateways/" + "random-id")
      .send({});
    expect(response.statusCode).toBe(404);
    response = await request(server).delete("/api/gateways/" + "random-id");
    expect(response.statusCode).toBe(404);
  });

  it("validates when creating and updating", async () => {
    let gateway = gatewayData;
    gateway.ipAddress = "300.0.0.1";
    let response = await request(server)
      .post("/api/gateways/")
      .send(gateway); //creates gateway with wrong ip
    expect(response.statusCode).toBe(400);
    expect(response.body.ipAddress.name).toBe("ValidatorError");

    gateway.ipAddress = "200.0.0.1";

    response = await request(server)
      .post("/api/gateways/")
      .send({...gateway,devices:new Array(11).fill({})}); //creates gateway
      expect(response.statusCode).toBe(400);
      expect(response.body.devices.name).toBe("ValidatorError");
  
    response = await request(server).post("/api/gateways/").send({...gateway,devices:new Array(10).fill({})}); //creates right gateway
    expect(response.statusCode).toBe(201);

    let id = response.body._id;

    response = await request(server)
      .patch("/api/gateways/" + id)
      .send({
        ipAddress: "3.3.4.5.6",
      });
    expect(response.statusCode).toBe(400);


    response = await request(server)
    .patch("/api/gateways/" + id)
    .send({
      devices:new Array(11).fill({})
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.devices.name).toBe("ValidatorError");

    response = await request(server)
      .patch("/api/gateways/" + id)
      .send({
        ipAddress: "3.4.5.6",
        devices:new Array(10).fill({})
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.ipAddress).toBe("3.4.5.6");

    response = await request(server).delete("/api/gateways/" + id);
    expect(response.statusCode).toBe(200);
  });

  it("adds, removes and validates gateway's devices", async () => {
    let response = await request(server).post("/api/gateways/").send({});
    expect(response.statusCode).toBe(201);
    expect(response.body.devices.length).toBe(0);
    let _id = response.body._id;
    console.log({_id});

    response = await request(server).post("/api/gateways/"+_id+"/device").send({});
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("offline");//default
    let devId = response.body._id;

    response = await request(server).get("/api/gateways/"+_id);
    expect(response.statusCode).toBe(200);
    expect(response.body.devices.length).toBe(1);
    expect(response.body._id).toBe(_id);
    expect(response.body.devices[0]._id).toBe(devId);

    response = await request(server).delete("/api/gateways/"+_id+"/device/"+devId);
    expect(response.statusCode).toBe(200);


    response = await request(server).get("/api/gateways/"+_id);
    expect(response.statusCode).toBe(200);
    expect(response.body.devices.length).toBe(0);

    response = await request(server).delete("/api/gateways/" + _id);
    expect(response.statusCode).toBe(200);
  });
});
