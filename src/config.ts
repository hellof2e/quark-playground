export interface MenuItem {
    name: string
    childrens: {name: string; link: string}[]
}
export const menus: MenuItem [] = [{
    name: 'BASICS',
    childrens: [
        {
            name: 'Hello World',
            link: '/#/hello-world'
        },
        {
            name: 'Full component', // 生命周期
            link: '/#/full-component'
        }
    ]
},{
    name: 'REACTIVE PROPERTIES',
    childrens: [
        {
            name: 'State',
            link: '/#/state'
        },
        {
            name: 'Props',
            link: '/#/props'
        },
        {
            name: 'Skill guid',
            link: '/#/skill-guid'
        }
    ]
},{
    name: 'TEMPLATE CONCEPTS',
    childrens: [
        {
            name: 'Expression types',
            link: '/#/expression-types'
        },
        {
            name: 'Conditional templates',
            link: '/#/conditional-templates'
        },
        {
            name: 'Repeating templates',
            link: '/#/repeating-templates'
        },
        {
            name: 'Slotting children',
            link: '/#/slotting-children'
        },
        {
            name: 'Css in js',
            link: '/#/css-in-js'
        },
        {
            name: 'Fragement',
            link: '/#/fragement'
        }
    ]
},{
    name: 'Events',
    childrens: [
        {
            name: 'Native event',
            link: '/#/native-event'
        },
        {
            name: 'Custom event',
            link: '/#/custom-event'
        }
    ]
},{
    name: 'DIRECTIVES',
    childrens: [
        {
            name: 'ref directive',
            link: '/#/ref-directive'
        }
    ]
},]