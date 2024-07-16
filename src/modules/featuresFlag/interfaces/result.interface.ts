export type IResultSocket = IResult | Error | null;

export interface IResult {
  status: string;
  data: any;
}
