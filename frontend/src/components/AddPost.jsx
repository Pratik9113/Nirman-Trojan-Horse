import * as React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import Calendarr from "./Calenderr";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddPost() {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedImages, setSelectedImages] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + selectedImages.length > 3) {
      setErrorMessage("You can select a maximum of 3 images.");
      return;
    }

    setErrorMessage("");
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  // Remove selected image
  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      // selectedDate,
      // selectedImages,
    };
    const response = await axios.post(
      "http://localhost:3000/dashboard/addpost",
      formData,
      {
        withCredentials: true,
      }
    );
    console.log("response:", response);
    navigate("/dashboard/reads");
    console.log("Form Data:", formData); // Log form data
  };

  return (
    <Card className="w-[350px] ml-[20rem] mt-10">
      <CardHeader>
        <CardTitle>Create Post</CardTitle>
        <CardDescription>Add your new Post in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form enctype="multipart/form-data" onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                placeholder="Title of your Post"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Label htmlFor="description">Describe</Label>
              <Textarea
                id="description"
                placeholder="Description of your Post"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="choose-img">
                <Label htmlFor="images">Choose Images (Max 3)</Label>
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="file-input"
                />
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <div className="image-previews">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`preview-${index}`}
                        className="image-preview-img"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="remove-button"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Calendarr onSelect={setSelectedDate} />
            </div>
          </div>
          <br />
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Add Post</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
