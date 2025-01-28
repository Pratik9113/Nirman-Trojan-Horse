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
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits long"),
});

function ManufacturerLogin() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      phone: "",
    },
  });

  const handleLogin = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/manufacturer/login",
        data,
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during login:", error.response);
      alert(error.response?.data?.message || "An error occurred during login.");
    }
  };

  return (
    <>
      <div id="rootg" className="w-[28rem] rounded-lg bg-gray-100 flex flex-col">
        <Navbar />
        <div className="container mx-auto p-4 flex flex-col items-center justify-center">
          <div className="border rounded-lg border-gray-200 rounded-lg p-6 bg-white max-w-md w-full">
            <h3 className="text-center text-xl font-bold text-gray-800">
              Manufacturer Login
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Email"
                          className="focus:ring-2 focus:ring-[#fe9e0d] border-gray-300"
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
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Password"
                          className="focus:ring-2 focus:ring-[#fe9e0d] border-gray-300"
                        />
                      </FormControl>
                      <FormDescription>Enter your password.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Phone Number"
                          className="focus:ring-2 focus:ring-[#fe9e0d] border-gray-300"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your 10-digit phone number.
                      </FormDescription>
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
              </form>
            </Form>
            <p className="text-center text-sm mt-4 text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/manufacturer/signup")}
                className="text-[#fe9e0d] cursor-pointer hover:underline"
              >
                Signup
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManufacturerLogin;
