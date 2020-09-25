import {AnnotationGenerator} from "@palerock/annotate-js";
import {ExtraDescribe} from "./Extra";

export class WatchDescribe extends ExtraDescribe {
    constructor() {
        super();
        Object.assign(this.params, {
            property: '',
            deep: false,
            immediate: false
        });
    }

    get defaultKey() {
        return 'property';
    }

    get watchProperty() {
        return this.params.property;
    }

    applyProperty(property) {
        super.applyProperty(property);
        const originName = this.params.property;
        this.params.property = originName || property.name.replace(/^\$\$/, '');
    }
}

export const Watch = AnnotationGenerator.generate(WatchDescribe);