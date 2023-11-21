class RefreshTokensCommand {
  id: string;
  refreshToken: string;

  constructor(id: string, refreshToken: string) {
    this.id = id;
    this.refreshToken = refreshToken;
  }
}

export default RefreshTokensCommand;
