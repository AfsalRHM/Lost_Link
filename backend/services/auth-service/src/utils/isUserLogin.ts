import { Request, Response } from "express"
import jwtFunctions from "./jwt";

export default function isUserLogin(req: Request, res: Response): void {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(200).json({status: false})
    };
    const decoded = jwtFunctions.verifyRefreshToken(refreshToken);
    console.log(decoded, 'the refresh Token decoded')
    if (!decoded) {
        res.status(200).json({status: false})
    } else {
        res.status(200).json({status: true})
    }
}
