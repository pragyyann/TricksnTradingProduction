# Content Customization & Media Management Manual

This document provides step-by-step instructions on how to manually customize all text copy, contact details, lists (countries, services, industries), maps, and media elements on your website.

---

## 🗃️ Centralized Text Configuration File

To avoid searching through React elements, almost all text, contacts, lists, and links are stored inside a single centralized configuration file:

* **Target File**: `src/constants/index.ts`

### 1. How to Update Contact Details
Open the constants file and modify the values in the `CONTACT_INFO` object:

```typescript
// src/constants/index.ts
export const CONTACT_INFO = {
  phone: "+91 9220809078",                                                     // Displayed in text
  phoneRaw: "+919220809078",                                                  // Triggered on "Call Now" anchors
  email: "hr@zovogateway.com",                                                 // Displayed & triggered on mailto: anchors
  address: "Plot No. 42, Sector 11, CBD Belapur, Navi Mumbai, Maharashtra...", // Physical office text
  whatsappUrl: "https://wa.me/919220809078?text=...",                          // Link pre-filled texts
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=..."                      // Google Maps iframe URL
};
```

---

### 2. How to Edit the Google Map Location
1. Go to [Google Maps](https://maps.google.com).
2. Search for your office address.
3. Click the **"Share"** button.
4. Select the **"Embed a map"** tab.
5. Copy the URL inside the `src` attribute of the generated iframe:
   * E.g., `https://www.google.com/maps/embed?pb=...`
6. Replace the `mapEmbedUrl` string inside `CONTACT_INFO` in `src/constants/index.ts` with your new URL.

---

### 3. How to Edit Countries and Vacancies
To update the card list of international countries (e.g. adding a new European country like Germany or Poland):

1. Open `src/constants/index.ts`.
2. Find the `COUNTRIES` array.
3. Add a new object inside the array matching the `Country` structure:

```typescript
{
  id: "germany",
  name: "Germany",
  code: "DE",
  description: "Work opportunities in IT, engineering, and nursing fields with visa sponsorship support.",
  flag: "🇩🇪" // Simply paste a standard Unicode Flag emoji
}
```

* **Immediate Effect**: The page compiles instantly. The new country card renders automatically, its CTA works immediately, and the country gets populated inside the Job Seeker preferred country dropdown selector!

---

### 4. How to Update Services and Icons
To edit a service card description or change its icon:

1. Locate `SERVICES` in `src/constants/index.ts`.
2. Modify the description, title, or change `iconName`.
3. If changing `iconName`, ensure it's a valid icon exported from `lucide-react`, and update the `ICON_MAP` bindings inside:
   * `src/components/ServicesSection.tsx`
   * `src/components/IndustrySection.tsx`

---

## 🖼️ Media & Asset Management

### 1. Replacing Logos
* We use a vector icon `<Globe2 className="h-6 w-6" />` from Lucide coupled with stylized text tags for the logo.
* If you want to use a custom SVG image logo instead:
  1. Store the new SVG logo file inside the `public/` directory (e.g. `public/logo.svg`).
  2. In `src/components/Navbar.tsx` and `src/components/Footer.tsx`, replace the `<Globe2 className="h-6 w-6" />` element with an optimized Next.js image component:
     ```typescript
     import Image from "next/image";
     
     // inside JSX:
     <Image src="/logo.svg" alt="Trendy Fortune Logo" width={40} height={40} />
     ```

### 2. Changing Background visuals
* All decorative visual elements (blurs, nodes connection paths, pulsating grids) are lightweight inline CSS patterns and vector SVGs. This ensures 100/100 performance scores.
* If you wish to replace the animated vector on the right side of the Hero with an actual office/recruitment photo:
  1. Place the photo in `public/images/hero-recruitment.jpg`.
  2. Open `src/components/Hero.tsx`.
  3. Replace the entire `<svg className="w-full h-full text-slate-100"...>` tag block with:
     ```typescript
     import Image from "next/image";

     // inside JSX replacing the SVG tag:
     <Image
       src="/images/hero-recruitment.jpg"
       alt="Trendy Fortune Global Team"
       width={600}
       height={450}
       className="object-cover rounded-2xl w-full h-full"
     />
     ```
