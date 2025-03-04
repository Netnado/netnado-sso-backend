import { CanActivate, ConflictException, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtHelper } from "@/shared/helpers/jwt.helper";
import { AccountService } from "@/modules/account/account.service";

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly accountService: AccountService) { }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>() as any;
    const authorizationHeader = request.headers.authorization;
    const accountId = request.headers['x-account-id'];

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ") || !accountId) {
      throw new UnauthorizedException("Authorization header is missing");
    }
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedException("Token is missing");
    }

    try {
      const foundAccount = await this.accountService.findAccountById(accountId);
      if (!foundAccount) {
        throw new UnauthorizedException("Invalid token 1");
      }

      try {
        const decodedToken = JwtHelper.verifyToken(token, foundAccount.public_key);
        if (decodedToken.id !== accountId) {
          throw new ConflictException("Invalid credentials");
        }
      } catch (error) {
        if (JwtHelper.checkIfTokenSignatureError(error)) {
          throw new ConflictException("Invalid credentials");
        }
        if (JwtHelper.checkIfTokenExpiredError(error)) {
          throw new UnauthorizedException({ message: "Token has expired", errorCode: 20002 });
        }
        if (error instanceof ConflictException) {
          throw error;
        }
        throw new UnauthorizedException("Something went wrong verifying the token");
      }
      request.account = foundAccount;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException("Invalid token 3");
    }
  }
}