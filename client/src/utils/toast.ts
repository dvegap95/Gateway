import { toast as _toast, ToastOptions } from 'react-toastify';

let defaultOptions:ToastOptions = {
    type:'success',
    position: "bottom-right",
    autoClose:2000,
    progress:"none",
}


export default function toast(str:string,options:ToastOptions | undefined = {}){
    return _toast(str,{...defaultOptions,...options});
}

export function errorToast(str:string,options:ToastOptions | undefined = {}){
    return _toast(str,{...defaultOptions,autoClose:3000,...options,type:"error"});
}
