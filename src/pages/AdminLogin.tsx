import DarkModeToggle from "@/components/DarkModeToggle";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type LoginFormInputs = {
  username: string;
  password: string;
};

const AdminLogin = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    console.log("Login form data:", data);
    navigate("/admin/dashboard");
  };

  return (
    <div className="central-container">
      <div className="border min-w-[50%] max-xl:min-w-[70%] max-md:min-w-[70%] mx-5 p-12 flex gap-10 bg-app-foreground rounded-2xl justify-center">
        <div className="max-md:hidden flex-1">Illustration</div>
        <div className="flex flex-col gap-12 flex-1">
          <div className="flex justify-between items-start gap-2 sm:gap-6 max-sm:flex-col">
            <div>
              <h1 className="text-2xl font-bold">Welcome to Sahaara!</h1>
              <p className="text-app-secondary-text">Enter your credentials</p>
            </div>
            <div className="mt-2">
              <DarkModeToggle />
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-14"
          >
            <div className="flex flex-col gap-4">
              <FormField
                label="Username"
                id="username"
                registration={register("username", {
                  required: "Username is required",
                })}
                error={errors.username}
                placeholder="Enter your username"
              />
              <FormField
                label="Password"
                id="password"
                registration={register("password", {
                  required: "Password is required",
                })}
                error={errors.password}
                placeholder="Enter your password"
              />
            </div>
            <div>
              <Button className="w-full">Login</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
