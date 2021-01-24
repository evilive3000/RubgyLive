import * as admin from 'firebase-admin';

admin.initializeApp();

export class UniqueIdsStorage {
  readonly db = admin.firestore();
  readonly name: string;
  private storage = new Set<number>();

  constructor(name: string) {
    this.name = `rugby/${name}`;
  }

  list(): number[] {
    return [...this.storage];
  }

  async persist(): Promise<UniqueIdsStorage> {
    await this.db.doc(this.name).set({ids: this.list()});
    return this;
  }

  async load(): Promise<void> {
    const doc = await this.db.doc(this.name).get();
    const {ids} = doc.data() || {ids: []}
    this.storage = new Set(ids);
  }

  add(id: number): this {
    this.storage.add(id);
    return this;
  }

  del(id: number): boolean {
    return this.storage.delete(id);
  }
}
