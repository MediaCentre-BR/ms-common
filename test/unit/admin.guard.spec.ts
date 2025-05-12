import { ExecutionContext } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin-guard/admin.guard';

describe('AdminGuard', () => {
  let mockRequest: { user?: { userRole: string } } = {};
  const mockContext = {
    switchToHttp: () => ({
      getRequest: () => mockRequest,
    }),
  };

  [
    {
      request: {
        user: {
          userRole: 'admin',
        },
      },
      expectToThrow: false,
    },
    {
      request: {
        user: {
          userRole: 'user',
        },
      },
      expectToThrow: true,
    },
    {
      request: {
        user: {
          userRole: 'super-admin',
        },
      },
      expectToThrow: false,
    },
    {
      request: {},
      expectToThrow: true,
    },
    {
      request: {
        user: {
          userRole: 'invalid-role',
        },
      },
      expectToThrow: true,
    },
  ].forEach((request) => {
    describe('when request is ' + JSON.stringify(request.request), () => {
      beforeEach(() => {
        mockRequest = request.request;
      });

      it('should ' + (request.expectToThrow ? 'throw' : 'not throw'), () => {
        const guard = AdminGuard();
        if (request.expectToThrow) {
          expect(() =>
            guard.canActivate(mockContext as ExecutionContext),
          ).toThrow();
          return;
        }

        expect(guard.canActivate(mockContext as ExecutionContext)).toBe(true);
      });
    });
  });
});
