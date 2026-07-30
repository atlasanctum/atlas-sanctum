# Accessibility Testing Guidelines

This document provides guidelines for implementing and maintaining accessibility testing in the Atlas Genesis Platform.

## Overview

Accessibility testing ensures that our application is usable by people with disabilities, complying with WCAG 2.1 AA standards. We use automated tools to catch common accessibility issues early in development.

## Automated Testing

### Tools Used

- **jest-axe**: A Jest matcher for axe-core that runs accessibility checks on rendered components.
- **axe-core**: The core accessibility testing engine that checks for WCAG violations.
- **Vitest**: Our testing framework, configured with jsdom for DOM simulation.

### Running Tests

To run all accessibility tests:

```bash
npm run test
```

This will execute all test files matching the pattern `src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`.

### Adding Accessibility Tests to Components

For each new component, create a corresponding test file in the `__tests__` directory:

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { YourComponent } from '../YourComponent';

expect.extend(toHaveNoViolations);

describe('YourComponent', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<YourComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Test Configuration

- Tests run in a jsdom environment to simulate the browser DOM.
- Global test functions (`describe`, `it`, `expect`) are available without imports.
- Setup file (`src/test/setup.ts`) imports `@testing-library/jest-dom` for additional matchers.

## Best Practices for Accessible Components

### Semantic HTML

- Use appropriate HTML elements (`<button>`, `<input>`, `<nav>`, etc.) instead of generic `<div>`s.
- Provide meaningful labels for form controls using `<label>` or `aria-label`.

### Keyboard Navigation

- Ensure all interactive elements are keyboard accessible.
- Maintain logical tab order.
- Provide visible focus indicators.

### ARIA Attributes

- Use ARIA attributes sparingly and correctly.
- Prefer semantic HTML over ARIA when possible.
- Test with screen readers to ensure ARIA is announced properly.

### Color and Contrast

- Ensure sufficient color contrast (4.5:1 for normal text, 3:1 for large text).
- Don't rely solely on color to convey information.

### Images and Media

- Provide alt text for images.
- Ensure video content has captions and audio descriptions.

### Error Handling

- Provide clear error messages.
- Associate errors with form fields using `aria-describedby`.

## Common Issues and Fixes

### Missing Alt Text

```typescript
// Bad
<img src="logo.png" />

// Good
<img src="logo.png" alt="Atlas Genesis Platform Logo" />
```

### Missing Labels

```typescript
// Bad
<input type="text" placeholder="Enter your name" />

// Good
<label htmlFor="name">Name</label>
<input id="name" type="text" />
```

### Insufficient Focus Indicators

Ensure CSS includes visible focus styles:

```css
button:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
```

## Continuous Integration

Accessibility tests are run as part of the CI pipeline. All tests must pass before code can be merged.

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md)
- [React Accessibility Documentation](https://react.dev/learn/accessibility)
- [Testing Library Accessibility Guide](https://testing-library.com/docs/dom-testing-library/api-accessibility/)