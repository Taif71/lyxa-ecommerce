import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Auth Controller
 */
@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  /**
   * Constructor
   * @param {AuthService} authService
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * User login with jwtToken
   * @Body {AuthDTO} loginDto
   * @returns {Promise<any>}
   */
  @ApiTags('Auth')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 200,
    description: 'Return user information.',
  })
  @Post('login')
  public async login(@Res() res, @Body() loginDto: AuthDTO): Promise<any> {
    const authRes = await this.authService.login(loginDto);
    return res
      .status(authRes.status)
      .set({
        'X-ECOMMERCE-KEY': authRes.token,
        'X-ECOMMERCE-KEY-EXPIRES': authRes.expiresIn,
      })
      .json(authRes.user);
  }
}
