export const utils = {

    getDescriptors(
        target,
        {
            filter = () => true,
            includePrototype = true
        } = {}
    ) {
        const results = Object.entries(
            Object.getOwnPropertyDescriptors(target)
        ).filter(filter);

        return {
            ...includePrototype ? utils.getDescriptors(Object.getPrototypeOf(target), {
                filter, includePrototype: false
            }) : {},
            ...utils.fromEntries(
                results
            ),
        }
    },

    fromEntries(entries) {
        const result = {};
        entries.forEach(entry => {
            result[entry[0] == null ? '' : entry[0]] = entry[1];
        });
        return result;
    },

    getKeyValues(obj) {
        return [...Object.getOwnPropertyNames(obj), ...(Object.getOwnPropertySymbols(obj))].map(key => [key, obj[key]]);
    },

    shallowClone(obj) {
        const result = {};
        utils.getKeyValues(obj).forEach(
            ([key, value]) => {
                result[key] = value;
            }
        );
        return result;
    },
    deepClone(obj, deep = Infinity, objectStack = []) {

        if (deep <= 0 || objectStack.includes(obj)) {
            return null; // 停止克隆
        }

        if (obj instanceof Date) {
            return new Date(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map(o => typeof o === 'object' ? utils.deepClone(o, deep - 1, objectStack.concat(obj)) : o);
        }

        const result = utils.shallowClone(obj);
        utils.getKeyValues(result).forEach(
            ([key, value]) => {
                if (typeof value === 'object') {
                    result[key] = utils.deepClone(value, deep - 1, objectStack.concat(obj));
                }
            }
        );
        return result;
    }

};