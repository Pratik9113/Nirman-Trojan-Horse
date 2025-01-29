import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = {
      email,
      password,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/user/login",
        formData,
        {
          withCredentials: true,
        }
      );
      if (response.request.status === 200) {
        navigate("/dashboard/reads");
      }
      console.log(response.data);
    } catch (error) {
      console.error("Login failed", error);
      alert(
        error.response?.data?.message || "An error occurred during login."
      );
    }
  };

  return (
    <>
      <div
        id="rootg"
        className="w-[28rem] rounded-lg bg-gray-100 flex flex-col"
      >
        <Navbar />
        <div className="container mx-auto p-4 flex flex-col items-center justify-center">
          <div className="border rounded-lg border-gray-200 rounded-lg p-6 bg-white max-w-md w-full">
            <Form {...form}>
              <h3 className="text-xl font-bold text-center mb-4">Login Here</h3>

              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="space-y-6 w-full max-w-md"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          placeholder="Email"
                        />
                      </FormControl>
                      <FormDescription>Enter your email address.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                          type="password"
                          placeholder="Password"
                        />
                      </FormControl>
                      <FormDescription>Enter a strong password.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#fe9e0d] text-black hover:bg-orange-500 focus:ring-2 focus:ring-offset-2 focus:ring-[#fe9e0d]"
                >
                  Login
                </Button>

                <p className="text-center mt-4">
                  Don’t have an account? {" "}
                  <span
                    onClick={() => navigate("/user/signup")}
                    className="text-[#fe9e0d] cursor-pointer hover:underline"
                  >
                    Signup
                  </span>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
