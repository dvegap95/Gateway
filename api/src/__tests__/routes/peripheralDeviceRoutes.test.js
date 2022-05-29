require("../dotenv");
const request = require("supertest");
const server = require("../../server");

const deviceData = {
  uid: 123,
  vendor:"vendor",  
};

describe("devices routes", () => {
  it("fetches all devices", async () => {
    const resp = await request(server).get("/api/peripheral-devices/");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.length).toBeGreaterThanOrEqual(0);
  });
  test("devices CRUD", async () => {
    let response = await request(server)
      .post("/api/peripheral-devices/")
      .send(deviceData); //creates device

    expect(response.statusCode).toBe(201);
    let device = response.body; //actual device data
    expect(!!device._id).toBe(true);
    expect(!!device.created).toBe(true);

    console.log(device);
    for (const key in deviceData) {
      if (Object.hasOwnProperty.call(deviceData, key)) {
          expect(device[key]).toBe(deviceData[key]);
      }
    }

    let response2 = await request(server).get("/api/peripheral-devices/" + device._id);

    expect(response2.statusCode).toBe(200);
    let device2 = response2.body;

    for (const key in device2) {
      if (Object.hasOwnProperty.call(device2, key)) {
        expect(device[key]).toStrictEqual(device2[key]);
      }
    }

    let response3 = await request(server)
      .patch("/api/peripheral-devices/" + device._id)
      .send({ uid: 222 });

    expect(response3.statusCode).toBe(200);
    let device3 = response3.body;

    for (const key in device2) {
      if (Object.hasOwnProperty.call(device2, key)) {
        if (key === "uid") {
          expect(device3[key]).toBe(222);
        } else {
          expect(device3[key]).toStrictEqual(device2[key]);
        }
      }
    }

    let response4 = await request(server).delete(
      "/api/peripheral-devices/" + device._id
    );
    expect(response4.statusCode).toBe(200);
    const device4 = response4.body;

    for (const key in device4) {
      if (Object.hasOwnProperty.call(device4, key)) {
        expect(device3[key]).toStrictEqual(device4[key]);
      }
    }

    response4 = await request(server).delete("/api/peripheral-devices/" + device._id);
    expect(response4.statusCode).toBe(404);
  });

  it("returns 404 when not found", async () => {
    let response = await request(server).get("/api/peripheral-devices/" + "random-id");
    expect(response.statusCode).toBe(404);
    response = await request(server)
      .patch("/api/peripheral-devices/" + "random-id")
      .send({});
    expect(response.statusCode).toBe(404);
    response = await request(server).delete("/api/peripheral-devices/" + "random-id");
    expect(response.statusCode).toBe(404);
  });

  it("validates when creating and updating", async () => {
    let device = deviceData;
    device.uid = "some string";
    let response = await request(server)
      .post("/api/peripheral-devices/")
      .send(device); //creates device with wrong ip
    expect(response.statusCode).toBe(400);
    expect(response.body.uid.name).toBe("CastError");

    device.uid = 222;

    response = await request(server)
      .post("/api/peripheral-devices/")
      .send({...device,status:"other"}); //creates device
      expect(response.statusCode).toBe(400);
      expect(response.body.status.name).toBe("ValidatorError");
  
    response = await request(server).post("/api/peripheral-devices/").send(device); //creates right device
    expect(response.statusCode).toBe(201);

    let id = response.body._id;

    response = await request(server)
      .patch("/api/peripheral-devices/" + id)
      .send({
        uid:"str",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.uid.name).toBe("CastError");


    response = await request(server)
    .patch("/api/peripheral-devices/" + id)
    .send({
      status:"aaaa"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.status.name).toBe("ValidatorError");

    response = await request(server)
      .patch("/api/peripheral-devices/" + id)
      .send({
        uid: 1,
        status:"online"
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("online");
    expect(response.body.uid).toBe(1);

    response = await request(server).delete("/api/peripheral-devices/" + id);
    expect(response.statusCode).toBe(200);
  });

});
