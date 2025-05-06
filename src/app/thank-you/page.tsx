import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank You | Website Project Intake Form",
  description: "Your project information has been successfully submitted",
};

export default function ThankYouPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Card className="border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold">Thank You!</CardTitle>
          <CardDescription className="text-lg mt-2">
            Your project information has been successfully submitted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">What happens next?</h3>
            <ol className="text-left space-y-4 list-decimal list-inside">
              <li>Our team will review your project details</li>
              <li>
                We'll prepare some initial thoughts and questions about your
                project
              </li>
              <li>You'll receive a confirmation email shortly</li>
              <li>
                We'll contact you within 1-2 business days to discuss next steps
              </li>
            </ol>
          </div>

          <div>
            <p className="text-muted-foreground">
              If you have any questions in the meantime, please don't hesitate
              to reach out.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button size="lg">Return to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
