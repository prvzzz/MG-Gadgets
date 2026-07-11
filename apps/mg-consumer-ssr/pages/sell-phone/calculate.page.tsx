import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUrl } from "../../features/breadcrumb/navSlice";
import { Spinner, TabItem, Tabs } from "flowbite-react";
import { FaBluetooth, FaMobile, FaPhone, FaTv } from "react-icons/fa";
import { GLOBAL_CONSTANTS } from "../../global.constants";
import { CartItem, Question } from "../../misc/types";
import QuestionWithOptions from "../../misc/QuestionWithOptions";
import Utils from "../../utils";
import images from "../../images";
import "../../renderer/main.css";
import DataRepository from "../../services/dataRepository";
import { Product } from "../../dto/Product";
import { setAlert } from "../../features/alert/alertSlice";
import { RootState } from "../../store";
import { addItem, show } from "../../features/cart/cartSlice";

export { Page }

function Page() {

    const dispatch = useDispatch();

    const authState = useSelector((state: RootState) => state.auth);

    const [product, setProduct] = useState<Product | undefined>();
    const [params, setParams] = useState(new URLSearchParams());
    const [questionSet1, setQuestionSet1] = useState<Question[]>(new Array<Question>());
    const [questionSet2, setQuestionSet2] = useState<Question[]>(new Array<Question>());
    const [questionSet3, setQuestionSet3] = useState<Question[]>(new Array<Question>());
    const [helperImage, setHelperImage] = useState(-1);
    const [result, setResult] = useState({
        processing: false,
        result: false
    })
    const [step, setStep] = useState(1);
    const STEPS = 5;

    const questionBank1: Array<Question> = [
        {
            id: 1,
            heading: "Choose a Variant",
            description: "Please choose a variant",
            options: [],
            selected: 0
        },
        {
            id: 2,
            heading: "Are you able to make and receive calls?",
            description: "Check your device for cellular network connectivity issues.",
            options: [
                <p>Yes</p>,
                <p>No</p>
            ],
            selected: 0,
            qb: 1
        },
        {
            id: 3,
            heading: "Is your device touch screen working properly?",
            description: "Check the touch screen functionality of your phone.",
            options: [
                <p>Yes</p>,
                <p>No</p>
            ],
            selected: 0,
            qb: 1
        }
        ,
        {
            id: 4,
            heading: "Is your phone's screen original?",
            description: "Pick \"Yes\" if screen was never changed or was changed by Authorized Service Center. Pick \"No\" if screen was changed at local shop.",
            options: [
                <p>Yes</p>,
                <p>No</p>
            ],
            selected: 0,
            qb: 1
        },
        {
            id: 5,
            heading: "Do you have original box with the same IMEI number?",
            description: "Pick \"Yes\" if you have the original box.",
            options: [
                <p>Yes</p>,
                <p>No</p>
            ],
            selected: 0,
            qb: 1
        },
        {
            id: 6,
            heading: "Do you have the GST bill of the device?",
            description: "Pick \"Yes\" if you have a copy of the bill.",
            options: [
                <p>Yes</p>,
                <p>No</p>
            ],
            selected: 0,
            qb: 1
        },
        {
            id: 7,
            heading: "Is your device under manufacturer's warranty?",
            description: "You will get a better value if your device is under warranty",
            options: [
                <p>Yes</p>,
                <p>No</p>
            ],
            selected: 0,
            qb: 1
        }

    ];
    const questionBank2: Array<Question> = [
        {
            id: 1,
            heading: "Screen Condition",
            description: "Any visible defect on the screen of your mobile.",
            options: [
                <p>Screen/Glass Break</p>,
                <p>Display Line</p>,
                <p>Device Damaged</p>
            ],
            multiple: false,
            selected: [],
            qb: 2
        },
        {
            id: 2,
            heading: "Body Condition",
            description: "Check physical condition of device body from front to back and sides",
            options: [
                <p>Back Panel Cracked</p>,
                <p>Body Dented</p>,
                <p>Phone Bend</p>
            ],
            multiple: false,
            selected: [],
            qb: 2
        },
        {
            id: 3,
            heading: "Discoloration on Screen",
            description: "Check your device's screen for discoloration",
            options: [
                <p>Major Discoloration</p>,
                <p>Minor Discoloration</p>,
                <p>No Discoloration</p>
            ],
            multiple: false,
            selected: [],
            qb: 2
        }
    ]
    const questionBank3: Array<Question> = [
        {
            id: 1,
            heading: "Camera",
            description: "Is your mobile camera working? Check both front and rear cameras",
            options: [
                <p>Front camera not working</p>,
                <p>Rear camera not working</p>,
                <p>Camera lens has scratches or is broken</p>
            ],
            multiple: true,
            selected: [],
            qb: 3
        },
        {
            id: 2,
            heading: "Sound",
            description: "Speakers & Volume control",
            options: [
                <p>Volume button not working</p>,
                <p>Speaker is faulty</p>,
                <p>Silent button not working</p>,
                <p>Audio Receiver not working</p>

            ],
            multiple: true,
            selected: [],
            qb: 3
        },
        {
            id: 3,
            heading: "Biometric",
            description: "Check your device's fingerprint sensor/Face ID",
            options: [
                <p>Fingerprint sensor not working</p>,
                <p>Face Sensor not working</p>
            ],
            multiple: true,
            selected: [],
            qb: 3
        },
        {
            id: 4,
            heading: "Connectivity",
            description: "Check your device's wireless connectivity",
            options: [
                <p>WiFi not working</p>,
                <p>Bluetooth not working</p>,
                <p>SIM Card Tray unable to recognize SIM</p>
            ],
            multiple: true,
            selected: [],
            qb: 3
        },
        {
            id: 5,
            heading: "Battery & Charging",
            description: "What's the battery health of your device?",
            options: [
                <p>{"> 85%"}</p>,
                <p>80 - 85%</p>,
                <p>{"< 80%"}</p>,
                <p>{"< 70%"}</p>
            ],
            multiple: false,
            selected: [],
            qb: 3
        }
    ]

    const dataRepo = new DataRepository();

    const alert = (message: string) => {
        dispatch(setAlert({ message: message, show: true }));
    }

    const populate = async () => {
        var alias = window.location.pathname.split("/").at(-1) || "";
        dataRepo.getProductByAlias(alias).then(data => setProduct(data.data)).catch(err => console.log(err));
    }

    const stepToQueries = new Map<number, string>([
        [1, "_deviceBasics"],
        [2, "_deviceScreenCondition"],
        [3, "_deviceFunctionality"]
    ])



    const headings: Map<number, string> = new Map([
        [1, "Let's know about your device"],
        [2, "A bit about your device's screen"],
        [3, "Device Functionality"],
        [4, "Estimated Value of your Device"]
    ])

    // useEffect(() => {
    //     var qb1 = getFromLocal(1) || questionBank1;

    //     if (questionBank1) {
    //         var variant_options = product?.variants.map(v => <p>{v.ram_size}GB / {v.storage_size}GB</p>)

    //         console.log("Variants:", variant_options);
    //         if (!variant_options) return;
    //         qb1.unshift({
    //             heading: "Variant",
    //             description: "Select your phone's variant",
    //             selected: 0,
    //             id: 1,
    //             options: variant_options,
    //             qb: 1
    //         })

    //         if (qb1) {

    //             qb1.unshift({
    //                 heading: "Variant",
    //                 description: "Select your phone's variant",
    //                 selected: 0,
    //                 id: 1,
    //                 options: variant_options,
    //                 qb: 1
    //             })

    //         }

    //         if (!product?.latest) {
    //             qb1.pop();
    //             // questionBank1.pop();
    //         }
    //         setQuestionSet1(qb1);
    //     }

    // }, [product])

    useEffect(() => {

        dispatch(setUrl({ url: window.location.href }));
        populate();

        const queries = new URLSearchParams(window.location.search);

        var qb1 = getFromLocal(1);
        var qb2 = getFromLocal(2);
        var qb3 = getFromLocal(3);

        if (qb1) {
            // console.log(qb1);
            console.log("qb", qb1);
            questionBank1.map((q_b, ind) => {
                if (qb1[ind]) {
                    q_b.selected = qb1[ind].selected;
                }
            });

            setQuestionSet1(questionBank1);
        } else {
            setQuestionSet1(questionBank1);
        }

        if (qb2) {
            // console.log(qb1);
            questionBank2.map((q_b, ind) => q_b.selected = qb2[ind].selected);
            setQuestionSet2(questionBank2);
        } else {
            if (questionBank2) { setQuestionSet2(questionBank2); }
        }

        if (qb3) {
            // console.log(qb1);
            questionBank3.map((q_b, ind) => q_b.selected = qb3[ind].selected);
            setQuestionSet3(questionBank3);
        } else {
            if (questionBank3) { setQuestionSet3(questionBank3); }
        }

        var step = queries.get("step");

        // navigate to step
        switch (step) {
            case "_deviceScreenCondition":
                if (isSetValid(1)) {
                    setStep(2);
                }
                break;
            case "_deviceFunctionality":
                if (isSetValid(2)) {
                    setStep(3);
                }
                break;
            default:
            // setStep(1);
        }


    }, [])

    const isSetValid = (set_num: number) => {
        // ignoring validations for step 1 and 2
        if (set_num == 1) {

            var temp: Question[] | undefined = [];

            if (!product?.latest) {
                temp = questionSet1?.slice(0, -2);
            } else {
                temp = questionSet1;
            }
            var res = temp?.find(q => q.selected == 0) == undefined;

            console.log("result:", res);
            if (res) {
                saveToLocal(questionSet1, 1);
            } else {
                alert("Please mark all the fields");
            }
            return true;
        }

        if (set_num == 2) {
            var res = questionSet2?.find(q => (q.selected instanceof Array ? (q.selected.length == 0) : (q.selected == 0))) == undefined;
            console.log("result:", res);
            if (res) {
                saveToLocal(questionSet2, 2);
            } else {
                alert("Please mark all the fields");
            }
            return true;
        }

        if (set_num == 3) {
            // var res = questionSet3?.find(q => (q.selected instanceof Array ? (q.selected.length == 0) : (q.selected == 0))) == undefined;
            // console.log("result:", res);
            // if (res) {
            saveToLocal(questionSet3, 3);
            // }
            return true;
        }


        return false;
    }

    useEffect(() => {

        console.log("Step changed:", step);
    }, [step])

    const saveToLocal = (obj: Question[] | undefined, qb: number) => {
        if (!obj) return;
        var temp = Utils.valueMap(obj);
        localStorage.setItem(qb.toString(), JSON.stringify(temp));

    }


    const getFromLocal = (qb: number) => {
        var toReturn = localStorage.getItem(qb.toString());
        return toReturn ? (JSON.parse(toReturn)) : null;
    }

    const nextStep = () => {
        if (step == STEPS) return;
        const queries = new URLSearchParams(window.location.search);
        if (isSetValid(step)) {
            console.log("Step:", step);
            setStep(step + 1);
            queries.set("step", stepToQueries.get(step + 1) || "");
            setParams(queries);
            document.body.scrollIntoView();
        }


    }

    const prevStep = () => {
        if (step == 1) return;
        const queries = new URLSearchParams(params);
        queries.set("step", stepToQueries.get(step - 1) || "");
        setStep(step - 1);
        setParams(queries);
        document.body.scrollIntoView();
    }
    useEffect(() => {
        console.log("Changing Question set 1:", questionSet1);
    }, [questionSet1])

    const selectValue = (id: number, option_number: number, qb: number) => {
        console.log(id, option_number);
        if (qb == 2) {
            if (!questionSet2) return;
            if (!questionSet2[id - 1].multiple) {
                setQuestionSet2(prev => {
                    return prev?.map(q => {
                        if (q.id == id) {
                            q.selected = [option_number];
                        }
                        return q;
                    })
                })
            } else {
                setQuestionSet2(prev => {
                    if (!prev) return;
                    var questions: Question[] = Utils.copyQuestions(prev);
                    console.log(questions);

                    return (questions.map(q => {
                        if (q.id == id) {
                            if (!(q.selected instanceof Array)) return;
                            if (!q?.selected.includes(option_number)) {
                                q.selected.push(option_number);
                            } else {
                                q.selected = q.selected.filter(o => o != option_number);
                            }
                        }
                        return q;
                    }) as Question[])
                })
            }
        }
        if (qb == 3) {
            if (!questionSet3) return;
            if (!questionSet3[id - 1].multiple) {
                setQuestionSet3(prev => {
                    return prev?.map(q => {
                        if (q.id == id) {
                            q.selected = [option_number];
                        }
                        return q;
                    })
                })
            } else {
                setQuestionSet3(prev => {
                    if (!prev) return;
                    var questions: Question[] = Utils.copyQuestions(prev);
                    console.log(questions);

                    return (questions.map(q => {
                        if (q.id == id) {
                            if (!(q.selected instanceof Array)) return;
                            if (!q?.selected.includes(option_number)) {
                                // add selected value
                                q.selected.push(option_number);
                            } else {
                                // remove selected value
                                q.selected = q.selected.filter(o => o != option_number);
                            }
                        }
                        return q;
                    }) as Question[])
                })
            }
        }
        if (qb == 1) {
            console.log("option number:", option_number);
            console.log("id:", id);

            if (!questionSet1) return;
            if (!questionSet1[id - 1].multiple) {

                var questions: Question[] = Utils.copyQuestions(questionSet1);

                questions = questions?.map(q => {
                    if (q.id == id) {

                        if (q.selected !== option_number) {
                            console.log("setting option:", option_number);
                            q.selected = option_number;
                        } else {
                            console.log("setting to 0");
                            q.selected = 0;
                        }
                    }
                    return q;
                })

                setQuestionSet1(questions);

            } else {
                setQuestionSet1(prev => {
                    if (!prev) return;
                    var questions: Question[] = Utils.copyQuestions(prev);


                    return (questions.map(q => {
                        if (q.id == id) {
                            if (!(q.selected instanceof Array)) return;
                            if (!q?.selected.includes(option_number)) {
                                q.selected.push(option_number);
                            } else {
                                q.selected = q.selected.filter(o => o != option_number);
                            }
                        }
                        return q;
                    }) as Question[])
                })
            }
        }

    }

    const sendForEvaluation = async () => {

        setResult({ ...result, processing: true });
        var dto = Utils.reduceToDTO(product?.alias || "", questionSet1, questionSet2, questionSet3);
        var valueCalculated = await dataRepo.getCalculatedValue(dto, authState.token);
        valueCalculated = await valueCalculated?.json();
        console.log("value calculalted:", valueCalculated);
        console.log("DTO:", dto);
        if (valueCalculated?.status == "ATTEMPTED_REQUEST_FAILED") {
            alert("An error occurred");
            setResult({ ...result, result: false, processing: false });
            return;
        }
        if (valueCalculated && (((valueCalculated as unknown as any).data?.result as unknown as number) > 0)) {
            setResult({ ...result, processing: false, result: valueCalculated.data.result })
            nextStep();
            setHelperImage(-1)
        } else {
            alert("An error occurred");
            setResult({ ...result, processing: false })
        }
        return;

    }

    const submitOrder = async () => {

        const dto = Utils.reduceToDTO(product?.alias || "", questionSet1, questionSet2, questionSet3);
        dispatch(addItem({
            item: {
                product: product,
                quantity: 1,
                unit_amount: (result.result as unknown as number),

                // incrementing variant by 1 to sync with the variants at the backend
                // at backend, variants start with 1 instead of 0

                selected_variant: dto.variant,
                type: "sell",
                item_condition: dto,
                total_amount: (result.result as unknown as number)
            } as CartItem,
        }))

        dispatch(show({ show: true }))

    }

    return (<>
        {!product && <center>
            <div className="m-auto">
                <Spinner color="gray" />
            </div>

        </center>
        }
        {product && <div className="p-10 pt-9 pb-48 grid grid-cols-5 w-fill max-sm:grid-cols-1 max-sm:p-5">
            <div id="stickyImage" style={{ padding: "0px" }} className="grid md:col-span-2 w-fill">
                {/* <span className="text-center" style={{color:"#17B169", position:"absolute", right:"50px" , fontWeight: "bolder", fontSize: "1.8rem", fontFamily: "sans-serif" }}>
                            <span className="fa fa-inr"></span> {(product?.max_retail_price - product?.discount).toLocaleString("en")}
                        </span> */}
                <div className="w-fill">
                    <h1 className="text-3xl max-sm:text-2xl font-semibold">
                        {product?.brand.name} {product?.title}
                    </h1><br />
                    <div className="w-fill flex flex-row justify-center">
                        {step == 1 && helperImage == -1 && <img className="productImage" src={GLOBAL_CONSTANTS.s3Base + product?.product_images.at(0) + ".png"} />}
                        {step == 2 && helperImage == -1 && <img className="helperImage" src={images.screen_step} />}
                        {step == 3 && helperImage == -1 && <img className="helperImage" src={images.screen_touch} />}
                        {step == 4 && helperImage == -1 && <img className="helperImage" src={images.value_calculated_banner} />}

                        {/* Helper image = q.id + q.qb */}

                        {helperImage == 1 && <img className="helperImage" src={images.screen_scratches} />}
                        {helperImage == 2 && <img className="helperImage" src={images.screen_broken} />}
                        {helperImage == 3 && <img className="helperImage" src={images.screen_spots} />}
                        {helperImage == 4 && <img className="helperImage" src={images.screen_touch} />}
                        {helperImage == 5 && <img className="helperImage" src={images.screen_spots} />}
                    </div>
                    <br />


                </div>

            </div>
            <div className="md:col-span-3 max-sm:w-fill pt-0">
                <div className="flex flex-row justify-end w-fill max-sm:hidden">
                    {step < STEPS - 2 && <button onClick={() => nextStep()} className="btn primary text-black">
                        Next
                    </button>}
                </div>
                <p className="text-center text-lg font-semibold">
                    {headings.get(step)}
                </p>
                <Tabs className="w-fit" aria-label="Value Estimation Calculator" >

                    {/* Device Overview */}

                    {step == 1 && <TabItem className="w-fill p-4 text-black" title="Choose a Variant" icon={FaMobile}>
                        <div style={{ overflowY: "scroll", paddingTop: "20px", paddingBottom: "20px" }}>
                            {

                                questionSet1 && questionSet1.map(question => {

                                    if ((question.id == 7) && !product.latest) return;

                                    return <QuestionWithOptions
                                        id={question.id}
                                        heading={question.heading}
                                        description={question.description}
                                        options={question.id != 1 ? question.options : product?.variants.map(v => <p>{v.ram_size}GB / {v.storage_size}GB</p>)}
                                        selected={question.selected}
                                        clickHandler={selectValue}
                                        multiple={question.multiple}
                                        qb={1}
                                    />
                                })
                            }
                        </div>
                    </TabItem>}

                    {/* Screen Condition */}

                    {step == 2 && <TabItem title="Dashboard" icon={FaPhone}>
                        <div style={{ overflowY: "scroll", paddingTop: "20px", paddingBottom: "20px" }}>
                            {
                                questionSet2 && questionSet2.map(question => {
                                    return <QuestionWithOptions
                                        id={question.id}
                                        heading={question.heading}
                                        description={question.description}
                                        options={question.options}
                                        selected={question.selected}
                                        clickHandler={selectValue}
                                        multiple={question.multiple}
                                        exitHover={() => setHelperImage(-1)}
                                        hoverHandler={() => setHelperImage(question.id || 0)}
                                        qb={2}
                                    />
                                })
                            }
                        </div>
                    </TabItem>}

                    {/* Device Functionality   */}

                    {step == 3 && <TabItem title="Settings" icon={FaTv}>
                        <div style={{ overflowY: "scroll", paddingTop: "20px", paddingBottom: "20px" }}>
                            {
                                questionSet3 && questionSet3.map(question => {

                                    if (question.id == 5 && (product.brand.name != "Apple")) return;

                                    return <QuestionWithOptions
                                        id={question.id}
                                        heading={question.heading}
                                        description={question.description}
                                        options={question.options}
                                        selected={question.selected}
                                        clickHandler={selectValue}
                                        multiple={question.multiple}
                                        exitHover={() => setHelperImage(-1)}
                                        hoverHandler={() => setHelperImage((question?.id || 0) + 3)}
                                        qb={3}
                                    />
                                })
                            }
                        </div>
                    </TabItem>}
                    {step == 4 && <TabItem title="Results" icon={FaTv}>
                        <div style={{ overflowY: "scroll", paddingTop: "20px", paddingBottom: "20px" }}>
                            <h2 className="text-3xl max-sm:text-3xl text-center text-green-500 font-bold">
                                <span className="fa fa-inr"></span> {(result.result as number).toLocaleString("en-in")}
                            </h2><br /><br/>
                            <h3 className="text-2xl font-semibold">How is it calculated?</h3>
                            <p>
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis est magnam animi suscipit nobis. Doloremque voluptatem repudiandae minus vel vero laudantium debitis modi!
                            </p>
                        </div>
                    </TabItem>}
                    <TabItem disabled title="Contacts" icon={FaBluetooth}>

                    </TabItem>

                </Tabs>
                <div className="flex flex-row justify-start w-fill max-sm:justify-center">
                    {step > 1 && (step < STEPS - 1) && <button onClick={() => prevStep()} className="btn primary text-black max-sm:w-full">
                        Back
                    </button>}
                    {(step < STEPS - 2) && <button onClick={() => nextStep()} className="btn primary text-black ml-2 max-sm:w-full">
                        Next
                    </button>}

                    {(step == STEPS - 2) && (!result.processing) && <button onClick={() => sendForEvaluation()} className="btn primary text-black ml-2 max-sm:w-full">
                        Calculate
                    </button>}

                    {(step == STEPS - 2) && (result.processing) && <button onClick={() => { }} className="btn primary text-black ml-2 max-sm:w-full">
                        Calculating..
                    </button>}
                    {(step == STEPS - 1) && <button onClick={() => submitOrder()} className="btn primary text-black ml-2 max-sm:w-full">
                        Continue
                    </button>}
                    {(step == STEPS - 1) && <button onClick={() => setStep(1)} className="btn primary text-black ml-2 max-sm:w-full">
                        New Estimate
                    </button>}
                </div>
            </div>
        </div>}
    </>)


}