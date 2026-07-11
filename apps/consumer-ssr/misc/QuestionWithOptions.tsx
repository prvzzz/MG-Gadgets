
import { Question } from "./types";

interface QWOptions extends Question {
    clickHandler: Function,
    hoverHandler?: Function,
    exitHover?: Function,
    spread?: boolean
}

export default function QuestionWithOptions(question: QWOptions) {



    return (<>
        {(window.innerWidth > 1000) && <div onMouseLeave={() => question?.exitHover && question?.exitHover()} onMouseEnter={() => question?.hoverHandler && question?.hoverHandler()} className={"question" + (question.multiple ? " multi" : "")}>
            <div className="info">
                <h4 className="font-bold text-sm">
                    {question.id && question.id + "."} {question.heading}
                </h4>
                <p className="text-sm">
                    {question.description}
                </p>
            </div>
            <div className={"optionsGroup" + (question.spread ? " spread" : "")} >
                {question.options?.map((option, index) => {
                    return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} onClick={() => {
                        question.clickHandler(question.id, index + 1, question.qb)
                    }} className={"gap-0.5 option" +
                        ((question.selected == (index + 1)
                            || (
                                question.selected instanceof Array &&
                                question.selected.includes(index + 1)
                            )
                        )
                            ? " selected" : "")}>

                        {option}
                    </div>
                })}
            </div>

        </div>}
        {(window.innerWidth < 800) && <div className={"question mt-2.5" + (question.multiple ? " multi" : "")}>
            <div className="info">
                <h4 className="font-bold text-sm">
                    {question.id && question.id + "."} {question.heading}
                </h4>
                <p className="text-sm">
                    {question.description}
                </p>
            </div>
            <div className={"mt-2.5 optionsGroup" + (question.spread ? " spread" : "")} >
                {question.options?.map((option, index) => {
                    return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} onClick={() => {
                        question.clickHandler(question.id, index + 1, question.qb)
                    }} className={"gap-0.5 option" +
                        ((question.selected == (index + 1)
                            || (
                                question.selected instanceof Array &&
                                question.selected.includes(index + 1)
                            )
                        )
                            ? " selected" : "")}>

                        {option}
                    </div>
                })}
            </div>

        </div>}
    </>)

}