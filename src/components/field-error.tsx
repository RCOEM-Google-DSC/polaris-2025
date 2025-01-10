interface FieldErrorProps{
    message?:string | undefined;
}
export function FieldError({message}:FieldErrorProps) {
    if(!message)return null;
    return(
        <p className="text-red-500">{message}</p>
    )
}