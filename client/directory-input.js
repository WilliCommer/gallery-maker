import * as vanB from 'vanjs-bootstrap';
import {selectDistFolderDialog} from './project-dialog.js';

const {van, Button, Input} = vanB;
const { div } = van.tags;

export default function DirectoryInput(props) {

    var dvalue = van.state(props.value);  // declare display value as van.state

    const btnclick = async () => {
        let res = await selectDistFolderDialog({ dir: dvalue.val});
        if (!res) return;
        dvalue.val = res;
        const event = {target: {name: props.name, value: dvalue.val}}
        props.oninput(event)
    }

    return div({
        style: van.val(props.style),
        class: () => {
            let res = 'input-group';
            if (van.val(props.bsSize)) res += ' input-group-' + van.val(props.bsSize);
            if (van.val(props.class)) res += ' ' + van.val(props.class);
            return res;
        }
    },
        Input({
            ...props,
            value: dvalue,
            readonly: true,
        }),
        Button({ outline: true, disabled: props.disabled, onclick: btnclick }, '📂')
    )
}
