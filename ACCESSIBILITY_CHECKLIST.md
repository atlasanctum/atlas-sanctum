# Accessibility Manual Testing Checklist - WCAG 2.1 AA Compliance

This checklist covers manual testing procedures to ensure WCAG 2.1 AA compliance. Test each page/feature systematically.

## Preparation

- [ ] Enable keyboard navigation (Tab key)
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Check color contrast with tools (WAVE, Contrast Checker)
- [ ] Test on mobile devices
- [ ] Test with browser zoom (200%)

## 1. Perceivable (Information and user interface components must be presentable to users in ways they can perceive)

### 1.1 Text Alternatives

- [ ] All images have appropriate alt text
- [ ] Decorative images have empty alt (`alt=""`)
- [ ] Icons have descriptive alt text or aria-label
- [ ] Form buttons have accessible names
- [ ] Complex images have detailed descriptions

### 1.2 Time-based Media

- [ ] Videos have captions
- [ ] Audio content has transcripts
- [ ] Media controls are keyboard accessible
- [ ] Auto-playing media can be paused/stopped

### 1.3 Adaptable

- [ ] Content doesn't rely solely on color
- [ ] Color contrast ratio meets 4.5:1 (normal text) or 3:1 (large text)
- [ ] Information conveyed by color is also available through other means
- [ ] Text can be resized up to 200% without loss of functionality

### 1.4 Distinguishable

- [ ] Text is readable and understandable
- [ ] Background and foreground colors have sufficient contrast
- [ ] Text spacing can be customized without breaking layout
- [ ] No horizontal scrolling at 320px width

## 2. Operable (User interface components and navigation must be operable)

### 2.1 Keyboard Accessible

- [ ] All functionality is available via keyboard
- [ ] No keyboard traps
- [ ] Logical tab order
- [ ] Visible focus indicators on all interactive elements
- [ ] Skip links provided for long pages

### 2.2 Enough Time

- [ ] No time limits that cannot be extended
- [ ] Moving content can be paused
- [ ] Auto-updating content can be controlled

### 2.3 Seizures and Physical Reactions

- [ ] No content flashes more than 3 times per second
- [ ] No content that could trigger seizures

### 2.4 Navigable

- [ ] Page has a descriptive title
- [ ] Headings are used appropriately (H1-H6 hierarchy)
- [ ] Multiple ways to navigate (menus, search, sitemap)
- [ ] Focus order preserves meaning
- [ ] Current location is clear

## 3. Understandable (Information and the operation of user interface must be understandable)

### 3.1 Readable

- [ ] Language of the page is identified
- [ ] Unusual words and abbreviations are explained
- [ ] Reading level is appropriate
- [ ] Content is presented in a logical order

### 3.2 Predictable

- [ ] Navigation is consistent across pages
- [ ] Components with the same functionality behave consistently
- [ ] Changes of context only occur on user request
- [ ] Repeated content can be skipped

### 3.3 Input Assistance

- [ ] Error messages are clear and specific
- [ ] Error suggestions are provided
- [ ] Form labels are present and associated
- [ ] Required fields are clearly marked

## 4. Robust (Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies)

### 4.1 Compatible

- [ ] Markup is valid
- [ ] Name, role, value are programmatically determinable
- [ ] Status messages are announced
- [ ] Custom widgets follow ARIA patterns
- [ ] Live regions are properly implemented

## Screen Reader Testing

- [ ] Page structure is announced correctly
- [ ] Form fields are labeled appropriately
- [ ] Tables have proper headers
- [ ] Links have meaningful text
- [ ] Buttons have accessible names
- [ ] Dynamic content is announced
- [ ] Modal dialogs are properly managed

## Mobile Accessibility

- [ ] Touch targets are at least 44px
- [ ] Content doesn't require horizontal scrolling
- [ ] Gestures have keyboard alternatives
- [ ] Orientation changes don't break functionality

## Tools and Resources

- Browser Developer Tools (Accessibility tab)
- WAVE Web Accessibility Evaluation Tool
- axe DevTools
- Color Contrast Analyzers
- Screen Reader Testing (NVDA, JAWS, VoiceOver)

## Notes

- Document any issues found with screenshots and steps to reproduce
- Note browser and assistive technology versions used
- Record pass/fail status for each checkpoint
- Re-test after fixes are implemented