import { getLoggedInUser } from "@/appwrite/config";
import { RegisterForm } from "@/components/register-form";
import { redirect } from "next/navigation";

 export default async function page(){
    const user = await getLoggedInUser()
    if (user) {
        console.log(user);
        redirect("/")
    }
    return(
        <div className="h-screen w-screen flex justify-center items-center flex-col bg-neutral-800">
            <RegisterForm/>
        </div>
    )
}