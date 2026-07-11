import { stat } from "fs"

export default function StatusPill({ status, content }: { status: "success" | "error" | "info", content: string }) {

    const bg = {
        "success": "bg-green-200",
        "error": "bg-red-400",
        "info": "bg-blue-200"
    }

    const colors = {
        "success": "text-green-900",
        "error": "text-red-900",
        "info": "text-blue-700"
    }

    return (<>

        <h5 style={{fontWeight:"revert-layer", fontSize:"0.7rem", marginLeft:"0px"}} className={`m-auto ml-0 font-extrabold text-sm p-1.5 rounded-sm w-fit uppercase ${bg[status]} ${colors[status]} `}>{content}</h5>

    </>)
}

