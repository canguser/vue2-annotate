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
    }

};