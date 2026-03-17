V-Designer Style Guide
Here's a comprehensive style guide description based on the screenshots:

Color System
Brand Colors
Token	Hex	Usage
Primary	#092C4C	Dark navy blue. Used for the sidebar, top bar, primary buttons, and key UI chrome
Secondary	Bright cyan/sky blue (approximately #2F9FCA)	Accent color, used sparingly for highlights
State Colors
Token	Hex	Usage
Info	#2F80ED	Informational messages and indicators
Success	#27AE60	Success states, confirmations
Warning	#E2B93B	Warnings, caution indicators
Error	#EB5757	Error states, destructive actions
Neutrals — Blacks
Token	Hex
Black 1	#000000
Black 2	#1D1D1D
Black 3	#282828
White	#FFFFFF
Neutrals — Greys
Token	Hex
Gray 1	#333333
Gray 2	#4F4F4F
Gray 3	#828282
Gray 4	#BDBDBD
Gray 5	#E0E0E0
Layout Structure
Top bar: Full-width horizontal bar, solid Primary (#092C4C), approximately 40px tall. Contains the app logo (a golden/yellow flame icon) in the top-left corner.
Sidebar: Vertical left-hand navigation, solid Primary (#092C4C), approximately 60px wide. Contains 5-6 icon-only navigation items stacked vertically, rendered in white/light color. Icons are outlined/line-style, roughly 24-28px.
Main content area: The remaining space has a light blue-grey background (approximately #E0E4EC or #DFE3EB). Content is centered within this area.
Components
Login Card
Container: White (#FFFFFF) rectangle with rounded corners (~12-16px border-radius) and a subtle drop shadow (soft, diffused, ~4-8px blur, low opacity).
Width: Approximately 400px, centered horizontally and vertically in the content area.
Padding: Generous internal padding (~32-40px).
Heading: "Log in" — bold, black (#000000 or Black 1), large font size (~28-32px), sans-serif.
Subtitle: "PV-Designer" — medium weight, black or dark grey, smaller than heading (~18-20px), sans-serif.
Spacing: Clear vertical spacing (~20-24px) between heading group, form fields, and button.
Form Elements
Label: "Badgenummer" — small text (~14px), dark grey or black, sans-serif, positioned above the input with ~8px gap.
Text input: Full-width within the card, ~44-48px height, 1px solid light grey border (~#BDBDBD or Gray 4), rounded corners (~6-8px), placeholder text in Gray 3 (#828282), placeholder example: "123-456789".
No visible focus ring in screenshot — but implement a Primary color focus ring for accessibility.
Primary Button
"Inloggen" button: Right-aligned within the card.
Shape: Pill/capsule shape (fully rounded ends, border-radius ~24px).
Background: Primary (#092C4C).
Text: White, ~14-16px, medium/semi-bold weight, sans-serif.
Padding: ~12px vertical, ~32px horizontal.
No visible border or shadow.
Typography
Font family: Sans-serif (likely a system font or a clean sans-serif such as Inter, Roboto, or similar).
Heading (H1): Bold, ~28-32px, black.
Subtitle: Medium/semi-bold, ~18-20px, dark color.
Labels: Regular weight, ~14px, dark grey/black.
Button text: Semi-bold, ~14-16px, white on dark background.
Placeholder text: Regular, ~14px, medium grey.
Design Principles (inferred)
Corporate/professional tone: Dark navy brand color conveys trustworthiness and formality.
Minimal and clean: Generous whitespace, limited color palette, no decorative elements.
Card-based UI: Content presented in elevated white cards over a neutral background.
Icon-only sidebar navigation: Compact, relies on recognizable iconography rather than text labels.
Dutch language UI: Labels and buttons are in Dutch ("Badgenummer", "Inloggen").
Accessibility: High contrast between navy buttons/bars and white text; form labels are explicit.
