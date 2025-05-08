import { FC,ReactNode} from "react";

const Container:FC<{children:ReactNode}>=({children})=>{
    return (
        <div className="w-full flex justify-center items-center p-3">
            {children}
        </div>
    )
}

export default Container
