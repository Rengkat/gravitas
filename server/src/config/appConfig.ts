import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  env: process.env.NODE_ENV || 'production',
  port: parseInt(process.env.PORT || '5000', 10),
}));
