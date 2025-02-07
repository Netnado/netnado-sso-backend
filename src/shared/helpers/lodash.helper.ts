import _ from 'lodash';

export class LodashHelper {
    static deepClone(value: any): any {
        return _.cloneDeep(value);
    }

    static deepEqual(value1: any, value2: any): boolean {
        return _.isEqual(value1, value2);
    }

    static deepMerge(value1: any, value2: any): any {
        return _.merge(value1, value2);
    }

    static omit(value: any, keys: string[]): any {
        return _.omit(value, keys);
    }

    static pick(value: any, keys: string[]): any {
        return _.pick(value, keys);
    }
}
