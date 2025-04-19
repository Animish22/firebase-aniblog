import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import * as React from "react";
import { ArrowRightIcon, ReaderIcon, LightningBoltIcon, ChatBubbleIcon } from "@radix-ui/react-icons"; // Updated icons
import { Link } from "react-router-dom";
import { auth } from "@/firebase/config/firebase";

// Define your blog features and testimonials data
const features = [
  {
    title: "Discover Engaging Stories",
    description: "Explore a wide range of blog topics and find stories that captivate your interest.",
    icon: <ReaderIcon className="mr-2 h-4 w-4" />,
  },
  {
    title: "Stay Informed and Inspired",
    description: "Get the latest insights, trends, and inspiration from thought leaders and passionate writers.",
    icon: <LightningBoltIcon className="mr-2 h-4 w-4" />,
  },
  {
    title: "Join the Conversation",
    description: "Share your thoughts and connect with a community of readers through comments and discussions.",
    icon: <ChatBubbleIcon className="mr-2 h-4 w-4" />,
  },
  // Add more features as needed
];

const testimonials = [
  {
    quote: "This blog platform has become my go-to source for insightful articles. The design is clean, and the content is top-notch!",
    author: "Alice Johnson, Reader",
  },
  {
    quote: "As a writer, I love the intuitive interface and the supportive community. It's a fantastic place to share my ideas.",
    author: "Bob Williams, Author",
  },
  // Add more testimonials as needed
];

const blogPreviews = [
  {
    title: "The Future of Web Development",
    excerpt: "Explore the emerging technologies and trends that will shape the web in the coming years.",
    link: "#",
  },
  {
    title: "10 Tips for Effective Content Writing",
    excerpt: "Learn how to craft compelling and engaging blog posts that resonate with your audience.",
    link: "#",
  },
  {
    title: "A Beginner's Guide to React Hooks",
    excerpt: "Understand the fundamentals of React Hooks and how they can simplify your component logic.",
    link: "#",
  },
  // Add more blog previews
];

const LandingPage: React.FC = () => {
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gray-100 dark:bg-gray-900" >
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Discover a World of Ideas on Our Blog Platform
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Read insightful articles, explore diverse topics, and connect with a community of passionate individuals.
                </p>
                <Link to={ auth?.currentUser ? '/blog' : '/signin'}>
                  <Button className="mt-8" size="lg">
                    Explore Blogs <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="order-1 md:order-2">
                {/* Replace with a compelling image or illustration */}
                <div className="relative rounded-lg overflow-hidden shadow-lg aspect-video">
                  <img
                    src="src\images\LandingPageImg.jpeg"
                    alt="Blog Concept"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Features Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold tracking-tight text-center mb-8">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">{feature.icon} {feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Testimonials Section (Optional) */}
        {testimonials.length > 0 && (
          <section className="py-12 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-semibold tracking-tight text-center mb-8">
                What Our Readers Say
              </h2>
              <Carousel className="w-full max-w-2xl mx-auto">
                <CarouselContent>
                  {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index}>
                      <Card className="border">
                        <CardContent className="p-6">
                          <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">
                            "{testimonial.quote}"
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">- {testimonial.author}</p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2" />
                <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              </Carousel>
            </div>
          </section>
        )}

        <Separator />

        {/* Blog Previews Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold tracking-tight text-center mb-8">
              Latest Blog Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPreviews.map((blog, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{blog.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{blog.excerpt}</CardDescription>
                    <Button variant="link" className="mt-4">
                      Read More <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Call to Action Section */}
        <section className="py-16 bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to Explore?
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Dive into our collection of insightful blog posts and discover new perspectives.
            </p>
            <Link to={ auth?.currentUser ?  '/blog' : '/signin'}>
              <Button className="mt-8" size="lg">
                View All Blogs <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center text-gray-500 dark:text-gray-400">
          <div className="container mx-auto px-4">
            <p>&copy; {new Date().getFullYear()} Your Blog Name. All rights reserved.</p>
            {/* Add social media links or other footer content here */}
          </div>
        </footer>
      </div>
    </ScrollArea>
  );
};

export default LandingPage;