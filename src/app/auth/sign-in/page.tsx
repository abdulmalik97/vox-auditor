import SignInPage from "@/features/app/auth/sign-in";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const SignIn = () => {
  const signInAction = async (formData: FormData) => {
    "use server";
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    console.log(error);

    if (error) {
      if (error.code === "invalid_credentials") {
        return "Invalid username or password.";
      } else {
        return "Error signing in. Please contact voxology support.";
      }
    }

    revalidatePath("/", "layout");
    redirect("/");
  };

  return <SignInPage signInAction={signInAction} />;
};

export default SignIn;
