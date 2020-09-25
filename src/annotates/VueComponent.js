import {BasicAnnotationDescribe, AnnotationUtils, AnnotationGenerator} from "@palerock/annotate-js";
import {Extra} from "./Extra";
import {NativeApi} from "./NativeApi";
import {Computed} from "./Computed";
import {Props} from "./Props";

const getGetterProperties = target => {
    return [
        ...Object.getOwnPropertyNames(target)
            .map(property => ({name: property, descriptor: Object.getOwnPropertyDescriptor(target, property)}))
            .filter(property => 'get' in property.descriptor),
        ...Object.getOwnPropertyNames(Object.getPrototypeOf(target))
            .map(property => ({
                name: property, descriptor: Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), property)
            }))
            .filter(property => 'get' in property.descriptor)
    ];
};

export class VueComponentDescribe extends BasicAnnotationDescribe {

    constructor() {
        super();
        Object.assign(this.params, {
            name: ''
        })
    }

    get defaultKey() {
        return 'name'
    }

    get componentName() {
        return this.name || this.classEntity.name;
    }

    storageClassDecorator(targetType) {
        super.storageClassDecorator(targetType);

        const target = new targetType();
        this.target = target;

        const valuePropertyFilter = target => {
            return name => {
                const describe = Object.getOwnPropertyDescriptor(target, name);
                return describe && ('value' in describe)
            }
        };

        const propertyMap = AnnotationUtils.fromEntries(
            [
                ...Object.getOwnPropertyNames(target)
                    .filter(valuePropertyFilter(target)),
                ...Object.getOwnPropertyNames(Object.getPrototypeOf(target))
                    .filter(valuePropertyFilter(
                        Object.getPrototypeOf(target)
                    ))
            ].map(key => [key, target[key]])
        );

        const properties = this.classEntity.properties;

        this.dataMap = {};
        this.nativeMap = {};
        this.computedMap = {};
        this.propMap = {};

        Object.keys(propertyMap).forEach(
            key => {
                const targetProperty = properties.find(property => property.name === key);
                let isDataOrMethod = true;
                if (targetProperty) {
                    if (targetProperty.hasAnnotations(Extra)) {
                        isDataOrMethod = false;
                    }
                    if (targetProperty.hasAnnotations(NativeApi)) {
                        this.nativeMap[key] = propertyMap[key];
                    }
                    if (targetProperty.hasAnnotations(Computed)) {
                        this.computedMap[key] = propertyMap[key];
                    }
                    if (targetProperty.hasAnnotations(Props)) {
                        this.propMap[key] = propertyMap[key];
                    }
                }
                if (isDataOrMethod) {
                    this.dataMap[key] = propertyMap[key];
                }
            }
        )
    }

    parseDataOrMethods(result = {}) {
        const methods = {};
        const data = {};
        Object.entries(this.dataMap).forEach(
            ([key, value]) => {
                if (typeof value === 'function') {
                    methods[key] = value;
                } else {
                    data[key] = value;
                }
            }
        );
        Object.assign(result, {
            methods, data() {
                return data
            }
        })
    }

    parseComputedMap(result = {}) {

        const getterMap = {};

        if (this.target) {
            const getterProperties = getGetterProperties(this.target);
            getterProperties.forEach(property => {
                getterMap[property.name] = property.descriptor.get;
            })
        }

        result.computed = {...result.computed, ...this.computedMap, ...getterMap};
    }

    parseNativeApi(result = {}) {
        const _this = this;
        const nativeMap = {...this.nativeMap};
        if ('data' in nativeMap) {
            const existData = result.data;
            nativeMap.data = function () {
                return {
                    ..._this.nativeMap.data,
                    ...(typeof existData === 'function' ? existData() : {})
                };
            }
        }
        Object.assign(result, nativeMap);
    }

    parsePropMap(result = {}) {
        result.props = {...result.props, ...this.propMap};
    }

    onReturn() {
        const result = {};
        result.name = this.componentName;
        this.parseDataOrMethods(result);
        this.parseComputedMap(result);
        this.parsePropMap(result);
        this.parseNativeApi(result);
        return result;
    }

}

export const VueComponent = AnnotationGenerator.generate(VueComponentDescribe);
