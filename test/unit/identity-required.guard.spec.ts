import { ExecutionContext } from '@nestjs/common';
import { IdentityRequiredGuard } from 'src/guards/identity-required/identity-required.guard';

describe('[ IdentityRequiredGuard ]', () => {
  let request: any = {
    user: true,
  };

  const context = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;

  beforeEach(() => {
    request = {
      user: true,
    };
  });

  it('should throw an error if user not provided in the request', () => {
    const guard = new IdentityRequiredGuard();
    request = {};
    expect(() => guard.canActivate(context)).toThrow();
  });

  it('should return true if user is provided in the request', () => {
    const guard = new IdentityRequiredGuard();
    const result = guard.canActivate(context);
    expect(result).toBe(true);
  });
});
