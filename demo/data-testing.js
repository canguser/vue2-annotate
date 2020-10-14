import {VueComponent} from "../src";

@VueComponent
class A {
    project = {
        name: 'vue2-annotate',
        author: {
            name: 'changshi'
        },
        logs: [
            {a: 1},
            {b: 2},
            {c: 2},
        ]
    }
}

const b = A.data();
console.log(b);
b.project.author.name = 'cangshi01';
console.log(A.data());