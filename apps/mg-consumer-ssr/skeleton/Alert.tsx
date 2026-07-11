import { Toast, ToastToggle } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { GLOBAL_CONSTANTS } from "../global.constants";
import { setAlert } from "../features/alert/alertSlice";

export default function Alert() {

    const dispatch = useDispatch();
    const [showToast, setShowToast] = useState(false);
    const state = useSelector((state: RootState) => state.alert);

    useEffect(() => {
        setShowToast(state.show);
        if (state.show) {
            setTimeout(() => {
                setShowToast(false);
                dispatch(setAlert({ message: "", show: false }));
            }, GLOBAL_CONSTANTS.toastDismissalTime);

        }
    }, [state.show])

    return (<>
        {showToast && <Toast style={{ position: "fixed", bottom: "2.5%", right: "1.5%" }} className="alertToast bg-white shadow-gray-400">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ">
                <FaInfoCircle className="h-5 w-5" />
            </div>
            <div onClick={() => setShowToast(false)} className="ml-3 text-sm font-normal">
                {state.message}
            </div>
            <ToastToggle />
        </Toast>}
    </>)

}