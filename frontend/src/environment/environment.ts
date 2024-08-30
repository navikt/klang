export const LOGGED_IN_PATH = '/loggedin-redirect';

enum EnvString {
  PROD = 'production',
  DEV = 'development',
  LOCAL = 'local',
}

interface EnvironmentVariables {
  readonly apiUrl: string;
  readonly environment: EnvString;
  readonly version: string;
  readonly isProduction: boolean;
  readonly isDevelopment: boolean;
  readonly isLocal: boolean;
  readonly isDeployed: boolean;
}

class Environment implements EnvironmentVariables {
  public readonly apiUrl: string;
  public readonly environment: EnvString;
  public readonly version: string;
  public readonly isProduction: boolean;
  public readonly isDevelopment: boolean;
  public readonly isLocal: boolean;
  public readonly isDeployed: boolean;

  constructor() {
    this.apiUrl = '/api';
    this.environment = this.getEnvironment();
    this.version = this.getVersion();
    this.isProduction = this.environment === EnvString.PROD;
    this.isDevelopment = this.environment === EnvString.DEV;
    this.isLocal = this.environment === EnvString.LOCAL;
    this.isDeployed = !this.isLocal;
  }

  private getEnvironment(): EnvString {
    const env = document.documentElement.getAttribute('data-environment');

    if (env === EnvString.PROD || env === EnvString.DEV) {
      return env;
    }

    return EnvString.LOCAL;
  }

  private getVersion(): string {
    const version = document.documentElement.getAttribute('data-version');

    if (version === null || version === '{{VERSION}}') {
      return EnvString.LOCAL;
    }

    return version;
  }
}

export const ENVIRONMENT = new Environment();
