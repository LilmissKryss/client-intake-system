"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  // Basic Information
  businessName: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters." }),
  website: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  industry: z.string().min(2, { message: "Please specify your industry." }),
  contactName: z
    .string()
    .min(2, { message: "Contact name must be at least 2 characters." }),
  contactEmail: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  contactPhone: z
    .string()
    .min(10, { message: "Please enter a valid phone number." }),
  preferredContact: z.enum(["email", "phone", "either"]),

  // Branding Information
  brandColors: z.string().optional(),
  brandStyle: z.enum([
    "modern",
    "traditional",
    "playful",
    "serious",
    "minimalist",
    "luxury",
    "other",
  ]),
  brandStyleOther: z.string().optional(),
  currentFonts: z.string().optional(),
  brandInspirations: z.string().optional(),
  hasLogo: z.enum(["yes", "no", "in-progress"]).optional(),
  logoUpload: z.any().optional(), // Accept any type for file inputs

  // Website Requirements
  websitePurpose: z.enum([
    "informational",
    "ecommerce",
    "portfolio",
    "blog",
    "service",
    "other",
  ]),
  purposeOther: z.string().optional(),
  targetAudience: z
    .string()
    .min(2, { message: "Please describe your target audience." }),
  keyFeatures: z.array(z.string()).optional(),
  customFeatures: z.string().optional(),
  desiredPages: z.string().optional(),
  expectedPages: z
    .string()
    .min(1, { message: "Please estimate the number of pages." }),
  contentReady: z.enum(["yes", "partially", "no"]),
  contentUpload: z.any().optional(), // Accept any type for file inputs
  desiredLaunchDate: z.string().optional(),
  seoRequirements: z.string().optional(),

  // Technical Details
  domainStatus: z.enum(["owned", "need-to-purchase", "unsure"]),
  existingDomain: z.string().optional(),
  preferredDomain: z.string().optional(),
  hostingPreference: z.enum(["recommend", "have-provider", "unsure"]),
  existingProvider: z.string().optional(),
  integrations: z.array(z.string()).optional(),
  customIntegrations: z.string().optional(),
  analyticsNeeds: z.array(z.string()).optional(),

  // Project Parameters
  budgetRange: z.enum([
    "under1000",
    "1000-3000",
    "3000-5000",
    "5000-10000",
    "over10000",
    "undecided",
  ]),
  timeline: z.enum(["urgent", "1-2months", "3-6months", "6plus", "flexible"]),
  maintenanceNeeds: z.enum([
    "none",
    "updates-only",
    "full-service",
    "undecided",
  ]),
  additionalInfo: z.string().optional(),

  // Marketing Consent
  newsletterConsent: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function ClientIntakeForm() {
  const router = useRouter(); // Initialize the router for programmatic navigation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");
  const [tabsWithErrors, setTabsWithErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      preferredContact: "email",
      brandStyle: "modern",
      websitePurpose: "informational",
      contentReady: "partially",
      domainStatus: "unsure",
      hostingPreference: "recommend",
      budgetRange: "undecided",
      timeline: "flexible",
      maintenanceNeeds: "undecided",
      keyFeatures: [],
      integrations: [],
      analyticsNeeds: [],
      newsletterConsent: false,
    },
  });

  const watchNewsletterConsent = watch("newsletterConsent");
  const watchDomainStatus = watch("domainStatus");
  const watchBrandStyle = watch("brandStyle");
  const watchWebsitePurpose = watch("websitePurpose");
  const watchHostingPreference = watch("hostingPreference");
  const watchHasLogo = watch("hasLogo");
  const watchContentReady = watch("contentReady");

  const { toast } = useToast();

  // Monitor changes to tabsWithErrors
  useEffect(() => {
    console.log("tabsWithErrors changed:", tabsWithErrors);
  }, [tabsWithErrors]);

  // We'll use inline debugging instead of a separate function

  // Map tab IDs to their full display names
  const tabDisplayNames: Record<string, string> = {
    basic: "Basic Information",
    branding: "Branding",
    website: "Website Needs",
    technical: "Technical Details",
    project: "Project Details",
    marketing: "Marketing Preferences",
  };

  // We use tabDisplayNames directly in the JSX

  // Function to check for missing required fields
  const checkMissingRequiredFields = () => {
    const requiredFields = [
      { name: "businessName", tab: "basic", label: "Business Name" },
      { name: "industry", tab: "basic", label: "Industry/Sector" },
      { name: "contactName", tab: "basic", label: "Contact Person's Name" },
      { name: "contactEmail", tab: "basic", label: "Email Address" },
      { name: "contactPhone", tab: "basic", label: "Phone Number" },
      {
        name: "preferredContact",
        tab: "basic",
        label: "Preferred Contact Method",
      },
      { name: "targetAudience", tab: "website", label: "Target Audience" },
      {
        name: "expectedPages",
        tab: "website",
        label: "Estimated Number of Pages",
      },
      { name: "domainStatus", tab: "technical", label: "Domain Status" },
      {
        name: "hostingPreference",
        tab: "technical",
        label: "Hosting Preference",
      },
      { name: "budgetRange", tab: "project", label: "Budget Range" },
      { name: "timeline", tab: "project", label: "Timeline" },
      { name: "maintenanceNeeds", tab: "project", label: "Maintenance Needs" },
    ];

    const formValues = watch();
    const missingFields = requiredFields.filter((field) => {
      const value = formValues[field.name as keyof FormValues];
      return !value || (typeof value === "string" && value.trim() === "");
    });

    // Group missing fields by tab
    const missingByTab = missingFields.reduce((acc, field) => {
      if (!acc[field.tab]) {
        acc[field.tab] = [];
      }
      acc[field.tab].push(field.label);
      return acc;
    }, {} as Record<string, string[]>);

    return { missingFields, missingByTab };
  };

  // Scroll functionality is now directly in the form submission handler

  // Simplified onSubmit function that skips the API call
  const onSubmit = async (data: FormValues) => {
    console.log("🔍 onSubmit function called with data:", data);
    setIsSubmitting(true);

    // Always show a toast to confirm the submission attempt
    toast({
      title: "Processing submission...",
      description: "Please wait while we process your form.",
      duration: 3000,
    });

    // TEMPORARY: Skip API call and just show success
    console.log("✅ Form validation passed! Skipping API call for debugging.");

    // Show success toast
    toast({
      title: "Form validated successfully!",
      description: "Form data is valid. API call skipped for debugging.",
      duration: 3000,
    });

    // Log that we would redirect
    console.log("Would redirect to thank-you page...");

    // TEMPORARY: Redirect after a delay without making API call
    setTimeout(() => {
      console.log("Executing redirect using Next.js router");
      router.push("/thank-you", { scroll: true });
    }, 2000);

    setIsSubmitting(false);
  };

  /* Original onSubmit function with API call (for reference)
  const onSubmitWithAPI = async (data: FormValues) => {
    try {
      console.log("Submitting form data to API...");

      // Submit the form data to the API and await the response
      console.log("Sending data to /api/submit:", JSON.stringify(data));
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Wait for the JSON response
      const result = await response.json();
      console.log("API response data:", result);

      // Ensure the API call is complete (which includes email sending)
      if (!result.success) {
        throw new Error("Form submission was not successful");
      }

      return true;
    } catch (error) {
      console.error("API submission error:", error);
      return false;
    }
  };
  */

  // We're now redirecting to a dedicated thank you page instead of showing an inline success message

  return (
    <div>
      {/* Error message when tabs have errors */}
      {tabsWithErrors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please complete all required fields
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  The following sections have incomplete required fields:
                  <span className="font-semibold">
                    {" "}
                    {tabsWithErrors
                      .map((tab) => tabDisplayNames[tab] || tab)
                      .join(", ")}
                  </span>
                  . Please complete all required fields in these sections.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form
        id="client-intake-form"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission
          console.log("🔔 Form submit event triggered", e);
          console.log("🔔 Form is valid:", Object.keys(errors).length === 0);
          console.log("🔔 Current tab:", currentTab);

          // Check for missing required fields before submitting
          const { missingByTab } = checkMissingRequiredFields();
          const errorTabs = Object.keys(missingByTab);

          // Update the tabs with errors state
          console.log(
            "Setting tabs with errors from submit handler:",
            errorTabs
          );
          setTabsWithErrors(errorTabs);

          if (errorTabs.length > 0) {
            // If there are errors, show the error message and navigate to the first tab with errors
            console.log("❌ Form has errors in tabs:", errorTabs);
            setCurrentTab(errorTabs[0]);

            // Create a more detailed error message
            const errorDetails = Object.entries(missingByTab)
              .map(
                ([tab, fields]) =>
                  `${tabDisplayNames[tab] || tab}: ${fields.join(", ")}`
              )
              .join("\n");

            toast({
              title: "Incomplete Form",
              description: `Please complete all required fields in the ${errorTabs
                .map((tab) => tabDisplayNames[tab] || tab)
                .join(", ")} section(s). Look for sections highlighted in red.`,
              variant: "destructive",
              duration: 5000,
            });

            console.log("Missing required fields:", errorDetails);

            // Scroll to the first error
            setTimeout(() => {
              const firstError = document.querySelector(".text-red-500");
              if (firstError) {
                firstError.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }, 100);

            return false;
          } else {
            // If there are no errors, process the form
            handleSubmit((data) => {
              console.log("🔔 handleSubmit callback executed with data:", data);
              onSubmit(data);
            })(e);
          }
        }}
      >
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger
              value="basic"
              className={
                tabsWithErrors.includes("basic")
                  ? "border-red-500 border-2 text-red-500 font-semibold"
                  : ""
              }
            >
              {tabsWithErrors.includes("basic") ? (
                <span className="flex items-center">
                  Basic Info
                  <span className="ml-1 text-red-500">!</span>
                </span>
              ) : (
                "Basic Info"
              )}
            </TabsTrigger>
            <TabsTrigger
              value="branding"
              className={
                tabsWithErrors.includes("branding")
                  ? "border-red-500 border-2 text-red-500 font-semibold"
                  : ""
              }
            >
              {tabsWithErrors.includes("branding") ? (
                <span className="flex items-center">
                  Branding
                  <span className="ml-1 text-red-500">!</span>
                </span>
              ) : (
                "Branding"
              )}
            </TabsTrigger>
            <TabsTrigger
              value="website"
              className={
                tabsWithErrors.includes("website")
                  ? "border-red-500 border-2 text-red-500 font-semibold"
                  : ""
              }
            >
              {tabsWithErrors.includes("website") ? (
                <span className="flex items-center">
                  Website Needs
                  <span className="ml-1 text-red-500">!</span>
                </span>
              ) : (
                "Website Needs"
              )}
            </TabsTrigger>
            <TabsTrigger
              value="technical"
              className={
                tabsWithErrors.includes("technical")
                  ? "border-red-500 border-2 text-red-500 font-semibold"
                  : ""
              }
            >
              {tabsWithErrors.includes("technical") ? (
                <span className="flex items-center">
                  Technical
                  <span className="ml-1 text-red-500">!</span>
                </span>
              ) : (
                "Technical"
              )}
            </TabsTrigger>
            <TabsTrigger
              value="project"
              className={
                tabsWithErrors.includes("project")
                  ? "border-red-500 border-2 text-red-500 font-semibold"
                  : ""
              }
            >
              {tabsWithErrors.includes("project") ? (
                <span className="flex items-center">
                  Project Details
                  <span className="ml-1 text-red-500">!</span>
                </span>
              ) : (
                "Project Details"
              )}
            </TabsTrigger>
            <TabsTrigger
              value="marketing"
              className={
                tabsWithErrors.includes("marketing")
                  ? "border-red-500 border-2 text-red-500 font-semibold"
                  : ""
              }
            >
              {tabsWithErrors.includes("marketing") ? (
                <span className="flex items-center">
                  Marketing
                  <span className="ml-1 text-red-500">!</span>
                </span>
              ) : (
                "Marketing"
              )}
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Let's start with some basic information about your business.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="flex items-center">
                    Business Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="businessName"
                    {...register("businessName")}
                    placeholder="Your Business Name"
                  />
                  {errors.businessName && (
                    <p className="text-sm text-red-500">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Current Website (if any)</Label>
                  <Input
                    id="website"
                    {...register("website")}
                    placeholder="https://example.com"
                  />
                  {errors.website && (
                    <p className="text-sm text-red-500">
                      {errors.website.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="flex items-center">
                    Industry/Sector <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="industry"
                    {...register("industry")}
                    placeholder="e.g., Restaurant, Healthcare, Retail"
                  />
                  {errors.industry && (
                    <p className="text-sm text-red-500">
                      {errors.industry.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName" className="flex items-center">
                      Contact Person's Name{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="contactName"
                      {...register("contactName")}
                      placeholder="Full Name"
                    />
                    {errors.contactName && (
                      <p className="text-sm text-red-500">
                        {errors.contactName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="flex items-center">
                      Email Address <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      {...register("contactEmail")}
                      placeholder="email@example.com"
                    />
                    {errors.contactEmail && (
                      <p className="text-sm text-red-500">
                        {errors.contactEmail.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="flex items-center">
                    Phone Number <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="contactPhone"
                    {...register("contactPhone")}
                    placeholder="(123) 456-7890"
                  />
                  {errors.contactPhone && (
                    <p className="text-sm text-red-500">
                      {errors.contactPhone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="preferredContact"
                    className="flex items-center"
                  >
                    Preferred Contact Method{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup
                    id="preferredContact"
                    name="preferredContact"
                    value={watch("preferredContact")}
                    onValueChange={(value) =>
                      setValue("preferredContact", value as any)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone">Phone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="either" id="either" />
                      <Label htmlFor="either">Either is fine</Label>
                    </div>
                  </RadioGroup>
                  {errors.preferredContact && (
                    <p className="text-sm text-red-500">
                      {errors.preferredContact.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="button" onClick={() => setCurrentTab("branding")}>
                  Next: Branding Information
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Branding Information Tab */}
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Branding Information</CardTitle>
                <CardDescription>
                  Tell us about your brand identity and style.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brandColors">
                    Brand Colors (if established)
                  </Label>
                  <Input
                    id="brandColors"
                    {...register("brandColors")}
                    placeholder="e.g., #FF5733, Blue and White, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandStyle" className="flex items-center">
                    Brand Style <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select
                    defaultValue="modern"
                    onValueChange={(value) =>
                      setValue("brandStyle", value as any)
                    }
                    name="brandStyle"
                  >
                    <SelectTrigger id="brandStyle">
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="playful">Playful</SelectItem>
                      <SelectItem value="serious">Serious/Corporate</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  {watchBrandStyle === "other" && (
                    <div className="mt-2">
                      <Label htmlFor="brandStyleOther" className="sr-only">
                        Other Brand Style
                      </Label>
                      <Input
                        id="brandStyleOther"
                        placeholder="Please specify your brand style"
                        {...register("brandStyleOther")}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentFonts">Current Fonts (if known)</Label>
                  <Input
                    id="currentFonts"
                    {...register("currentFonts")}
                    placeholder="e.g., Arial, Helvetica, custom font names"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandInspirations">Brand Inspirations</Label>
                  <Textarea
                    id="brandInspirations"
                    {...register("brandInspirations")}
                    placeholder="List websites or brands whose style you admire"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hasLogo" className="flex items-center">
                    Do you have an existing logo?{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup
                    id="hasLogo"
                    name="hasLogo"
                    value={watchHasLogo || "no"}
                    onValueChange={(value) => setValue("hasLogo", value as any)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="logo-yes" />
                      <Label htmlFor="logo-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="logo-no" />
                      <Label htmlFor="logo-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="in-progress"
                        id="logo-in-progress"
                      />
                      <Label htmlFor="logo-in-progress">
                        In progress/development
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {watchHasLogo === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="logoUpload">Upload Your Logo</Label>
                    <Input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      {...register("logoUpload")}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Please upload your logo in a high-quality format (PNG,
                      SVG, or AI preferred).
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentTab("basic")}
                >
                  Previous
                </Button>
                <Button type="button" onClick={() => setCurrentTab("website")}>
                  Next: Website Requirements
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Website Requirements Tab */}
          <TabsContent value="website">
            <Card>
              <CardHeader>
                <CardTitle>Website Requirements</CardTitle>
                <CardDescription>
                  Help us understand what you need in your website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="websitePurpose" className="flex items-center">
                    Website Purpose <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select
                    defaultValue="informational"
                    onValueChange={(value) =>
                      setValue("websitePurpose", value as any)
                    }
                    name="websitePurpose"
                  >
                    <SelectTrigger id="websitePurpose">
                      <SelectValue placeholder="Select a purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="informational">
                        Informational
                      </SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="portfolio">Portfolio</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="service">Service Booking</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  {watchWebsitePurpose === "other" && (
                    <div className="mt-2">
                      <Label htmlFor="purposeOther" className="sr-only">
                        Other Website Purpose
                      </Label>
                      <Input
                        id="purposeOther"
                        placeholder="Please specify your website purpose"
                        {...register("purposeOther")}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="flex items-center">
                    Target Audience <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Textarea
                    id="targetAudience"
                    {...register("targetAudience")}
                    placeholder="Describe who your website is targeting"
                    rows={2}
                  />
                  {errors.targetAudience && (
                    <p className="text-sm text-red-500">
                      {errors.targetAudience.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div id="keyFeatures" className="mb-2">
                    Key Features Needed
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="contact-form"
                        onCheckedChange={(checked) => {
                          const currentFeatures = watch("keyFeatures") || [];
                          if (checked) {
                            setValue("keyFeatures", [
                              ...currentFeatures,
                              "contact-form",
                            ]);
                          } else {
                            setValue(
                              "keyFeatures",
                              currentFeatures.filter(
                                (f) => f !== "contact-form"
                              )
                            );
                          }
                        }}
                      />
                      <Label htmlFor="contact-form">Contact Form</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="blog"
                        onCheckedChange={(checked) => {
                          const currentFeatures = watch("keyFeatures") || [];
                          if (checked) {
                            setValue("keyFeatures", [
                              ...currentFeatures,
                              "blog",
                            ]);
                          } else {
                            setValue(
                              "keyFeatures",
                              currentFeatures.filter((f) => f !== "blog")
                            );
                          }
                        }}
                      />
                      <Label htmlFor="blog">Blog</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="product-catalog"
                        onCheckedChange={(checked) => {
                          const currentFeatures = watch("keyFeatures") || [];
                          if (checked) {
                            setValue("keyFeatures", [
                              ...currentFeatures,
                              "product-catalog",
                            ]);
                          } else {
                            setValue(
                              "keyFeatures",
                              currentFeatures.filter(
                                (f) => f !== "product-catalog"
                              )
                            );
                          }
                        }}
                      />
                      <Label htmlFor="product-catalog">Product Catalog</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="photo-gallery"
                        onCheckedChange={(checked) => {
                          const currentFeatures = watch("keyFeatures") || [];
                          if (checked) {
                            setValue("keyFeatures", [
                              ...currentFeatures,
                              "photo-gallery",
                            ]);
                          } else {
                            setValue(
                              "keyFeatures",
                              currentFeatures.filter(
                                (f) => f !== "photo-gallery"
                              )
                            );
                          }
                        }}
                      />
                      <Label htmlFor="photo-gallery">Photo Gallery</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="testimonials"
                        onCheckedChange={(checked) => {
                          const currentFeatures = watch("keyFeatures") || [];
                          if (checked) {
                            setValue("keyFeatures", [
                              ...currentFeatures,
                              "testimonials",
                            ]);
                          } else {
                            setValue(
                              "keyFeatures",
                              currentFeatures.filter(
                                (f) => f !== "testimonials"
                              )
                            );
                          }
                        }}
                      />
                      <Label htmlFor="testimonials">Testimonials</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="booking-system"
                        onCheckedChange={(checked) => {
                          const currentFeatures = watch("keyFeatures") || [];
                          if (checked) {
                            setValue("keyFeatures", [
                              ...currentFeatures,
                              "booking-system",
                            ]);
                          } else {
                            setValue(
                              "keyFeatures",
                              currentFeatures.filter(
                                (f) => f !== "booking-system"
                              )
                            );
                          }
                        }}
                      />
                      <Label htmlFor="booking-system">Booking System</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customFeatures">Other Features</Label>
                  <Textarea
                    id="customFeatures"
                    {...register("customFeatures")}
                    placeholder="List any other features you need"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desiredPages">Desired Pages</Label>
                  <Textarea
                    id="desiredPages"
                    {...register("desiredPages")}
                    placeholder="List all the pages you want on your website (e.g., Home, About, Services, Contact, etc.)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedPages" className="flex items-center">
                    Estimated Number of Pages{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="expectedPages"
                    {...register("expectedPages")}
                    placeholder="e.g., 5, 10-15"
                  />
                  {errors.expectedPages && (
                    <p className="text-sm text-red-500">
                      {errors.expectedPages.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    This is a required field. Please provide an estimate of how
                    many pages you need.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desiredLaunchDate">Desired Launch Date</Label>
                  <Input
                    id="desiredLaunchDate"
                    type="date"
                    {...register("desiredLaunchDate")}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    When would you like your website to go live? This helps us
                    plan the project timeline.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentReady" className="flex items-center">
                    Is Your Content Ready?{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup
                    id="contentReady"
                    name="contentReady"
                    value={watchContentReady}
                    onValueChange={(value) =>
                      setValue("contentReady", value as any)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="content-yes" />
                      <Label htmlFor="content-yes">
                        Yes, all content is ready
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="partially"
                        id="content-partially"
                      />
                      <Label htmlFor="content-partially">Partially ready</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="content-no" />
                      <Label htmlFor="content-no">
                        No, need help with content
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {(watchContentReady === "yes" ||
                  watchContentReady === "partially") && (
                  <div className="space-y-2">
                    <Label htmlFor="contentUpload">Upload Your Content</Label>
                    <Input
                      id="contentUpload"
                      type="file"
                      multiple
                      {...register("contentUpload")}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload your content files (text documents, images, etc.).
                      You can select multiple files.
                      {watchContentReady === "partially" &&
                        " Upload what you have ready now."}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="seoRequirements">SEO Requirements</Label>
                  <Textarea
                    id="seoRequirements"
                    {...register("seoRequirements")}
                    placeholder="Describe any specific SEO requirements or goals"
                    rows={2}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentTab("branding")}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentTab("technical")}
                >
                  Next: Technical Details
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Technical Details Tab */}
          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
                <CardDescription>
                  Let's gather some technical information about your project.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domainStatus" className="flex items-center">
                    Domain Status <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup
                    id="domainStatus"
                    name="domainStatus"
                    value={watchDomainStatus || "unsure"}
                    onValueChange={(value) =>
                      setValue("domainStatus", value as any)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="owned" id="domain-owned" />
                      <Label htmlFor="domain-owned">
                        I already own a domain
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="need-to-purchase"
                        id="domain-purchase"
                      />
                      <Label htmlFor="domain-purchase">
                        Need to purchase a domain
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unsure" id="domain-unsure" />
                      <Label htmlFor="domain-unsure">Not sure</Label>
                    </div>
                  </RadioGroup>
                </div>

                {watchDomainStatus === "owned" && (
                  <div className="space-y-2">
                    <Label htmlFor="existingDomain">Your Domain Name</Label>
                    <Input
                      id="existingDomain"
                      {...register("existingDomain")}
                      placeholder="e.g., yourbusiness.com"
                    />
                  </div>
                )}

                {watchDomainStatus === "need-to-purchase" && (
                  <div className="space-y-2">
                    <Label htmlFor="preferredDomain">
                      Preferred Domain Name
                    </Label>
                    <Input
                      id="preferredDomain"
                      {...register("preferredDomain")}
                      placeholder="e.g., yourbusiness.com (without www)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your preferred domain name. We'll check availability
                      during our consultation.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="hostingPreference"
                    className="flex items-center"
                  >
                    Hosting Preference{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup
                    id="hostingPreference"
                    name="hostingPreference"
                    value={watchHostingPreference || "recommend"}
                    onValueChange={(value) =>
                      setValue("hostingPreference", value as any)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="recommend"
                        id="hosting-recommend"
                      />
                      <Label htmlFor="hosting-recommend">
                        Please recommend hosting
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="have-provider" id="hosting-have" />
                      <Label htmlFor="hosting-have">
                        I have a hosting provider
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unsure" id="hosting-unsure" />
                      <Label htmlFor="hosting-unsure">Not sure</Label>
                    </div>
                  </RadioGroup>
                </div>

                {watchHostingPreference === "have-provider" && (
                  <div className="space-y-2">
                    <Label htmlFor="existingProvider">
                      Your Hosting Provider
                    </Label>
                    <Input
                      id="existingProvider"
                      {...register("existingProvider")}
                      placeholder="e.g., GoDaddy, Bluehost, etc."
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div id="integrations" className="mb-2">
                    Integration Requirements
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="crm"
                        onCheckedChange={(checked) => {
                          const currentIntegrations =
                            watch("integrations") || [];
                          if (checked) {
                            setValue("integrations", [
                              ...currentIntegrations,
                              "crm",
                            ]);
                          } else {
                            setValue(
                              "integrations",
                              currentIntegrations.filter((i) => i !== "crm")
                            );
                          }
                        }}
                      />
                      <Label htmlFor="crm">CRM System</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="payment-gateway"
                        onCheckedChange={(checked) => {
                          const currentIntegrations =
                            watch("integrations") || [];
                          if (checked) {
                            setValue("integrations", [
                              ...currentIntegrations,
                              "payment-gateway",
                            ]);
                          } else {
                            setValue(
                              "integrations",
                              currentIntegrations.filter(
                                (i) => i !== "payment-gateway"
                              )
                            );
                          }
                        }}
                      />
                      <Label htmlFor="payment-gateway">Payment Gateway</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="social-media"
                        onCheckedChange={(checked) => {
                          const currentIntegrations =
                            watch("integrations") || [];
                          if (checked) {
                            setValue("integrations", [
                              ...currentIntegrations,
                              "social-media",
                            ]);
                          } else {
                            setValue(
                              "integrations",
                              currentIntegrations.filter(
                                (i) => i !== "social-media"
                              )
                            );
                          }
                        }}
                      />
                      <Label htmlFor="social-media">Social Media</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mailing-list"
                        onCheckedChange={(checked) => {
                          const currentIntegrations =
                            watch("integrations") || [];
                          if (checked) {
                            setValue("integrations", [
                              ...currentIntegrations,
                              "mailing-list",
                            ]);
                          } else {
                            setValue(
                              "integrations",
                              currentIntegrations.filter(
                                (i) => i !== "mailing-list"
                              )
                            );
                          }
                        }}
                      />
                      <Label htmlFor="mailing-list">Mailing List</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customIntegrations">Other Integrations</Label>
                  <Textarea
                    id="customIntegrations"
                    {...register("customIntegrations")}
                    placeholder="List any other specific integrations you need"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <div id="analyticsNeeds" className="mb-2">
                    Analytics Needs
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="google-analytics"
                        onCheckedChange={(checked) => {
                          const currentAnalytics =
                            watch("analyticsNeeds") || [];
                          if (checked) {
                            setValue("analyticsNeeds", [
                              ...currentAnalytics,
                              "google-analytics",
                            ]);
                          } else {
                            setValue(
                              "analyticsNeeds",
                              currentAnalytics.filter(
                                (a) => a !== "google-analytics"
                              )
                            );
                          }
                        }}
                      />
                      <Label htmlFor="google-analytics">Google Analytics</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="facebook-pixel"
                        onCheckedChange={(checked) => {
                          const currentAnalytics =
                            watch("analyticsNeeds") || [];
                          if (checked) {
                            setValue("analyticsNeeds", [
                              ...currentAnalytics,
                              "facebook-pixel",
                            ]);
                          } else {
                            setValue(
                              "analyticsNeeds",
                              currentAnalytics.filter(
                                (a) => a !== "facebook-pixel"
                              )
                            );
                          }
                        }}
                      />
                      <Label htmlFor="facebook-pixel">Facebook Pixel</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="heat-maps"
                        onCheckedChange={(checked) => {
                          const currentAnalytics =
                            watch("analyticsNeeds") || [];
                          if (checked) {
                            setValue("analyticsNeeds", [
                              ...currentAnalytics,
                              "heat-maps",
                            ]);
                          } else {
                            setValue(
                              "analyticsNeeds",
                              currentAnalytics.filter((a) => a !== "heat-maps")
                            );
                          }
                        }}
                      />
                      <Label htmlFor="heat-maps">Heat Maps</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentTab("website")}
                >
                  Previous
                </Button>
                <Button type="button" onClick={() => setCurrentTab("project")}>
                  Next: Project Parameters
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Project Parameters Tab */}
          <TabsContent value="project">
            <Card>
              <CardHeader>
                <CardTitle>Project Parameters</CardTitle>
                <CardDescription>
                  Help us understand your timeline and budget constraints.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetRange" className="flex items-center">
                    Budget Range <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup
                    id="budgetRange"
                    name="budgetRange"
                    value={watch("budgetRange")}
                    onValueChange={(value) =>
                      setValue("budgetRange", value as any)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="under1000" id="budget-under1000" />
                      <Label htmlFor="budget-under1000">Under $1,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1000-3000" id="budget-1000-3000" />
                      <Label htmlFor="budget-1000-3000">$1,000 - $3,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3000-5000" id="budget-3000-5000" />
                      <Label htmlFor="budget-3000-5000">$3,000 - $5,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="5000-10000"
                        id="budget-5000-10000"
                      />
                      <Label htmlFor="budget-5000-10000">
                        $5,000 - $10,000
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="over10000" id="budget-over10000" />
                      <Label htmlFor="budget-over10000">Over $10,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="undecided" id="budget-undecided" />
                      <Label htmlFor="budget-undecided">
                        Undecided/Flexible
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline" className="flex items-center">
                    Timeline Expectations{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup
                    id="timeline"
                    name="timeline"
                    value={watch("timeline")}
                    onValueChange={(value) =>
                      setValue("timeline", value as any)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urgent" id="timeline-urgent" />
                      <Label htmlFor="timeline-urgent">Urgent (ASAP)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="1-2months"
                        id="timeline-1-2months"
                      />
                      <Label htmlFor="timeline-1-2months">1-2 Months</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="3-6months"
                        id="timeline-3-6months"
                      />
                      <Label htmlFor="timeline-3-6months">3-6 Months</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="6plus" id="timeline-6plus" />
                      <Label htmlFor="timeline-6plus">6+ Months</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flexible" id="timeline-flexible" />
                      <Label htmlFor="timeline-flexible">Flexible</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="maintenanceNeeds"
                    className="flex items-center"
                  >
                    Maintenance Needs After Launch{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup
                    id="maintenanceNeeds"
                    name="maintenanceNeeds"
                    value={watch("maintenanceNeeds")}
                    onValueChange={(value) =>
                      setValue("maintenanceNeeds", value as any)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="maintenance-none" />
                      <Label htmlFor="maintenance-none">None needed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="updates-only"
                        id="maintenance-updates"
                      />
                      <Label htmlFor="maintenance-updates">
                        Occasional updates only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="full-service"
                        id="maintenance-full"
                      />
                      <Label htmlFor="maintenance-full">
                        Full-service maintenance
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="undecided"
                        id="maintenance-undecided"
                      />
                      <Label htmlFor="maintenance-undecided">Undecided</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    {...register("additionalInfo")}
                    placeholder="Anything else you'd like us to know about your project?"
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentTab("technical")}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentTab("marketing")}
                >
                  Next: Marketing Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Marketing Preferences Tab */}
          <TabsContent value="marketing">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Preferences</CardTitle>
                <CardDescription>
                  Let us know if you'd like to receive occasional updates and
                  tips.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletterConsent"
                    checked={watchNewsletterConsent}
                    onCheckedChange={(checked) => {
                      setValue("newsletterConsent", checked as boolean);
                    }}
                  />
                  <Label htmlFor="newsletterConsent">
                    I'd like to receive updates, tips, and occasional emails and
                    newsletters
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentTab("project")}
                >
                  Previous
                </Button>
                <div className="space-y-4">
                  {/* Regular submit button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => {
                      console.log("Submit button clicked");
                      // Don't add any additional logic here that might interfere with form submission
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Intake Form"
                    )}
                  </Button>

                  {/* Debug button - for testing only */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      console.log("Debug button clicked");
                      console.log("Current form values:", watch());

                      // Show detailed error information
                      console.log("Current errors:", errors);
                      console.log("Error keys:", Object.keys(errors));

                      // Log each error in detail
                      Object.entries(errors).forEach(([field, error]) => {
                        console.log(`Error in field '${field}':`, error);
                      });

                      // Show which required fields are missing
                      const requiredFields = [
                        "businessName",
                        "industry",
                        "contactName",
                        "contactEmail",
                        "contactPhone",
                        "preferredContact",
                        "targetAudience",
                        "expectedPages",
                        "domainStatus",
                        "hostingPreference",
                        "budgetRange",
                        "timeline",
                        "maintenanceNeeds",
                      ] as const;

                      const formValues = watch();
                      const missingFields = requiredFields.filter((field) => {
                        const value = formValues[field];
                        return (
                          !value ||
                          (typeof value === "string" && value.trim() === "")
                        );
                      });

                      console.log("Missing required fields:", missingFields);

                      // Manually trigger form submission
                      handleSubmit((data) => {
                        console.log(
                          "Manual form submission triggered with data:",
                          data
                        );
                        onSubmit(data);
                      })();
                    }}
                  >
                    Debug Submit
                  </Button>

                  {/* Fill test data button */}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      console.log("Filling form with test data");

                      // Fill required fields with test data
                      setValue("businessName", "Test Business");
                      setValue("industry", "Technology");
                      setValue("contactName", "John Doe");
                      setValue("contactEmail", "john@example.com");
                      setValue("contactPhone", "1234567890");
                      setValue("preferredContact", "email");
                      setValue("targetAudience", "Small businesses");
                      setValue("expectedPages", "5-10");
                      setValue("domainStatus", "owned");
                      setValue("existingDomain", "example.com");
                      setValue("hostingPreference", "recommend");
                      setValue("budgetRange", "3000-5000");
                      setValue("timeline", "1-2months");
                      setValue("maintenanceNeeds", "updates-only");

                      toast({
                        title: "Test data filled",
                        description: "Form has been filled with test data",
                        duration: 3000,
                      });
                    }}
                  >
                    Fill Test Data
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
