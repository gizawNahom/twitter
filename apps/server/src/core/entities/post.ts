export class Post {
  private id: string;
  private text: string;
  private userId: string;
  private createdAt: Date;

  setId(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId(): string {
    return this.userId;
  }

  setText(text: string) {
    this.text = text;
  }

  getText(): string {
    return this.text;
  }

  setCreatedAt(timestamp: Date) {
    this.createdAt = timestamp;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  isSame(other: Post): boolean {
    return this.id === other.getId();
  }
}
