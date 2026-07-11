import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { useEffect, useState } from "react";
import { setLoginModalState, setPhoneNumberAction, setToken, setUser } from "../features/auth/authSlice";
import images from "../images";
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from "@firebase/auth";
import { setAlert } from "../features/alert/alertSlice";
import AuthRepository from "../services/authRepository";
import { url } from "inspector";

export default function Login() {

    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.auth);
    const [phoneNumber, setPhoneNumber] = useState("+91 ");
    const [params, setParams] = useState(new URLSearchParams());
    const [otpSent, setOTPSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [registerForm, setRegisterForm] = useState(false);
    const [detailsForm, setDetailsForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        city: "New Delhi",
        phone_number: phoneNumber
    })

    useEffect(() => {
        console.log("details:", detailsForm);
    }, [detailsForm]);

    const auth = getAuth();
    const authState = useSelector((state: RootState) => state.auth);
    const authRepo = new AuthRepository();

    const dismiss = () => {
        dispatch(setLoginModalState({ showLoginPopup: false }));
    }

    const validatePhoneNumber = (num: string) => {
        console.log("auth", auth);
        return num.slice(3,).trimEnd().trimStart().match(/\d{10}/g)
    }

    const formatPhoneNumber = (num: string) => {
        console.log("formatted number:", num.slice(0, 3) + " " + num.slice(3, 8) + " " + num.slice(8,));
        return num.slice(0, 3) + " " + num.slice(3, 8) + " " + num.slice(8,);
    }

    const signIn = (e: any) => {
        e.preventDefault();
        setProcessing(true);
        console.log(phoneNumber);
        try {
            if (validatePhoneNumber(phoneNumber)) {
                (window as unknown as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});
                console.log(formatPhoneNumber(phoneNumber));
                signInWithPhoneNumber(auth, formatPhoneNumber(phoneNumber), (window as unknown as any).recaptchaVerifier).then(confirmation => {

                    setOTPSent(true);
                    // const inputs = document.getElementById("inputs")?.children;
                    // Array.prototype.slice.call(inputs).at(0).focus();

                    (window as unknown as any).confirmationResult = confirmation;
                    console.log("otp sent");

                }).catch(err => {
                    console.log(err);
                    dispatch(setAlert({ message: "An error occurred", show: true }));
                    setProcessing(false);
                })
            } else {
                dispatch(setAlert({ message: "Please enter a valid phone number", show: true }))
                setProcessing(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const evalOtp = () => {
        const inputs = document.getElementById("inputs");
        var children = inputs?.children;
        var val = "";
        Array.prototype.slice.call(children).forEach(digit => {
            val = val + digit.value;
        })

        setOtp(val);
    }

    const getContext = async (token: string) => {
        const result = await authRepo.getAuthContext(token);
        if (result.status) {
            if (result.status == "USER_NOT_FOUND") {
                setRegisterForm(true);
                return false;
            }
            if (result.status == "DATA_FETCHED") {
                var data = result.data;
                if (data.length) {
                    let user = data[0];
                    dispatch(setUser({
                        fullName: user.first_name,
                        email: user.email,
                        userType: "member"
                    }))
                }
                return true;
            }
        }

        return false;
    }

    const verify = (e: any) => {

        e.preventDefault();
        setVerifying(true)
        if (!otp) {
            dispatch(setAlert({ message: "Please enter the otp", show: true }));
        }

        setProcessing(false);

        (window as unknown as any).confirmationResult.confirm(otp).then(async (result: any) => {
            // User signed in successfully.

            if (!result) throw EvalError;

            const user = result.user;
            var context = await getContext(user.accessToken);
            console.log("Context::", context);

            if (!context) {
                // dispatch(setAlert({ message: "An error occurred" }));

            } else {
                dispatch(setLoginModalState({ showLoginModal: false }));
            }
            dispatch(setPhoneNumberAction({ phoneNumber: phoneNumber }));
            dispatch(setToken({ token: user.accessToken }));
            setProcessing(false);



        }).catch((error: any) => {
            setProcessing(false);
            dispatch(setAlert({ message: "OTP entered is invalid or expired.", show: true }))
            setOTPSent(false);
            setVerifying(false);
            console.log(error);
        });

    }

    const isDetailsFormValid = detailsForm.city != "" && detailsForm.email != "" && detailsForm.first_name != "";

    const confirmSignUp = (e: any) => {
        e.preventDefault();
        console.log(authState.token);
        var body = { ...detailsForm, phone_number: phoneNumber };
        console.log(body);
        if (!authState.token) {
            dispatch(setAlert("Not Authorized"));
            return;
        }
        authRepo.registerUser(body, authState.token).then(data => {
            if (data.message == "VALIDATION_FAILED") {
                dispatch(setAlert({ message: "Please fill in all the fields", show: true }))
            }
            if (data.status == "OPERATION_SUCCESSFUL") {

                dispatch(setAlert({ message: data.message, show: true }));
                dispatch(setLoginModalState({ showLoginPopup: false }));
                window.location.reload();

            }
        }).catch(err => {
            console.log(err);
            dispatch(setAlert({ message: "An error occurred", show: true }))
        })
    }

    useEffect(() => {

        const queries = new URLSearchParams(params);
        if (state.showLoginPopup) {
            queries.set("login", "true");
        } else {
            queries.delete("login");
        }
        setParams(queries);

        const inputs = document.getElementById("inputs");

        inputs?.addEventListener("input", function (e) {
            const target = (e.target as HTMLInputElement);
            const val: number = (target.value as unknown as number);

            if (isNaN(val)) {
                target.value = "";
                return;
            }

            if (val.toString() != "") {
                const next = (target.nextElementSibling as HTMLInputElement);
                if (next) {
                    next.focus();
                }
            }
        });

        inputs?.addEventListener("keyup", function (e) {
            const target = (e.target as HTMLInputElement);
            const key = e.key.toLowerCase();

            if (key == "backspace" || key == "delete") {
                if (target) {
                    target.value = "";
                    const prev = (target.previousElementSibling as HTMLInputElement);
                    if (prev) {
                        prev.focus();
                    }
                }

                return;
            }
        });

    }, [state.showLoginPopup, otpSent]);

    useEffect(() => {
        setParams(new URLSearchParams(window.location.search));
    }, [])

    return (<>

        {
            state.showLoginPopup && <div id="authentication-modal" tabIndex={-1} aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed  z-50 justify-center  md:inset-0 h-[calc(100%-1rem)] max-h-full flex" style={{ height: "100vh", width: "100vw" }}>
                <div className="relative p-6 w-fill w-3xl max-h-full max-sm:w-2xl">

                    <div id="loginForm" className="w-fill relative bg-white rounded-2xl overflow-clip shadow-sm dark:bg-black max-sm:pb-3.5">



                        <div className="grid grid-cols-2 max-sm:grid-cols-1 max-sm:grid-rows-5">
                            <div className="max-sm:row-span-2" style={{ backgroundRepeat: "no-repeat", backgroundImage: `url("${images.slide_1}")`, backgroundSize: "cover" }}>

                            </div>
                            <div className="max-sm:row-span-3">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {registerForm && "Sign up"}
                                        {!registerForm && "Sign in to our platform"}
                                    </h3>
                                    <button onClick={() => dismiss()} type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                {registerForm && <form id="signUpForm" onSubmit={(e) => { e.preventDefault(); return false; }} className="space-y-4 p-3.5" method="post" action="#">

                                    <div>
                                        {/* <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your phone number</label> */}
                                        <input disabled value={phoneNumber} type="text" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Phone number" required />
                                    </div>
                                    <div>
                                        {/* <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your e-mail</label> */}
                                        <input onChange={(e) => { setDetailsForm({ ...detailsForm, first_name: e.target.value }) }} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={"Name"} required />
                                    </div>
                                    <div>
                                        {/* <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your e-mail</label> */}
                                        <input onChange={(e) => { setDetailsForm({ ...detailsForm, email: e.target.value }) }} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={"E-mail address"} required />
                                    </div>

                                    <div>
                                        {/* <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select your region</label> */}
                                        <select onChange={(e) => { setDetailsForm({ ...detailsForm, city: e.target.value }) }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                                            <option selected value={"New Delhi"}>New Delhi</option>
                                            <option value={"Noida"}>Noida</option>
                                            <option value={"Gurgaon"}>Gurgaon</option>
                                            <option value={"Faridabad"}>Faridabad</option>
                                            <option value={"Ghaziabad"}>Ghaziabad</option>
                                        </select>
                                    </div>
                                    {!isDetailsFormValid && <button disabled className="btn primary text-white w-full">Continue</button>}
                                    {isDetailsFormValid && <button onClick={(e) => confirmSignUp(e)} className="btn primary text-white w-full">Continue</button>}



                                </form>}
                                {!registerForm && <form onSubmit={(e) => { e.preventDefault(); return false; }} className="space-y-4 p-3.5" method="post" action="#">
                                    <div>
                                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Please enter your phone number</label>
                                        <input onChange={(e) => (e.target.value.length < 15 && e.target.value.length >= 4) ? setPhoneNumber(e.target.value) : null} value={phoneNumber} type="text" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="+91" required />
                                    </div>
                                    {!validatePhoneNumber(phoneNumber) && <button disabled className="btn primary text-white w-full">Continue</button>}
                                    {validatePhoneNumber(phoneNumber) && <div>

                                        {!otpSent && <div style={{ margin: "2.5%" }} id="recaptcha-container"></div>}
                                        {!otpSent && !processing && <button onClick={(e) => signIn(e)} className="btn primary text-white w-full">Continue</button>}


                                        {otpSent && <div>
                                            <div id="inputs" className="inputs">
                                                <input onChange={() => { evalOtp() }} className="input" type="text"
                                                    inputMode="numeric" maxLength={1} />
                                                <input onChange={() => { evalOtp() }} className="input" type="text"
                                                    inputMode="numeric" maxLength={1} />
                                                <input onChange={() => { evalOtp() }} className="input" type="text"
                                                    inputMode="numeric" maxLength={1} />
                                                <input onChange={() => { evalOtp() }} className="input" type="text"
                                                    inputMode="numeric" maxLength={1} />
                                                <input onChange={() => { evalOtp() }} className="input" type="text"
                                                    inputMode="numeric" maxLength={1} />
                                                <input onChange={() => { evalOtp() }} className="input" type="text"
                                                    inputMode="numeric" maxLength={1} />
                                            </div>
                                            {otpSent && !processing && <button className="btn primary text-white w-full">Verifying...</button>}
                                            {!verifying && <button onClick={(e) => verify(e)} className="btn primary text-white w-full">Continue</button>}
                                        </div>}


                                    </div>
                                    }


                                </form>}
                            </div>

                        </div>
                    </div>
                </div>
            </div>


        }

    </>)
}