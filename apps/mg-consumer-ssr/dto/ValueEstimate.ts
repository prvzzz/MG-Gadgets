export interface ValueEstimate {

    alias: string,
    variant: number,
    deviceInfo: {
        make_calls: boolean,
        working_touch: boolean,
        original_screen: boolean,
        original_box: boolean,
        warranty_coverage?: boolean,
        warranty_months?: number,
        gst_bill: boolean
    },
    deviceScreenBody: {
        screen_condition: Array<1 | 2 | 3> | false,
        body_condition: Array<1 | 2 | 3> | false,
        discoloration: Array<1 | 2> | false,
    },
    deviceFunctionality: {
        camera: Array<1 | 2 | 3>,
        sound: Array<1 | 2 | 3 | 4>,
        biometric: Array<1 | 2>,
        connectivity: Array<1 | 2 | 3>,
        battery_charging?: Array<1 | 2 | 3 | 4>
    }

}