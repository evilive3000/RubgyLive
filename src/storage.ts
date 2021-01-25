import * as admin from 'firebase-admin';

admin.initializeApp();

export class UniqueIdsStorage {
  readonly db = admin.firestore();
  readonly name: string;
  private storage = new Set<number>();
  private isDirty = false;

  constructor(name: string) {
    this.name = `rugby/${name}-json`;
  }

  list(): number[] {
    return [...this.storage];
  }

  async persist(): Promise<UniqueIdsStorage> {
    if (!this.isDirty) return this;

    await this.db.doc(this.name).set({json: JSON.stringify(this.list())});

    this.isDirty = false;

    return this;
  }

  async load(): Promise<void> {
    const doc = await this.db.doc(this.name).get();
    this.storage = doc.exists ? new Set(JSON.parse(doc.data()!.json)) : new Set();
    this.isDirty = false;
  }

  add(id: number): this {
    this.isDirty ||= !this.storage.has(id)
    this.storage.add(id);
    return this;
  }

  del(id: number): boolean {
    const deleted = this.storage.delete(id);
    this.isDirty ||= deleted;
    return deleted;
  }
}
