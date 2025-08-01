import DarkModeToggle from "@/components/DarkModeToggle";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Loader, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type LoginFormInputs = {
  username: string;
  password: string;
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/admin/login", data);
      const { admin_details, access_token } = response.data;
      login(admin_details, access_token);
      toast.success("Login Successful");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="central-container">
      <div className="border min-w-[50%] max-xl:min-w-[70%] max-md:min-w-[70%] mx-5 p-12 flex gap-10 bg-app-foreground rounded-2xl justify-center">
        <div className="max-md:hidden flex-1">Illustration</div>
        <div className="flex flex-col gap-12 flex-1">
          <div className="flex justify-between items-start gap-2 sm:gap-6 max-sm:flex-col">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome to{" "}
                <span className="text-app-primary-color dark:text-app-secondary-color">
                  Sahaara
                </span>
              </h1>
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
                type="password"
                error={errors.password}
                placeholder="Enter your password"
              />
            </div>
            <div>
              <Button
                className="w-full bg-app-primary-color dark:bg-app-primary-color text-white border-0 dark:border hover:bg-app-primary-hover-color hover:text-white"
                disabled={loading}
              >
                <span>
                  <Loader2
                    className={`animate-spin ${!loading ? "hidden" : "block"}`}
                  />
                </span>
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
