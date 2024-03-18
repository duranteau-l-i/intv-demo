export interface ICommandHandler {
  handle(...T: any): Promise<any>;
}
