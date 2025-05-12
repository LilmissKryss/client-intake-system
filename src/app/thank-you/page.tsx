import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

import CalendlyWidget from "@/components/CalendlyWidget";

export const metadata: Metadata = {
  title: "Thank You | Website Project Intake Form",
  description: "Your project information has been successfully submitted",
};

export default function ThankYouPage() {
  return (
    <div className="container max-w-4xl py-4 mx-auto h-screen flex flex-col justify-center">
      <Card className="border-none shadow-lg">
        <CardHeader className="text-center py-3">
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
          <CardDescription className="text-base mt-1">
            Your project information has been successfully submitted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center p-4">
          {/* What happens next container */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">What happens next?</h3>
            <ol className="text-left space-y-1 list-decimal list-inside text-sm">
              <li>Our team will review your project details</li>
              <li>We'll prepare initial thoughts about your project</li>
              <li>You'll receive a confirmation email shortly</li>
              <li>We'll contact you within 1-2 business days</li>
            </ol>

            <div className="mt-3">
              <p className="text-xs text-muted-foreground">
                If you have any questions, please don't hesitate to reach out.
              </p>
            </div>
          </div>

          {/* Calendly widget container */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">
              Schedule a Discovery Call
            </h3>
            <p className="text-sm mb-2">
              Ready to discuss your project? Book a free 30-minute call.
            </p>

            {/* Calendly Component */}
            <div className="mx-auto">
              <CalendlyWidget />
            </div>
          </div>

          <div className="mt-2">
            <Link href="/">
              <Button size="sm">Return to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
