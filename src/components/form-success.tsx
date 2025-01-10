interface FormSuccessProps{
    message?:string;
}
export function FormSuccess({message}:FormSuccessProps) {
    if(!message)return null;
    return(
        <p className="text-green-500">{message} !!</p>
    )
}