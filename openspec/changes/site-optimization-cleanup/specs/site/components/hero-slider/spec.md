# Spec Delta

## MODIFIED Requirements

### Requirement: HeroSlider script loaded from shared asset
The system SHALL load the slider interaction script from `/assets/hero-slider.js` via `<script src="/assets/hero-slider.js" defer is:inline>` instead of embedding 50+ lines of inline JavaScript in the component.

#### Scenario: Slider functions identically
- **WHEN** HeroSlider renders with multiple slides
- **THEN** auto-advance, prev/next buttons, and dot navigation work identically to inline script version

#### Scenario: Script loads once per page
- **WHEN** multiple HeroSlider instances exist on a page (not current usage but possible)
- **THEN** script executes independently for each slider instance via document.querySelectorAll

#### Scenario: No inline script in component output
- **WHEN** HeroSlider component renders
- **THEN** component HTML contains no `<script>` tag with slider logic; only the external script reference