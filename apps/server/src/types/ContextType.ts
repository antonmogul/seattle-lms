import { Request, Response } from "express";

export type ContextType = {
	req: Request;
	res: Response;
	user?: string;
	userEmail?: string;
};
