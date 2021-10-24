import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const UserId = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user._id;
  },
);
