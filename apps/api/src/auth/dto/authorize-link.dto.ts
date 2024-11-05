import { ApiProperty } from '@nestjs/swagger';

export class AuthorizeLinkDto {
  @ApiProperty({
    description: 'The URL used to authorize the user with Google OAuth',
    example: 'https://accounts.google.com/o/oauth2/v2/auth?state=GOOGLE_LOGIN...',
  })
  authorizeLink: string;
}
