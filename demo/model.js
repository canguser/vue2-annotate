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
    model:{
        prop: 'value',
        event: 'change'
    }
});

console.log(A);