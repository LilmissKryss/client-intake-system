"use client";

import { useState } from "react";
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
  logoUpload: z.string().optional(),

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
  contentUpload: z.string().optional(),
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
  // We're using window.location.href for redirection instead of the router
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

  const onSubmit = async (data: FormValues) => {
    console.log("onSubmit function called with data:", data);
    setIsSubmitting(true);

    // Always show a toast to confirm the submission attempt
    toast({
      title: "Processing submission...",
      description: "Please wait while we process your form.",
      duration: 3000,
    });

    // Check if there are any errors and identify which tabs have errors
    const errorTabs = [];

    // Basic tab errors
    if (
      errors.businessName ||
      errors.industry ||
      errors.contactName ||
      errors.contactEmail ||
      errors.contactPhone ||
      errors.preferredContact
    ) {
      errorTabs.push("basic");
    }

    // Website tab errors
    if (errors.targetAudience || errors.expectedPages) {
      errorTabs.push("website");
    }

    // Technical tab errors
    if (errors.domainStatus || errors.hostingPreference) {
      errorTabs.push("technical");
    }

    // Project tab errors
    if (errors.budgetRange || errors.timeline || errors.maintenanceNeeds) {
      errorTabs.push("project");
    }

    // Marketing tab errors
    if (errors.newsletterConsent) {
      errorTabs.push("marketing");
    }

    // Update the state with tabs that have errors
    setTabsWithErrors(errorTabs);

    // Show error message if there are errors
    if (errorTabs.length > 0) {
      console.log("Form has errors in tabs:", errorTabs);
      setIsSubmitting(false);

      // Navigate to the first tab with errors
      setCurrentTab(errorTabs[0]);

      toast({
        title: "Please fix the errors",
        description: `There are errors in the ${errorTabs.join(
          ", "
        )} section(s). Please check and try again.`,
        variant: "destructive",
        duration: 5000,
      });

      return;
    }

    try {
      // Show success toast
      toast({
        title: "Form submitted successfully!",
        description:
          "We've received your information and will be in touch soon.",
        duration: 3000,
      });

      // IMPORTANT: This is the key part - redirect to thank you page
      console.log(
        "Form submitted successfully, redirecting to thank you page..."
      );

      // Use setTimeout to ensure the toast is visible before redirecting
      setTimeout(() => {
        // Use plain JavaScript redirect for maximum compatibility
        window.location.href = "/thank-you";
      }, 1000);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Your form couldn't be submitted. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { toast } = useToast();

  // Debug submission
  const debugSubmit = () => {
    console.log("Form submission attempted");
    console.log("Current errors:", errors);
    console.log("Form values:", watch());
  };

  // We're now redirecting to a dedicated thank you page instead of showing an inline success message

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger
              value="basic"
              className={
                tabsWithErrors.includes("basic")
                  ? "border-red-500 border-b-2"
                  : ""
              }
            >
              {tabsWithErrors.includes("basic") ? (
                <span className="flex items-center">
                  Basic Info
                  <span className="ml-1 text-red-500">*</span>
                </span>
              ) : (
                "Basic Info"
              )}
            </TabsTrigger>
            <TabsTrigger
              value="branding"
              className={
                tabsWithErrors.includes("branding")
                  ? "border-red-500 border-b-2"
                  : ""
              }
            >
              {tabsWithErrors.includes("branding") ? (
                <span className="flex items-center">
                  Branding
                  <span className="ml-1 text-red-500">*</span>
                </span>
              ) : (
                "Branding"
              )}
            </TabsTrigger>
            <TabsTrigger
              value="website"
              className={
                tabsWithErrors.includes("website")
                  ? "border-red-500 border-b-2"
                  : ""
              }
            >
              {tabsWithErrors.includes("website") ? (
                <span className="flex items-center">
                  Website Needs
                  <span className="ml-1 text-red-500">*</span>
                </span>
              ) : (
                "Website Needs"
              )}
            </TabsTrigger>
            <TabsTrigger
              value="technical"
              className={
                tabsWithErrors.includes("technical")
                  ? "border-red-500 border-b-2"
                  : ""
              }
            >
              {tabsWithErrors.includes("technical") ? (
                <span className="flex items-center">
                  Technical
                  <span className="ml-1 text-red-500">*</span>
                </span>
              ) : (
                "Technical"
              )}
            </TabsTrigger>
            <TabsTrigger
              value="project"
              className={
                tabsWithErrors.includes("project")
                  ? "border-red-500 border-b-2"
                  : ""
              }
            >
              {tabsWithErrors.includes("project") ? (
                <span className="flex items-center">
                  Project Details
                  <span className="ml-1 text-red-500">*</span>
                </span>
              ) : (
                "Project Details"
              )}
            </TabsTrigger>
            <TabsTrigger
              value="marketing"
              className={
                tabsWithErrors.includes("marketing")
                  ? "border-red-500 border-b-2"
                  : ""
              }
            >
              {tabsWithErrors.includes("marketing") ? (
                <span className="flex items-center">
                  Marketing
                  <span className="ml-1 text-red-500">*</span>
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
                  <Label htmlFor="businessName">Business Name *</Label>
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
                  <Label htmlFor="industry">Industry/Sector *</Label>
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
                    <Label htmlFor="contactName">Contact Person's Name *</Label>
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
                    <Label htmlFor="contactEmail">Email Address *</Label>
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
                  <Label htmlFor="contactPhone">Phone Number *</Label>
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
                  <Label>Preferred Contact Method *</Label>
                  <RadioGroup
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
                  <Label>Brand Style *</Label>
                  <Select
                    defaultValue="modern"
                    onValueChange={(value) =>
                      setValue("brandStyle", value as any)
                    }
                  >
                    <SelectTrigger>
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
                      <Input
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
                  <Label>Do you have an existing logo? *</Label>
                  <RadioGroup
                    defaultValue="no"
                    value={watchHasLogo}
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
                  <Label>Website Purpose *</Label>
                  <Select
                    defaultValue="informational"
                    onValueChange={(value) =>
                      setValue("websitePurpose", value as any)
                    }
                  >
                    <SelectTrigger>
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
                      <Input
                        placeholder="Please specify your website purpose"
                        {...register("purposeOther")}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience *</Label>
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
                  <Label>Key Features Needed</Label>
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
                  <Label htmlFor="expectedPages">
                    Estimated Number of Pages *
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
                  <Label>Is Your Content Ready? *</Label>
                  <RadioGroup
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
                  <Label>Domain Status *</Label>
                  <RadioGroup
                    defaultValue="unsure"
                    value={watchDomainStatus}
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
                  <Label>Hosting Preference *</Label>
                  <RadioGroup
                    defaultValue="recommend"
                    value={watchHostingPreference}
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
                  <Label>Integration Requirements</Label>
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
                  <Label>Analytics Needs</Label>
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
                  <Label>Budget Range *</Label>
                  <RadioGroup
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
                  <Label>Timeline Expectations *</Label>
                  <RadioGroup
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
                  <Label>Maintenance Needs After Launch *</Label>
                  <RadioGroup
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
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => {
                      debugSubmit();

                      // Check for errors in each tab
                      const errorTabs = [];

                      // Basic tab errors
                      if (
                        errors.businessName ||
                        errors.industry ||
                        errors.contactName ||
                        errors.contactEmail ||
                        errors.contactPhone ||
                        errors.preferredContact
                      ) {
                        errorTabs.push("basic");
                      }

                      // Website tab errors
                      if (errors.targetAudience || errors.expectedPages) {
                        errorTabs.push("website");
                      }

                      // Technical tab errors
                      if (errors.domainStatus || errors.hostingPreference) {
                        errorTabs.push("technical");
                      }

                      // Project tab errors
                      if (
                        errors.budgetRange ||
                        errors.timeline ||
                        errors.maintenanceNeeds
                      ) {
                        errorTabs.push("project");
                      }

                      // Marketing tab errors
                      if (errors.newsletterConsent) {
                        errorTabs.push("marketing");
                      }

                      // Update the state with tabs that have errors
                      setTabsWithErrors(errorTabs);

                      // Show a toast if there are errors
                      if (errorTabs.length > 0) {
                        toast({
                          title: "Form has errors",
                          description: `Please check the following tabs: ${errorTabs.join(
                            ", "
                          )}`,
                          variant: "destructive",
                          duration: 5000,
                        });
                      }
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
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
