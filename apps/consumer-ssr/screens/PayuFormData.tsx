import { useEffect, useState } from "react";
import { PayUFormData } from "./types";
import { GLOBAL_CONSTANTS } from "../global.constants";
import { useDispatch } from "react-redux";
import { setAlert } from "../features/alert/alertSlice";

export default function PayuFormData(formData: PayUFormData) {

    const dispatch = useDispatch();
    const [submit, setSubmit] = useState(false);


    const getAmount = () => {
        if (formData.amount > 0 && (formData.amount <= GLOBAL_CONSTANTS.maxPaymentAmount)) {
            return formData.amount.toString();
        } else {
            dispatch(setAlert({ message: "An error occurred", show: true }))
            window.history.back();
            setSubmit(false);

        }
    }

    useEffect(() => {

        if (!formData.ready) return;

        (document.querySelector("[data-details-form='paynow']") as unknown as any).submit();

    }, [formData.ready])

    return (<>

        <form data-details-form="paynow" action={GLOBAL_CONSTANTS.payUTestEndpoint} method="post">
            <input type="hidden" name="key" value={GLOBAL_CONSTANTS.payUKey} />
            <input type="hidden" name="txnid" value={formData.txnId} />
            <input type="hidden" name="productinfo" value={formData.orderType} />
            <input type="hidden" name="amount" value={getAmount()} />
            <input type="hidden" name="email" value={formData.email} />
            <input type="hidden" name="firstname" value={formData.firstName} />
            <input type="hidden" name="lastname" value={formData.lastName} />
            <input type="hidden" name="surl" value={formData.successUrl} />
            <input type="hidden" name="furl" value={formData.failedUrl} />
            <input type="hidden" name="phone" value={formData.phone} />
            <input type="hidden" name="hash" value={formData.hash} />
            {/* <input type="submit" value="Submit" /> */}
        </form>

    </>)


}