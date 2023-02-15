import type { CliOptions } from '@dynatrace/dtp-cli';

const config: CliOptions = {
  environmentUrl: 'https://<yourtenant>.apps.dynatrace.com/',
  app: {
    id: 'my.flow.demo',
    name: 'Flow Demo',
    version: '0.0.0',
    description: 'A proof of concept on how to include 3rd party viz',
    scopes: [
      { name: 'environment-api:entities:read', comment: 'default template' },
    ]
  },
};

module.exports = config;