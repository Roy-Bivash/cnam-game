import LoaderCSS from "./Loader.module.css";

export function Loader(){
    return(
        <div className="fixed h-screen w-full flex items-center justify-center bg-slate-500/10">
            <span className={LoaderCSS.loader}></span>
        </div>
    )
}