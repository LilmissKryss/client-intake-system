import * as z from "zod";

// Define the form schema using Zod
export const formSchema = z.object({
  // Basic Information
  businessName: z.string().min(1, { message: "Business name is required" }),
  industry: z.string().min(1, { message: "Industry is required" }),
  contactName: z.string().min(1, { message: "Contact name is required" }),
  contactEmail: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  contactPhone: z.string().min(1, { message: "Phone number is required" }),
  preferredContact: z.string().min(1, { message: "Preferred contact method is required" }),

  // Website Information
  websitePurpose: z.string().optional(),
  targetAudience: z.string().optional(),
  brandStyle: z.string().optional(),
  hasLogo: z.string().optional(),
  logoFile: z.any().optional(),
  expectedPages: z.string().optional(),
  desiredPages: z.string().optional(),
  contentReady: z.string().optional(),
  contentFiles: z.any().optional(),
  desiredLaunchDate: z.string().optional(),

  // Technical Information
  domainStatus: z.string().min(1, { message: "Domain status is required" }),
  existingDomain: z.string().optional(),
  preferredDomain: z.string().optional(),
  hostingPreference: z.string().min(1, { message: "Hosting preference is required" }),
  existingProvider: z.string().optional(),

  // Project Information
  budgetRange: z.string().min(1, { message: "Budget range is required" }),
  timeline: z.string().min(1, { message: "Timeline is required" }),
  maintenanceNeeds: z.string().min(1, { message: "Maintenance needs is required" }),

  // Marketing Information
  newsletterConsent: z.boolean().default(false),
});

// Type for the form data
export type FormValues = z.infer<typeof formSchema>;
