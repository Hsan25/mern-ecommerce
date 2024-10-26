import { Response } from "express";
const successCode = [200, 203, 204, 201];
const response = (
  res: Response,
  statusCode: number,
  msg?: string,
  data?: any,
) => {
  return res.status(statusCode).json({
    status: successCode.includes(statusCode) ? "success" : "error",
    msg,
    data: data || [],
  });
};
export default response;
