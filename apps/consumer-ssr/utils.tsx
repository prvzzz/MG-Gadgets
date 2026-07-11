import { ValueEstimate  } from "./dto/ValueEstimate";
import { Question, ValueMap } from "./misc/types";
import pkg from "lodash";
const {clone} = pkg;


const Utils = {

    copyQuestions: (o: Question[]) => {
        var copied: Question[] = new Array();
        for (let i = 0; i < o.length; i++) {
            var q = o[i];
            var question: Question = {
                heading: clone(q.heading),
                description: clone(q.description),
                id: clone(q.id),
                options: clone(q.options),
                selected: clone(q.selected),
                multiple: clone(q.multiple)
            }
            copied.push(question);
        }

        return copied;
    },

    valueMap: (o: Question[]) => {
        var valueMap: Array<ValueMap> = new Array();

        for (var i = 0; i < o.length; i++) {
            var q = o[i];
            valueMap.push({
                id: q.id,
                qb: q.qb,
                selected: q.selected
            })
        }

        return valueMap;
    },

    /**
     * 
     * @param qb1: Question bank 1
     * @param qb2: Question bank 2
     * @param qb3: Question bank 3
     */

    reduceToDTO: (alias: string, qb1: Question[], qb2: Question[], qb3: Question[]): ValueEstimate => {

        // this corresponds to the variant id of the product in db
        var variant = qb1[0].selected;
        var valueEstimate = {} as ValueEstimate;

        console.log("qb1:", qb1);
        console.log("qb2:", qb2);
        console.log("qb3:", qb3, qb3[0].selected);

        valueEstimate["variant"] = (variant as number);
        valueEstimate["alias"] = alias;
        valueEstimate["deviceInfo"] = {
            make_calls: (qb1[1].selected == 1),
            working_touch: (qb1[2].selected == 1),
            original_screen: (qb1[3].selected == 1),
            original_box: (qb1[4].selected == 1),
            gst_bill: (qb1[5].selected == 1),
            warranty_coverage: (qb1[6]) && (qb1[6].selected == 0)
        };
        valueEstimate["deviceScreenBody"] = {
            screen_condition: (qb2[0].selected as Array<number>).length > 0 ? (qb2[0].selected as Array<1 | 2 | 3>) : false,
            body_condition: (qb2[1].selected as Array<number>).length > 0 ? (qb2[1].selected as Array<1 | 2 | 3>) : false,
            discoloration: (qb2[2].selected as Array<number>).length > 0 ? (qb2[2].selected as Array<1 | 2>) : false,
        };
        valueEstimate["deviceFunctionality"] = {
            camera: (qb3[0].selected as Array<number>).length > 0 ? (qb3[0].selected as Array<1 | 2 | 3 | 4 | 5>) : [],
            sound: (qb3[1].selected as Array<number>).length > 0 ? (qb3[1].selected as Array<1 | 2 | 3 | 4 | 5>) : [],
            biometric: (qb3[2].selected as Array<number>).length > 0 ? (qb3[2].selected as Array<1 | 2 | 3 | 4 | 5>) : [],
            connectivity: (qb3[3].selected as Array<number>).length > 0 ? (qb3[3].selected as Array<1 | 2 | 3 |4 | 5>) : [],
            battery_charging: qb3[4] && ((qb3[4].selected as Array<number>).length > 0 ? (qb3[4].selected as Array<1 | 2 | 3 | 4 | 5>) : []),
        }

        return valueEstimate;
    }

}

export default Utils;