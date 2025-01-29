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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Signup() {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files) {
      setSelectedImages(Array.from(files));
    }
  };

  const handleSignup = async (data) => {
    if (!selectedImages.length) {
      alert("Please upload a profile picture.");
      return;
    }

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("image", selectedImages[0]);

    const url = "http://localhost:3000/user/signup";
    try {
      const response = await axios.post(url, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      alert("Signup successful!");
      navigate("/");
    } catch (error) {
      console.error("Error during signup:", error.response);
      alert(
        error.response?.data?.message || "An error occurred during signup."
      );
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
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
              <h3 className="text-xl font-bold text-center mb-4">
                User Register from Here
              </h3>

              <form
                onSubmit={form.handleSubmit(handleSignup)}
                className="space-y-6 w-full max-w-md"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Username" />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Email" />
                      </FormControl>
                      <FormDescription>
                        Enter your email address.
                      </FormDescription>
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
                          {...field}
                          type="password"
                          placeholder="Password"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a strong password.
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

                <p className="text-center mt-4">
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/")}
                    className="text-[#fe9e0d] cursor-pointer hover:underline"
                  >
                    Login
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

export default Signup;
