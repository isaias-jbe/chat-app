export class StorageKeys {

  /**
   * Esta classe contém chaves que são usadas para armazenar dados do 
   * login do usuário.
   * Chaves;
   * @KEEP_SIGNED   -> Manter-se logado true/false
   * @AUTH_TOKEN    -> Armazena token de autenticação String
   * @REMEMBER_ME   -> Gravar dados de login true/false
   * @USER_EMAIL    -> Armazena o email do usuário
   * @USER_PASSWORD -> Armazena o password do usuário
   */
  static KEEP_SIGNED    = 'agc-keep-signed';
  static AUTH_TOKEN     = 'agc-auth-token';
  static REMEMBER_ME    = 'agc-remember-me';
  static USER_EMAIL     = 'agc-user-email';
  static USER_PASSWORD  = 'agc-user-password';
}
