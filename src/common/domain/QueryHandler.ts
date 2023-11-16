export interface IQueryHandler {
  handle(...T: any): Promise<any>;
}
