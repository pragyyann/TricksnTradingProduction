"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { Calendar, Clock, MapPin, Send, Check, Copy, MessageCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CONTACT_INFO } from "@/constants";

// Morning slots
const MORNING_SLOTS = ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];

// Afternoon slots
const AFTERNOON_SLOTS = [
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
];

// Evening slots
const EVENING_SLOTS = ["04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"];

// Helper to parse slot string to hours and minutes
const parseSlotTo24h = (slot: string) => {
  const [time, ampm] = slot.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (ampm === "PM" && hours !== 12) {
    hours += 12;
  }
  if (ampm === "AM" && hours === 12) {
    hours = 0;
  }
  return { hours, minutes };
};

// Zod validation schema using superRefine for conditional fields depending on visitorType
const appointmentSchema = z.object({
  visitorType: z.enum(["Candidate", "B2B Partner"]),
  applicationId: z.string().optional(),
  companyName: z.string().optional(),
  fullName: z.string().min(1, { message: "Full name is required." }),
  phone: z.string().min(1, { message: "Mobile number is required." }),
  email: z.string()
    .min(1, { message: "Email address is required." })
    .email({ message: "Please enter a valid email address." }),
  appointmentType: z.enum(["Online Appointment", "Office Visit"]),
  appointmentDate: z.string().min(1, { message: "Please select appointment date." }),
  appointmentTime: z.string().min(1, { message: "Please select an appointment time slot." }),
  notes: z.string().optional(),
  website: z.string().optional(), // honeypot — must stay empty
}).superRefine((data, ctx) => {
  const todayStr = new Date().toISOString().split("T")[0];

  // 1. Date past check
  if (data.appointmentDate && data.appointmentDate < todayStr) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["appointmentDate"],
      message: "Please select today or a future date.",
    });
  }

  // 2. Same-day past slot check
  if (data.appointmentDate === todayStr && data.appointmentTime) {
    const now = new Date();
    const bufferTime = new Date(now.getTime() + 60 * 60 * 1000);
    const { hours, minutes } = parseSlotTo24h(data.appointmentTime);
    
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);

    if (slotTime.getTime() < bufferTime.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["appointmentTime"],
        message: "Please select an available future time slot.",
      });
    }
  }

  if (data.visitorType === "Candidate") {
    if (!data.fullName || data.fullName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fullName"],
        message: "Full name must be at least 2 characters.",
      });
    }
  }

  if (data.visitorType === "B2B Partner") {
    if (!data.companyName || data.companyName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["companyName"],
        message: "Company / Partner Name must be at least 2 characters.",
      });
    }
    if (!data.fullName || data.fullName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fullName"],
        message: "Contact Person Name must be at least 2 characters.",
      });
    }
    if (!data.notes || data.notes.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["notes"],
        message: "Partnership Details / Notes are required.",
      });
    }
  }
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

