import { verifyToken } from "../middlewares/verifyToken";
import { type Request, type Response, type NextFunction } from "express";
import { describe, test, expect } from "vitest";

const mockNext = (e: any) => {
	if(e) {
		throw e;
	} else {
		return;
	}
}

describe("Verify Token Tests", () => {

  test("No token errors", async () => {
		const mockReq = {};
		await expect(verifyToken(mockReq as Request, {} as Response, mockNext as NextFunction)).rejects.toThrowError("not found");
	});

	test("Fake token errors", async () => {
		const mockReq = {
			headers: {
				authorization: "Bearer 1234",
			},
		};
		await expect(verifyToken(mockReq as Request, {} as Response, mockNext as NextFunction)).rejects.toThrowError();
	})
});
