import { EnvironmentPlugin } from 'webpack';
import { config } from 'dotenv';

config();

module.exports = {
  plugins: [
    new EnvironmentPlugin([
      'NG_APP_FLOAT_API',
      'NG_APP_STEAM_API',
    ])
  ]
}