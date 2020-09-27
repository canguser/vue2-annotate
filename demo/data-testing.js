import {VueComponent} from "../src";

@VueComponent
class A {
    project = {
        name: 'vue2-annotate',
        author: {
            name: 'changshi'
        }
    }
}

const b = A.data();
console.log(b);
b.project.author.name = 'cangshi01';
console.log(A.data());