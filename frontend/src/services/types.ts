/**
 * The response from the server is either an error or the data requested for.
 */
export type ServerResponse<ExpectedData> = ServerErrorResponse | ExpectedData;

/**
 * Structure of an error response from the server.
 */
export interface ServerErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
}
