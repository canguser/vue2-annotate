import {AnnotationGenerator} from "@palerock/annotate-js";
import {ExtraDescribe} from "./Extra";

export class NativeApiDescribe extends ExtraDescribe {

    nativeMap = {};

    configProperty(target, fieldName, fieldValue, configurationMap) {
        super.configProperty(target, fieldName, fieldValue, configurationMap);
        this.nativeMap[fieldName] = fieldValue;
        this.parseNativeApi(configurationMap);
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

}

export const NativeApi = AnnotationGenerator.generate(NativeApiDescribe);