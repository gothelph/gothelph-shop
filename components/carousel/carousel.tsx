"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Category = {
  name: string;
  image: string;
};

type Props = {
  categories: Category[];
  onSelect?: (category: string) => void;
};

export function CategoriesCarousel({ categories, onSelect }: Props) {
  return (
    <div className="w-full flex justify-center px-4 px-60">
      <div className="flex items-center h-screen w-full max-w-10xl">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 flex justify-center h-screen items-center">
            {categories.map((cat) => (
              <CarouselItem
                key={cat.name}
                className="pl-2 basis-1/3 min-w-[150px] px-3 "
              >
                <div
                  onClick={() => onSelect?.(cat.name)}
                  className="flex flex-col cursor-pointer rounded-xl overflow-hidden border hover:scale-[1.04] transition  h-[70vh]"
                >
                  <div className="relative w-full h-100 ">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="mt-auto p-10 text-center text-sm font-medium">
                    {cat.name}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
