import {VueComponent} from "../src";
import {Model} from "../src/annotates/Model";

@VueComponent
class A {

    @Model
    value = String;

}

({
    name: 'A',
    props: {
        value: String
    },
    model: {
        prop: 'value',
        event: 'change'
    }
});

@VueComponent
class B {

    @Model('value') // name 属性为 value, 被装饰属性名为 content
    content = String;

}

({
    name: 'B',
    props: {
        value: String
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    computed: {
        content: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('change', value);
            }
        }
    }
});

console.log(A);
console.log(B);