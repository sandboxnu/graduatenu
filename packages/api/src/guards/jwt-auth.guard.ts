import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Used to protect any route with the JWT strategy. The JWT strategy verifies a
 * JWT in the request and attaches the student to the request object on
 * successful verfication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
