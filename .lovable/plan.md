

# Add Doctor Specialty Recommendation to Injury Analysis

## What Changes
When the AI analyzes a wound image, it will also recommend the type of doctor/specialist (e.g., Orthopedic Surgeon, Dermatologist, General Surgeon) who treats that specific injury -- displayed in both English and Hindi on the results page.

## Changes Required

### 1. Update AI Prompt (Edge Function)
Add two new fields to the JSON schema in the system prompt:
- `doctorType`: Specialist name in English (e.g., "Orthopedic Surgeon", "Dermatologist", "Plastic Surgeon")
- `doctorTypeHi`: Same in Hindi (e.g., "हड्डी रोग विशेषज्ञ", "त्वचा विशेषज्ञ")

### 2. Update AssessmentContext
Add `doctorType` and `doctorTypeHi` optional fields to the `AssessmentResult` interface.

### 3. Update Results Page
Display a new "Recommended Specialist" section in the result card, showing the doctor type with a stethoscope icon, between the injury type and next action sections.

### 4. Update Capture Page
Pass the new `doctorType` and `doctorTypeHi` fields from the AI response into the assessment context.

---

## Technical Details

**Edge Function** (`supabase/functions/analyze-injury/index.ts`):
- Add to the JSON schema in the prompt: `"doctorType"` and `"doctorTypeHi"` fields
- Add examples: burns -> Plastic Surgeon, fractures -> Orthopedic Surgeon, cuts -> General Surgeon, eye injuries -> Ophthalmologist, etc.

**AssessmentContext** (`src/contexts/AssessmentContext.tsx`):
- Add `doctorType?: string` and `doctorTypeHi?: string` to `AssessmentResult`

**ResultsPage** (`src/pages/ResultsPage.tsx`):
- New section with stethoscope icon showing the recommended specialist between injury type and next action

**CapturePage** (`src/pages/CapturePage.tsx`):
- Include `doctorType` and `doctorTypeHi` when setting the result from the AI response
