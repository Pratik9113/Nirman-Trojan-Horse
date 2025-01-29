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
} from "./ui/form";
import { Input } from "./ui/input";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters long"),
  typeOfManufacturer: z.enum([
    "Clothing",
    "Furniture",
    "Electronics",
    "Food",
    "Toys",
    "Cosmetics",
    "Sports Equipment",
  ]),
});

function ManufacturerSignup() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      phone: "",
      address: "",
      typeOfManufacturer: "Furniture",
    },
  });

  const handleSignup = async (data) => {
    const url = "http://localhost:3000/manufacturer/signup";
    try {
      const response = await axios.post(url, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      alert("Manufacturer registered successfully!");
      navigate("/manufacturer/login");
    } catch (error) {
      console.error("Error during signup:", error.response);
      alert(
        error.response?.data?.message || "An error occurred during signup."
      );
    }
  };

  return (
    <>
      <div id="rootg" className="w-[30rem] rounded-lg bg-gray-100 flex flex-col">
        <Navbar />
        <div className="container mx-auto p-4 flex flex-col items-center justify-center">
          <div
            className="border border-gray-200 rounded-lg p-6 bg-white max-w-md w-full"
          >
            <h3 className="text-center text-xl font-bold text-gray-800">
              Manufacturer Signup
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSignup)}
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
                          className="focus:ring-1 focus:ring-[#fe9e0d] border-gray-300"
                        />
                      </FormControl>
                      <FormDescription>Enter your email address.</FormDescription>
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
                          type="tel"
                          placeholder="Phone Number"
                          className="focus:ring-2 focus:ring-[#fe9e0d] border-gray-300"
                        />
                      </FormControl>
                      <FormDescription>Enter your phone number.</FormDescription>
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
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Address"
                          className="focus:ring-2 focus:ring-[#fe9e0d] border-gray-300"
                        />
                      </FormControl>
                      <FormDescription>
                        Provide your manufacturing address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="typeOfManufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Type of Manufacturer</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="border ml-2 border-gray-300 p-2 rounded focus:ring-1 focus:ring-[#fe9e0d]"
                        >
                          <option value="Furniture">Furniture</option>
                          <option value="Clothing">Clothing</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Food">Food</option>
                          <option value="Toys">Toys</option>
                          <option value="Cosmetics">Cosmetics</option>
                          <option value="Sports Equipment">Sports Equipment</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Select your manufacturing category.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#fe9e0d] text-black hover:bg-orange-500 focus:ring-2 focus:ring-offset-2 focus:ring-[#fe9e0d]"
                >
                  Register
                </Button>
              </form>
            </Form>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <span
                  className="text-[#fe9e0d] cursor-pointer hover:underline"
                  onClick={() => navigate("/manufacturer/login")}
                >
                  Login!
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManufacturerSignup;
