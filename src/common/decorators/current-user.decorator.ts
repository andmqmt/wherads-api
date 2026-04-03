import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

type AuthenticatedRequest = Request & {
  user: { userId: string; email: string };
};

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): { userId: string; email: string } => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