function AppointmentBookingFlow() {
  const searchParams = useSearchParams();
  const t = useTranslations("appointmentPage");
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedAppointmentId, setSubmittedAppointmentId] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  // Configure Form hook
  const appointmentForm = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    shouldFocusError: false,
    defaultValues: {
      visitorType: "Candidate",
      applicationId: "",
      companyName: "",
      fullName: "",
      phone: "",
      email: "",
      appointmentType: "Online Appointment",
      appointmentDate: "",
      appointmentTime: "",
      notes: "",
      website: "", // honeypot — must stay empty
    },
  });

  const selectedType = appointmentForm.watch("appointmentType");
  const visitorType = appointmentForm.watch("visitorType");
  const appointmentDate = appointmentForm.watch("appointmentDate");
  const appointmentTime = appointmentForm.watch("appointmentTime");

  // Reset selected slot if user changes date to today (so previously selected past slot is cleared)
  React.useEffect(() => {
    if (appointmentDate === todayStr && appointmentTime) {
      const now = new Date();
      const bufferTime = new Date(now.getTime() + 60 * 60 * 1000);
      const { hours, minutes } = parseSlotTo24h(appointmentTime);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);

      if (slotTime.getTime() < bufferTime.getTime()) {
        appointmentForm.setValue("appointmentTime", "");
      }
    }
  }, [appointmentDate, appointmentTime, appointmentForm, todayStr]);

  // Helper to check if a specific time slot is disabled (past slot on same-day with 1hr buffer)
  const isSlotDisabled = (slot: string) => {
    if (appointmentDate !== todayStr) return false;
    const now = new Date();
    const bufferTime = new Date(now.getTime() + 60 * 60 * 1000);
    const { hours, minutes } = parseSlotTo24h(slot);
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);
    return slotTime.getTime() < bufferTime.getTime();
  };

  // Auto-populate query params if available
  React.useEffect(() => {
    const rawVisitorType = searchParams.get("visitor_type");
    const appId = searchParams.get("application_id") || "";
    const name = searchParams.get("full_name") || "";
    const phone = searchParams.get("mobile_number") || searchParams.get("phone") || "";
    const email = searchParams.get("email") || "";

    if (rawVisitorType === "Candidate" || rawVisitorType === "B2B Partner") {
      appointmentForm.setValue("visitorType", rawVisitorType);
    } else if (rawVisitorType) {
      if (rawVisitorType.toLowerCase().includes("candidate") || rawVisitorType.toLowerCase().includes("seeker")) {
        appointmentForm.setValue("visitorType", "Candidate");
      } else if (rawVisitorType.toLowerCase().includes("b2b") || rawVisitorType.toLowerCase().includes("partner")) {
        appointmentForm.setValue("visitorType", "B2B Partner");
      }
    }

    if (appId) appointmentForm.setValue("applicationId", appId);
    if (name) appointmentForm.setValue("fullName", name);
    if (phone) appointmentForm.setValue("phone", phone);
    if (email) appointmentForm.setValue("email", email);
  }, [searchParams, appointmentForm]);

  const handleCopyAppointmentId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id.trim().replace(/\s+/g, ""));
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please copy manually.",
        type: "error",
      });
    }
  };

  const onSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: Record<string, string> = {
        visitor_type: data.visitorType,
        mobile_number: data.phone.trim(),
        email: data.email.trim(),
        appointment_type: data.appointmentType,
        appointment_date: data.appointmentDate,
        appointment_time: data.appointmentTime,
      };

      if (data.visitorType === "Candidate") {
        payload.application_id = data.applicationId?.trim() || "";
        payload.full_name = data.fullName.trim();
        payload.company_name = "";
        payload.notes = data.notes?.trim() || "";
      } else {
        payload.application_id = "";
        payload.full_name = data.fullName.trim();
        payload.company_name = data.companyName?.trim() || "";
        payload.notes = data.notes?.trim() || "";
      }

      // Include honeypot so server can check it
      (payload as Record<string, string>).website = (data as AppointmentFormValues & { website?: string }).website || "";

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let result;
      try {
        result = await res.json();
      } catch {
        throw new Error("Server returned an invalid response. Please try again.");
      }

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Backend server returned an error during booking.");
      }

      if (!result.appointment_id) {
        throw new Error("Backend server did not return a valid Appointment ID.");
      }

      setSubmittedAppointmentId(result.appointment_id);
      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been successfully scheduled.",
        type: "success",
      });
    } catch (err) {
      toast({
        title: "Booking Failed",
        description: err instanceof Error ? err.message : "An unexpected error occurred. Please try again later.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedAppointmentId(null);
    setCopiedId(false);
    appointmentForm.reset({
      visitorType: "Candidate",
      applicationId: "",
      companyName: "",
      fullName: "",
      phone: "",
      email: "",
      appointmentType: "Online Appointment",
      appointmentDate: "",
      appointmentTime: "",
      notes: "",
    });
  };

  const getWhatsAppLink = (appId: string | undefined, appointmentId: string) => {
    const phone = "919874259915";
    const cleanApptId = appointmentId.trim().replace(/\s+/g, "");
    const cleanAppId = appId?.trim().replace(/\s+/g, "");
    
    let text = `Hi ZOVO Gateway, I booked an appointment. My Appointment ID is ${cleanApptId}.`;
    if (cleanAppId) {
      text += ` My Application ID is ${cleanAppId}.`;
    }
    
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  // Rendering a slot section helper
  const renderSlotGroup = (title: string, slots: string[]) => {
    return (
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-[#8B6F42] font-sans">{title}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {slots.map((slot) => {
            const disabled = isSlotDisabled(slot);
            const isSelected = appointmentTime === slot;
            return (
              <button
                key={slot}
                type="button"
                disabled={disabled}
                onClick={() => appointmentForm.setValue("appointmentTime", slot, { shouldValidate: true })}
                className={`h-11 rounded-xl text-sm font-semibold border flex items-center justify-center transition-all cursor-pointer select-none active:scale-[0.98] ${
                  disabled
                    ? "bg-[#EEE7D8]/40 border-[#D8CCB8]/40 text-[#9A9184] cursor-not-allowed"
                    : isSelected
                    ? "bg-[#D4B77A] text-[#3A3024] border-[#D4B77A] shadow-sm font-bold"
                    : "bg-[#FBF9F4] text-[#756B5D] border-[#D8CCB8] hover:border-[#B8955A] hover:bg-[#EEE7D8] hover:text-[#3A3024]"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (submittedAppointmentId) {
    const cleanAppId = appointmentForm.getValues("applicationId");
    const cleanApptId = submittedAppointmentId.trim().replace(/\s+/g, "");

    return (
      <div className="w-full max-w-lg mx-auto bg-[#FBF9F4] border border-[#D8CCB8] rounded-3xl p-8 shadow-sm text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-600/30 flex items-center justify-center">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-extrabold text-[#3A3024]">
            {t("successTitle")}
          </h3>
          <p className="text-sm text-[#756B5D] leading-relaxed max-w-md mx-auto">
            Save your Appointment ID. You can present it during office visits or online call syncs.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 font-sans text-left">
          <div className="bg-[#EEE7D8] border border-[#D8CCB8] rounded-2xl p-4 space-y-1">
            <p className="text-[10px] text-[#8B6F42] font-semibold uppercase tracking-wide">Appointment ID</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-base font-mono font-bold text-[#3A3024] select-all break-all" translate="no">
                {cleanApptId}
              </p>
              <button
                type="button"
                onClick={() => handleCopyAppointmentId(cleanApptId)}
                className="text-[#756B5D] hover:text-[#B8955A] transition-colors shrink-0"
              >
                {copiedId ? <Check className="h-4.5 w-4.5 text-emerald-600" /> : <Copy className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-3 font-sans pt-2">
          <button
            type="button"
            onClick={() => handleCopyAppointmentId(cleanApptId)}
            className="w-full flex items-center justify-center gap-2 h-12 bg-[#FBF9F4] hover:bg-[#EEE7D8] text-[#3A3024] border border-[#D8CCB8] rounded-xl font-bold text-sm transition-all active:scale-[0.98] cursor-pointer shadow-sm"
          >
            {copiedId ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#B8955A]" />
                <span>{t("copyBtn")}</span>
              </>
            )}
          </button>
          <a
            href={getWhatsAppLink(cleanAppId, cleanApptId)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] cursor-pointer shadow-sm"
          >
            <MessageCircle className="h-5 w-5 fill-white" />
            {t("whatsappBtn")}
          </a>
          <a
            href="/"
            className="w-full flex items-center justify-center gap-2 h-12 bg-transparent text-[#3A3024] border border-[#D8CCB8] hover:bg-[#EEE7D8] rounded-xl font-bold text-sm transition-all duration-300"
          >
            <span>{t("backHome")}</span>
          </a>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-[#B8955A] hover:text-[#8B6F42] font-semibold cursor-pointer transition-colors pt-2"
        >
          ← Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#FBF9F4] border border-[#D8CCB8] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#EEE7D8] border border-[#D8CCB8] flex items-center justify-center shadow-sm">
            <Calendar className="h-6 w-6 text-[#B8955A]" />
          </div>
        </div>
        <h1 className="text-3xl font-display font-extrabold text-[#3A3024]">
          {t("title")}
        </h1>
        <p className="text-sm text-[#756B5D] max-w-md mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </div>
      <form onSubmit={appointmentForm.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="appt-visitor-type" className="text-sm font-semibold text-[#3A3024]">
              {t("visitorType")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="appt-visitor-type"
                className="flex h-14 w-full rounded-2xl border border-[#D8CCB8] bg-[#FBF9F4] text-[#3A3024] px-5 py-2 text-base outline-none focus:border-[#B8955A] focus:ring-1 focus:ring-[#B8955A] appearance-none cursor-pointer"
                {...appointmentForm.register("visitorType")}
              >
                <option value="Candidate" className="bg-[#FBF9F4] text-[#3A3024]">{t("candidateOption")}</option>
                <option value="B2B Partner" className="bg-[#FBF9F4] text-[#3A3024]">{t("partnerOption")}</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9A9184]">
                ▼
              </div>
            </div>
          </div>
          {visitorType === "Candidate" && (
            <>
              <div className="space-y-2">
                <label htmlFor="appt-application-id" className="text-sm font-semibold text-[#3A3024]">
                  {t("appId")} <span className="text-[#9A9184] font-normal">(Optional)</span>
                </label>
                <Input
                  id="appt-application-id"
                  placeholder="e.g. APP-1717000000"
                  error={!!appointmentForm.formState.errors.applicationId}
                  {...appointmentForm.register("applicationId")}
                />
                {appointmentForm.formState.errors.applicationId && (
                  <p className="text-xs text-red-500">{appointmentForm.formState.errors.applicationId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="appt-full-name" className="text-sm font-semibold text-[#3A3024]">
                  {t("fullName")} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="appt-full-name"
                  placeholder="Enter your full name"
                  error={!!appointmentForm.formState.errors.fullName}
                  {...appointmentForm.register("fullName")}
                />
                {appointmentForm.formState.errors.fullName && (
                  <p className="text-xs text-red-500">{appointmentForm.formState.errors.fullName.message}</p>
                )}
              </div>
            </>
          )}
          {visitorType === "B2B Partner" && (
            <>
              <div className="space-y-2">
                <label htmlFor="appt-company-name" className="text-sm font-semibold text-[#3A3024]">
                  {t("companyName")} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="appt-company-name"
                  placeholder="Enter Company / Partner Name"
                  error={!!appointmentForm.formState.errors.companyName}
                  {...appointmentForm.register("companyName")}
                />
                {appointmentForm.formState.errors.companyName && (
                  <p className="text-xs text-red-500">{appointmentForm.formState.errors.companyName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="appt-contact-person" className="text-sm font-semibold text-[#3A3024]">
                  {t("contactPerson")} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="appt-contact-person"
                  placeholder="Enter contact person name"
                  error={!!appointmentForm.formState.errors.fullName}
                  {...appointmentForm.register("fullName")}
                />
                {appointmentForm.formState.errors.fullName && (
                  <p className="text-xs text-red-500">{appointmentForm.formState.errors.fullName.message}</p>
                )}
              </div>
            </>
          )}
          <div className="space-y-2">
            <label htmlFor="appt-phone" className="text-sm font-semibold text-[#3A3024]">
              {t("phone")} <span className="text-red-500">*</span>
            </label>
            <Input
              id="appt-phone"
              type="tel"
              placeholder="98765 43210"
              error={!!appointmentForm.formState.errors.phone}
              {...appointmentForm.register("phone")}
            />
            {appointmentForm.formState.errors.phone && (
              <p className="text-xs text-red-500">{appointmentForm.formState.errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="appt-email" className="text-sm font-semibold text-[#3A3024]">
              {t("email")} <span className="text-red-500">*</span>
            </label>
            <Input
              id="appt-email"
              type="email"
              placeholder="example@email.com"
              error={!!appointmentForm.formState.errors.email}
              {...appointmentForm.register("email")}
            />
            {appointmentForm.formState.errors.email && (
              <p className="text-xs text-red-500">{appointmentForm.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="appt-type" className="text-sm font-semibold text-[#3A3024]">
              {t("appType")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="appt-type"
                className={`flex h-14 w-full rounded-2xl border border-[#D8CCB8] bg-[#FBF9F4] text-[#3A3024] px-5 py-2 text-base outline-none focus:border-[#B8955A] focus:ring-1 focus:ring-[#B8955A] appearance-none cursor-pointer ${
                  appointmentForm.formState.errors.appointmentType ? "border-red-500 focus:ring-red-500" : ""
                }`}
                {...appointmentForm.register("appointmentType")}
              >
                <option value="Online Appointment" className="bg-[#FBF9F4] text-[#3A3024]">{t("onlineApp")}</option>
                <option value="Office Visit" className="bg-[#FBF9F4] text-[#3A3024]">{t("officeVisit")}</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9A9184]">
                ▼
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            {selectedType === "Office Visit" ? (
              <div className="flex items-start gap-3 bg-[#EEE7D8] border border-[#D8CCB8] rounded-2xl p-4 text-[#3A3024]">
                <MapPin className="h-5 w-5 text-[#B8955A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8B6F42]">Office Location</p>
                  <p className="text-sm font-semibold mt-1 whitespace-pre-line">
                    {CONTACT_INFO.address}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-[#EEE7D8] border border-[#D8CCB8] rounded-2xl p-4 text-[#3A3024]">
                <Clock className="h-5 w-5 text-[#B8955A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8B6F42]">Online Sync Details</p>
                  <p className="text-sm font-semibold mt-1">
                    Our team will contact you online through call or meeting link if available.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Date Input with min range */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="appt-date" className="text-sm font-semibold text-[#3A3024]">
              {t("prefDate")} <span className="text-red-500">*</span>
            </label>
            <Input
              id="appt-date"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="h-14 w-full rounded-2xl border border-[#D8CCB8] bg-[#FBF9F4] px-5 text-base text-[#3A3024] outline-none [color-scheme:light] placeholder:text-[#9A9184] focus:border-[#B8955A] focus:ring-1 focus:ring-[#B8955A]"
              {...appointmentForm.register("appointmentDate")}
            />
            {appointmentForm.formState.errors.appointmentDate && (
              <p className="text-xs text-red-500">{appointmentForm.formState.errors.appointmentDate.message}</p>
            )}
          </div>

          {/* Time Slots Area (Morning / Afternoon / Evening) */}
          <div className="space-y-4 md:col-span-2">
            <label className="text-sm font-semibold text-[#3A3024] flex items-center gap-1.5">
              {t("prefTime")} <span className="text-red-500">*</span>
            </label>
            
            {appointmentForm.formState.errors.appointmentTime && (
              <p className="text-xs text-red-500 font-semibold">{appointmentForm.formState.errors.appointmentTime.message}</p>
            )}

            {!appointmentDate ? (
              <div className="bg-[#EEE7D8]/50 border border-[#D8CCB8] rounded-2xl p-6 text-center text-sm text-[#756B5D] font-medium">
                Please select a preferred date first to see available slots.
              </div>
            ) : (
              <div className="space-y-6 bg-[#EEE7D8]/50 border border-[#D8CCB8] rounded-3xl p-4 sm:p-6">
                {renderSlotGroup("Morning", MORNING_SLOTS)}
                {renderSlotGroup("Afternoon", AFTERNOON_SLOTS)}
                {renderSlotGroup("Evening", EVENING_SLOTS)}
              </div>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="appt-notes" className="text-sm font-semibold text-[#3A3024]">
              {visitorType === "Candidate" ? (
                <>
                  {t("notes")} <span className="text-[#9A9184] font-normal">(Optional)</span>
                </>
              ) : (
                <>
                  {t("partnerNotes")} <span className="text-red-500">*</span>
                </>
              )}
            </label>
            <Textarea
              id="appt-notes"
              placeholder={
                visitorType === "Candidate"
                  ? "Provide any additional details or requirements..."
                  : "Please detail your proposed collaboration, target domains, manpower count, or timeline..."
              }
              error={!!appointmentForm.formState.errors.notes}
              {...appointmentForm.register("notes")}
            />
            {appointmentForm.formState.errors.notes && (
              <p className="text-xs text-red-500">{appointmentForm.formState.errors.notes.message}</p>
            )}
          </div>
        </div>
        <div className="pt-4 space-y-3">
          {/* Honeypot field — hidden from real users, catches bots */}
          <div aria-hidden="true" className="absolute opacity-0 pointer-events-none" style={{ left: "-9999px", top: "-9999px" }}>
            <label htmlFor="appt-website">Website</label>
            <input
              id="appt-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...appointmentForm.register("website" as keyof AppointmentFormValues)}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center gap-2 h-12 font-extrabold text-sm transition-all duration-300 shadow-sm rounded-xl"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            <Send className="h-4 w-4 shrink-0" />
            <span>{isSubmitting ? t("bookingText") : t("bookBtn")}</span>
          </Button>
          <a
            href="https://wa.me/919874259915?text=Hi%20ZOVO%20Gateway%2C%20I%20want%20to%20book%20an%20appointment."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 h-12 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] cursor-pointer font-sans shadow-sm"
          >
            <MessageCircle className="h-5 w-5 fill-white" />
            {t("whatsappBtn")}
          </a>
        </div>
      </form>
    </div>
  );
}

export default function AppointmentPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 w-full bg-[#F7F3EA] text-[#3A3024] pt-32 pb-28 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="max-w-4xl mx-auto">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#756B5D] hover:text-[#3A3024] transition-colors cursor-pointer group focus:outline-none"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-[#B8955A]" />
              <span>Back to Home</span>
            </a>
          </div>

          <React.Suspense
            fallback={
              <div className="w-full max-w-2xl mx-auto bg-[#FBF9F4] rounded-3xl border border-[#D8CCB8] shadow-sm p-10 flex flex-col items-center gap-4">
                <span className="w-10 h-10 rounded-full border-4 border-[#B8955A] border-t-transparent animate-spin" />
                <p className="text-sm text-[#756B5D] font-semibold font-sans">
                  Loading appointment form...
                </p>
              </div>
            }
          >
            <AppointmentBookingFlow />
          </React.Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}
