export class GoogleAuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GoogleAuthError';
  }
}
