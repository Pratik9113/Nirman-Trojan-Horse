import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { CarouselDemo } from "./CarouselDemo";

const Accordionn = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/dashboard/getpost",{ withCredentials: true });
        console.log("Fetched posts:", response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="w-[50rem] ml-[7rem]">
      <Accordion type="single" collapsible>
        {posts.map((post, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="p-5">{post.title}</AccordionTrigger>
            <AccordionContent className="p-7">
              <p>{post.description}</p>
              <center className="p-5 ml-8">
                <CarouselDemo imgg={post.photo} />
              </center>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Accordionn;
