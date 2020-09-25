import {VueComponent} from "../src";
import {Watch} from "../src/annotates/Watch";

@VueComponent
class A {

    @Watch
    $$gender(val, oldVal) {
    }

    @Watch({deep: true, immediate: true})
    $$age(val, oldVal) {
    }

    @Watch('name')
    handlerName = 'handleAgeChanged';

    @Watch({property: 'name', deep: true})
    handleNameChanged2(val, oldVal) {
    }

}

`({
    name: 'A',
    watch: {
        age: {
            handler(val, oldVal) {
            },
            deep: true, immediate: true
        },
        gender(val, oldVal) {
        },
        name: [
            'handleAgeChanged',
            {
                handler(val, oldVal) {
                }
            }
        ]
    }
});`;


Object.entries(A.watch).forEach(
    ([name, value]) => {
        console.log(name);
        console.log(value);
    }
);