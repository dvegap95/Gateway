require("../dotenv");
const Gateway = require("../../models/Gateway");
require("dotenv").config();
const mongoose = require("mongoose");
//id for working globally with a known gateway
const _id = new mongoose.Types.ObjectId();
//generic gateway valid data
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
		//set of data with strings and wether thei're valid ip addresses or not
		  let ips = [
		  { value: "192.168.1.9", valid: true },
		  { value: "262.168.1.9", valid: false },
		  { value: "262.168", valid: false },
		  { value: "dsdkmsald sakdl", valid: false },
		  { value: "1/1.2.3.5", valid: false },
		];
  
		for (let i = 0; i < ips.length; i++) {//for each set of data
		  let ip = ips[i];
		  let gw = new Gateway();//create gateway
		  gw.ipAddress = ip.value;//assign the data set ip
		  let error = gw.validateSync();//validate
		  expect(Boolean(error)).toBe(!ip.valid);//expectit error to exixt only if not valid
		  if(!ip.valid){
			  //expect custom human readable validator message
			  expect(error.errors.ipAddress.message).toBe(`${ip.value} is not a valid ip address`);
		  }
		}
	  });
	});
  describe("db CRUD operations", () => {
    beforeAll(() => {//connect to target DB
      mongoose.connect(process.env.DATABASE_URL);
      const db = mongoose.connection;
      db.on("error", (e) => {
        process.exit(1);
      });
    });
    it("saves and loads a gateway",async () => {
		let gw = new Gateway({...gatewayData,_id});//create gateway model

		let response = await gw.save();//save gateway
		
		let gwResp = await Gateway.findById(_id);//fetch same gateway by id from DB
		
		//compare every field of retreived gateway to match every field of save gateway response 
		for (const key in gw.gwResp) {
			if (Object.hasOwnProperty.call(response, key)) {
				expect(response[key]).toBe(gwResp[key]);
			}
		}
	});
    it("updates a gateway",async () => {
		let gw = await Gateway.findById(_id);//fetch previously created gateway

		expect(gw.ipAddress).toBe(gatewayData.ipAddress);//confirm target property is unchanged

		gw.ipAddress = "0.0.0.0";//change target property

		let response = await gw.save();//save changes
		expect(response.ipAddress).toBe("0.0.0.0");//expect modified object in save operation result
		
		let gwResp = await Gateway.findById(_id);//fetch gateeway by id from DB
		expect(gwResp.ipAddress).toBe("0.0.0.0");//expect modified object in findById response
		
	});

	it("updates a gateway device",async () => {
		let gw = await Gateway.findById(_id);//fetch previously created gateway

		expect(gw.devices[0].vendor).toBe(gatewayData.devices[0].vendor);//confirm target property is unchanged

		gw.devices[0].vendor = "aaa";//change target property

		let response = await gw.save();//save changes
		
		let gwResp = await Gateway.findById(_id);//expect modified object in save operation result
		
		expect(response.devices[0].vendor).toBe("aaa");//fetch gateeway by id from DB
		expect(gwResp.devices[0].vendor).toBe("aaa");//expect modified object in findById response
	});

	it("deletes gateway",async ()=>{
		await Gateway.findByIdAndRemove(_id);//find and remove gateway
		let gwResp = await Gateway.findById(_id);//find gateway by id
		expect(Boolean(gwResp)).toBe(false);//expect gateway not to exist
	})
  });
});
