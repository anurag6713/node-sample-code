/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import axios, {AxiosResponse} from 'axios';
import {
    HttpResponse,
    RecognizedString,
    us_socket_context_t,
} from 'uWebSockets.js';

import type {GenericObject} from '@customTypes';

//
// Request wrapper around axios
//
async function request(
    method: 'get' | 'post',
    url: string,
    data?: GenericObject,
    jwtToken?: string,
): Promise<AxiosResponse<GenericObject>> {
    let response: AxiosResponse<GenericObject>;
    try {
        const config: GenericObject = {};
        if (jwtToken) {
            config.headers = {
                AUTHORIZATION: 'bearer ' + jwtToken,
            };
        }
        if (method === 'get') {
            response = await axios.get(url, config);
        } else {
            response = await axios.post(url, data, config);
        }
    } catch (e) {
        response = e.response;
    }
    return response;
}

class MockHttpResponse implements HttpResponse {
    [key: string]: any;
    write(_chunk: RecognizedString): boolean {
        return true;
        throw new Error('Method not implemented.');
    }
    tryEnd(
        _fullBodyOrChunk: RecognizedString,
        _totalSize: number,
    ): [boolean, boolean] {
        throw new Error('Method not implemented.');
    }
    close(): HttpResponse {
        throw new Error('Method not implemented.');
    }
    getWriteOffset(): number {
        throw new Error('Method not implemented.');
    }
    onWritable(_handler: (offset: number) => boolean): HttpResponse {
        throw new Error('Method not implemented.');
    }
    onAborted(_handler: () => void): HttpResponse {
        throw new Error('Method not implemented.');
    }
    onData(
        _handler: (chunk: ArrayBuffer, isLast: boolean) => void,
    ): HttpResponse {
        throw new Error('Method not implemented.');
    }
    getRemoteAddress(): ArrayBuffer {
        throw new Error('Method not implemented.');
    }
    getRemoteAddressAsText(): ArrayBuffer {
        throw new Error('Method not implemented.');
    }
    getProxiedRemoteAddress(): ArrayBuffer {
        throw new Error('Method not implemented.');
    }
    getProxiedRemoteAddressAsText(): ArrayBuffer {
        throw new Error('Method not implemented.');
    }
    cork(_cb: () => void): HttpResponse {
        throw new Error('Method not implemented.');
    }
    upgrade<T>(
        _userData: T,
        _secWebSocketKey: RecognizedString,
        _secWebSocketProtocol: RecognizedString,
        _secWebSocketExtensions: RecognizedString,
        _context: us_socket_context_t,
    ): void {
        throw new Error('Method not implemented.');
    }
    headers: Record<string, string> = {};
    result = '';
    status = '';

    end(result?: string): HttpResponse {
        this.result = result;
        return this;
    }

    getBody(): string {
        return this.result;
    }

    writeHeader(key: string, value: string): HttpResponse {
        this.headers[key] = value;
        return this;
    }

    getHeader(key: string): string {
        return this.headers[key];
    }

    writeStatus(status: string): HttpResponse {
        this.status = status;
        return this;
    }

    getStatus(): string {
        return this.status;
    }
}

export {request, MockHttpResponse};
