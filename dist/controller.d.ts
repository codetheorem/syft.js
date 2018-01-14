import { Tensor, FloatTensor, IntTensor } from './Tensor';
export declare function log(message: any): void;
export declare function cmd(functionCall: string, params?: any[]): SocketCMD;
export declare function num_models(): Promise<string | number | boolean | any[] | FloatTensor | IntTensor | undefined>;
export declare function get_model(id: string): Promise<any>;
export declare function load(filename: string): Promise<string | number | boolean | any[] | FloatTensor | IntTensor | undefined>;
export declare function save(x: Tensor, filename: string): Promise<string | Tensor | FloatTensor | IntTensor | null>;
export declare function concatenate(tensors: Tensor[], axis?: number): Promise<string | number | boolean | any[] | FloatTensor | IntTensor | undefined>;
export declare function num_tensors(): Promise<string | number | boolean | any[] | FloatTensor | IntTensor | undefined>;
export declare function new_tensors_allowed(allowed?: boolean): Promise<string | number | boolean | any[] | FloatTensor | IntTensor | undefined>;
export declare function get_tensor(id: string): Tensor;
export declare function __getitem__(id: string): Tensor;
export declare function params_func(cmd: (name: string, params: any[]) => SocketCMD, name: string, params: any[], return_type?: string): Promise<string | number | boolean | any[] | FloatTensor | IntTensor | undefined>;
export declare function no_params_func(cmd: (name: string, params: any[]) => SocketCMD, name: string, return_type: string): Promise<string | number | boolean | any[] | FloatTensor | IntTensor | undefined>;
export declare function sendJSON(message: any, response?: boolean): Promise<string>;