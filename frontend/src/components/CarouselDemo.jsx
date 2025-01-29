import * as React from "react";

import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export function   CarouselDemo({ imgg }) {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {imgg.map((imgUrl, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img
                    src={imgUrl}
                    alt={`Carousel item ${index + 1}`}
                    className="object-cover h-full w-full rounded"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
