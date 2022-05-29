require("../dotenv");
const Gateway = require("../../models/Gateway");
require("dotenv").config();
const mongoose = require("mongoose");

const _id = new mongoose.Types.ObjectId();
const gatewayData = {
	name:"gatewayTest",
	serialNumber:"123",
	ipAddress:"10.10.10.10",
	devices:[
		{uid:1,vendor:"vendor1",status:"online"},
		{uid:2,vendor:"vendor2",status:"offline"},
		{uid:3,vendor:"vendor3",status:"online"}
	],
}
describe("mongoDB gateway CRUD", () => {
  describe("validations", () => {
    it("validates gateway ip", async () => {
      let ips = [
        { value: "192.168.1.9", valid: true },
        { value: "262.168.1.9", valid: false },
        { value: "262.168", valid: false },
        { value: "dsdkmsald sakdl", valid: false },
        { value: "1/1.2.3.5", valid: false },
      ];

      for (let i = 0; i < ips.length; i++) {
        let ip = ips[i];
        let gw = new Gateway();
        gw.ipAddress = ip.value;
        let error = gw.validateSync();
        expect(Boolean(error)).toBe(!ip.valid);
        if(!ip.valid){
			expect(error.errors.ipAddress.message).toBe(`${ip.value} is not a valid ip address`);
		}
      }
    });
  });
  describe("db CRUD operations", () => {
    beforeAll(() => {
      mongoose.connect(process.env.DATABASE_URL);
      const db = mongoose.connection;
      db.on("error", (e) => {
        process.exit(1);
      });
    //   db.on("open", () => {
    //     console.log("db open");
    //   });
    });
    it("saves and loads a gateway",async () => {
		let gw = new Gateway({...gatewayData,_id});

		let response = await gw.save();
		
		let gwResp = await Gateway.findById(_id);
		
		for (const key in gw.gwResp) {
			if (Object.hasOwnProperty.call(response, key)) {
				expect(response[key]).toBe(gwResp[key]);
			}
		}
	});
    it("updates a gateway",async () => {
		let gw = await Gateway.findById(_id);

		expect(gw.ipAddress).toBe(gatewayData.ipAddress);

		gw.ipAddress = "0.0.0.0";

		let response = await gw.save();
		
		let gwResp = await Gateway.findById(_id);
		
		expect(response.ipAddress).toBe("0.0.0.0");
		expect(gwResp.ipAddress).toBe("0.0.0.0");
	});

	it("updates a gateway device",async () => {
		let gw = await Gateway.findById(_id);

		expect(gw.devices[0].vendor).toBe(gatewayData.devices[0].vendor);

		gw.devices[0].vendor = "aaa";

		let response = await gw.save();
		
		let gwResp = await Gateway.findById(_id);
		
		expect(response.devices[0].vendor).toBe("aaa");
		expect(gwResp.devices[0].vendor).toBe("aaa");
	});

	it("deletes gateway",async ()=>{
		await Gateway.findByIdAndRemove(_id);
		let gwResp = await Gateway.findById(_id);
		expect(Boolean(gwResp)).toBe(false);
	})
  });
});
