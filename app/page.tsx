"use client";

import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import Link from "next/link";
import Image from "next/image";
import Feature from "@/components/Feature";
import {
  ArrowUpDown,
  CheckCircleIcon,
  Heart,
  ThumbsUp,
  Timer,
  Workflow,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { JoinGalleryFormSchema } from "@/lib/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormEvent } from "react";
import { Parallax } from "react-scroll-parallax";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import HeartCircle from "@/components/HeartCircle";
import SmileyFace from "@/components/SmileyFace";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DemoMobile from "@/components/DemoMobile";

export default function Home() {
  const { push } = useRouter();

  const joinGalleryForm = useForm<z.infer<typeof JoinGalleryFormSchema>>({
    resolver: zodResolver(JoinGalleryFormSchema),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!joinGalleryForm.formState.isValid) {
      push("/join");
    } else {
      push(`/join?code=${joinGalleryForm.getValues().code}`);
    }
  }

  return (
    <div
      className="flex flex-col h-full md:py-36 md:px-32 pt-11 pb-24 px-8
      w-full items-center text-center gap-12"
    >
      <div className="flex flex-col gap-6 items-center">
        <Typography className="max-w-2xl" variant="h1">
          Share photos seamlessly with freinds, family and events
        </Typography>

        <div className="flex flex-1">
          <Parallax speed={-10}>
            <HeartCircle className="relative -left-5 -top-10  rotate-12" />
          </Parallax>
          <Typography className="max-w-2xl" variant="h5">
            The best way to interact at events or simply share
            <br />
            <strong>lasting memories</strong> with your loved ones.
          </Typography>
        </div>
        <div className="flex gap-6 justify-center items-center">
          <Form {...joinGalleryForm}>
            <form className="flex flex-1 items-center" onSubmit={handleSubmit}>
              <FormField
                control={joinGalleryForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="relative table left w-full space-y-0 mb-0">
                    <div
                      className="relative left-1 px-3 text-sm font-normal leading-none bg-primary text-secondary-foreground text-center 
                      mt-4  border w-1 whitespace-nowrap table-cell rounded-l-md border-r-0"
                    >
                      #
                    </div>
                    <FormControl>
                      <Input
                        className="rounded-r-md border-l-0 mt-0 "
                        type="text"
                        placeholder="enter-code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="relative right-1"
                id="join-button"
                type="submit"
                variant="black"
              >
                Join Gallery
              </Button>
            </form>
          </Form>
          <Typography className="mr-2" variant="h5">
            or
          </Typography>
          <Button>Create gallery</Button>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row w-full">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
          <Parallax speed={-10}>
            <HeartCircle className="relative left-36 top-20 rotate-12" />
          </Parallax>
          <Parallax speed={-10}>
            <SmileyFace size={50} className="relative top-64 right-10" />
          </Parallax>
          <Parallax speed={5}>
            <Card className="w-40 shadow-md rounded-2xl p-2 bg-primary relative top-0 -rotate-6">
              <Typography variant="h5">The best way</Typography>
              <Image
                width={300}
                height={300}
                className="rounded-2xl"
                alt="Pandem.dev hero image"
                src="/assets/landing1.png"
              />
            </Card>
          </Parallax>
          <Parallax speed={10}>
            <Card className="w-40 shadow-md rounded-2xl p-2 bg-[#FF7BAC] relative left-24 -top-10 rotate-3">
              <Typography variant="h5">To share</Typography>
              <Image
                width={300}
                height={300}
                className="rounded-2xl "
                alt="Pandem.dev hero image"
                src="/assets/landing2.png"
              />
            </Card>
          </Parallax>
          <Parallax speed={15}>
            <Card className="w-40 shadow-md rounded-2xl p-4 bg-secondary  relative -top-16 -rotate-12">
              <Typography variant="h5">Photos & Videos</Typography>
              <Image
                width={300}
                height={300}
                className="rounded-2xl object-cover "
                alt="Pandem.dev hero image"
                src="/assets/landing3.png"
              />
            </Card>
          </Parallax>
        </div>
        <div className="w-full md:w-1/2  space-y-4 flex flex-col justify-center items-center md:text-left md:items-start">
          <Typography variant="h2">
            We value the memories you get to keep
          </Typography>
          <Typography variant="h5">
            We believe that what remains „after the party” are the moments you
            get to re-live in time.
          </Typography>
          <Typography variant="h5" className="text-left">
            We developed our product with that in mind.
          </Typography>
          <Parallax speed={-5}>
            <Button className="mt-10">Create gallery</Button>
          </Parallax>
        </div>
      </div>

      <Parallax speed={-1}>
        <div className="w-[97vw] bg-secondary">
          <div className="bg-[linear-gradient(to_right,#80808040_1px,transparent_1px),linear-gradient(to_bottom,#80808040_1px,transparent_1px)] bg-[size:32px_32px]">
            <div className="flex flex-col-reverse md:flex-row w-full">
              <div className="w-full md:w-1/2 py-20 space-y-4 flex flex-col justify-center items-center md:text-left md:items-start container">
                <Typography variant="h2">
                  It&apos;s about the way we collect and share our memories
                </Typography>
                <Accordion type="single" collapsible className="w-full">
                  <Card className="bg-primary mb-4 px-4">
                    <AccordionItem className="border-0" value="item-1">
                      <AccordionTrigger>
                        <Typography variant="h3">Create albums</Typography>
                      </AccordionTrigger>
                      <AccordionContent>
                        Easily create albums for your photos or shared albums to
                        share with your friends. Protect them with password and
                        keep your memories safe.
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                  <Card className="bg-primary  mb-4  px-4">
                    <AccordionItem className="border-0" value="item-2">
                      <AccordionTrigger>
                        <Typography variant="h3">Share with friends</Typography>
                      </AccordionTrigger>
                      <AccordionContent>
                        Share your albums with your friends and family. They can
                        view the photos and videos you share with them.
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                  <Card className="bg-primary  mb-4  px-4">
                    <AccordionItem className="border-0" value="item-3">
                      <AccordionTrigger>
                        <Typography variant="h3">Keep your memories</Typography>
                      </AccordionTrigger>
                      <AccordionContent>
                        Keep your memories safe and secure. You can always come
                        back and view them. You can also download them.
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                </Accordion>
              </div>
              <div className=" md:w-1/2 flex flex-col justify-center items-end">
                <DemoMobile />
              </div>
            </div>
          </div>
        </div>
      </Parallax>
      <div className="flex flex-col-reverse md:flex-row w-full space-y-4 md:space-x-10">
        <Card className="w-full md:w-1/2 flex flex-col t ">
          <CardContent className="text-left py-4">
            <Heart size={50} />
            <Typography variant="h2">Intuitive and easy</Typography>
            <Typography variant="h5">
              People are a QR scan away from joining your album. You can then
              collect the photos and keep them forever. Do this with your family
              and friends as well.
            </Typography>
          </CardContent>
        </Card>
        <Card className="w-full md:w-1/2 flex flex-col justify-center items-center">
          <CardContent className="text-left py-4">
            <CheckCircleIcon size={50} />
            <Typography variant="h2">3+ use cases</Typography>
            <Typography variant="h5">
              Use it to collect photos from guests at your event, seamlessly
              share photos with friends and family and protect all your long
              lasting memories.
            </Typography>
          </CardContent>
        </Card>
        <Card className="w-full md:w-1/2 flex flex-col justify-center items-center">
          <CardContent className="text-left py-4">
            <ThumbsUp size={50} />
            <Typography variant="h2">Try for free</Typography>
            <Typography variant="h5">
              Start with our one-month free plan and see how you like it. You
              can then upgrade your storage and functionality starting at just
              $3 / month.
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
