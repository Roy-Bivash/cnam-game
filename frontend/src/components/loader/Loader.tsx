import LoaderCSS from "./Loader.module.css";

export function Loader(){
    return(
        <div className="fixed h-screen w-max flex items-center justify-center">
            <span className={LoaderCSS.loader}></span>
        </div>
    )
}