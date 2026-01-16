import {ObjectId} from 'mongodb';

import config from '@config';

import vent from './vent';

import type {GenericObject} from '@customTypes';

function deepExtend(...args: GenericObject[]): GenericObject {
    const out = args[0] || {};
    for (let i = 1; i < args.length; i++) {
        const obj = args[i];
        if (!obj) continue;
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (typeof obj[key] === 'object') {
                    if (obj[key] instanceof Array == true)
                        out[key] = obj[key].slice(0);
                    else out[key] = deepExtend(out[key], obj[key]);
                } else out[key] = obj[key];
            }
        }
    }
    return out;
}

/**
 * Generate random numbers with passed length
 */
function generateRandomNumbers(min = 1, max = 9, len = 6): number {
    let num: number;
    for (let i = 0; i < len; i++) {
        num = (num || 0) * 10 + Math.floor(Math.random() * (max - min) + min);
    }
    return num;
}

/**
 * Generate random numbers string
 */
function generateRandomNumbersString(min = 1, max = 9, len = 6): string {
    let str = '';
    for (let i = 0; i < len; i++) {
        str += Math.floor(Math.random() * (max - min) + min);
    }
    return str;
}

export const generateToken = (
    len = 16,
    chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    additionalChars = '',
): string => {
    const allChars = chars + additionalChars;
    let token = '';
    for (let i = len; i > 0; --i) {
        token += allChars[Math.round(Math.random() * (allChars.length - 1))];
    }
    return token;
};

/**
 * Check if user has minimum age
 */
function hasMinimumAge(date: string): boolean {
    const dateObj = new Date(date);
    if (isValidDate(dateObj)) {
        const minimumDate = new Date();
        minimumDate.setFullYear(minimumDate.getFullYear() - config.MINIMUM_AGE);
        if (dateObj <= minimumDate) {
            return true;
        }
    }
    return false;
}

/**
 * Check if developer environment
 */
function isDev(): boolean {
    return config.NODE_ENV === 'development';
}

/**
 * Checks if passed value is a number or not
 */
function isNumber(num: string | number): boolean {
    return !isNaN(parseFloat(num as string)) && isFinite(num as number);
}

/**
 * Check if value is object
 */
function isObject(value: GenericObject): boolean {
    return value instanceof Object && !Array.isArray(value);
}

/**
 * Is Valid Object Ids
 */
function isValidObjectIds(ids: (ObjectId | string)[]): boolean {
    if (Array.isArray(ids) && ids.length) {
        for (let i = 0; i < ids.length; i++) {
            if (!ObjectId.isValid(ids[i])) {
                return false;
            }
        }
        return true;
    }
    return false;
}

/**
 * Is Valid Object Id
 */
function isValidObjectId(id: ObjectId | string): boolean {
    return ObjectId.isValid(id);
}

/**
 * Check if passed is a valid date
 */
function isValidDate(date: string | number | Date): boolean {
    if (typeof date === 'string' || typeof date === 'number') {
        const dateInNumber = Number(date);
        if (isFinite(dateInNumber)) {
            date = dateInNumber;
        }
        date = new Date(date);
    }
    const d = new Date(date);
    return !isNaN(d.getTime());
}

/**
 * Log
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
function log(...args: any): void {
    if (isDev()) {
        console.log(...args);
    }
}

/**
 * Loops through object and eliminates null and undefined properties
 */
function removeNullAndUndefined(obj: GenericObject): GenericObject {
    const newObj = {};
    for (const i in obj) {
        if (obj[i] !== null && obj[i] !== undefined) {
            newObj[i] = obj[i];
        }
    }
    return newObj;
}

/**
 * Contains commonly used regular expressions
 */
const regex = {
    ALPHA: /^[a-zA-Z]+$/,
    ALPHA_NUMERIC: /^[a-zA-Z0-9]+$/,
    ALPHA_WITH_SPACE: /^[A-Za-z ]+$/,
    DATE_STRING: /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/, // mm/dd/yyyy
    EMAIL: /(.+)@(.+){2,}\.(.+){2,}/,
    MOBILE: /^\d{10}$/,
    NUMERIC: /^[0-9]+$/,
    USERNAME: /^[a-zA-Z0-9._]*$/,
};

function pick(obj: GenericObject, keys: string[]): GenericObject {
    const result = {};
    for (let i = 0; i < keys.length; i++) {
        if (obj[keys[i]] !== undefined) {
            result[keys[i]] = obj[keys[i]];
        }
    }
    return result;
}

export default {
    deepExtend,
    generateRandomNumbers,
    generateRandomNumbersString,
    generateToken,
    hasMinimumAge,
    removeNullAndUndefined,
    isDev,
    isNumber,
    isObject,
    isValidDate,
    isValidObjectIds,
    isValidObjectId,
    log,
    regex,
    pick,
    vent,
};
